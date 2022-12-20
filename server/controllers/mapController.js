const fetch = require("node-fetch");
const config = require("../../config.json");

const mapController = {};

const privateKey = config.privateKey;
const publicKey = config.publicKey;

const locations = {
  switzerFalls: 'ven_556a5a4f6c30476930624f52416f776f5f6564625f785f4a496843',
  griffithPark: 'ven_55353848563073436c555852416f77416e35514a7a626c4a496843',
  elysianPark: 'ven_556a5a4f6c30476930624f52416f776f5f6564625f785f4a496843',
  eatonCanyon: 'ven_55353848563073436c555852416f77416e35514a7a626c4a496843',
  runyonCanyon: 'ven_55353848563073436c555852416f77416e35514a7a626c4a496843',
};

const conversion = {
  "-2": 10,
  "-1": 30,
  0: 50,
  1: 70,
  2: 90,
};

const latlong = {
  switzerFalls: { latitude: 34.2638892, longitude: -118.1740902 },
  griffithPark: { latitude: 34.1281475, longitude: -118.3010914 },
  elysianPark: { latitude: 34.0820739, longitude: -118.2497133 },
  eatonCanyon: { latitude: 34.1783564, longitude: -118.0966051 },
  runyonCanyon: { latitude: 34.1193155, longitude: -118.353079 },
};

mapController.getHeat = (req, res, next) => {
  const trailDataArray = [];

  for (let trail in locations) {
    const trailDataPromise = new Promise((resolve, reject) => {
      console.log(`https://besttime.app/api/v1/forecasts/now?api_key_public=${publicKey}&venue_id=${locations[trail]}`);
      fetch(`https://besttime.app/api/v1/forecasts/now?api_key_public=${publicKey}&venue_id=${locations[trail]}`)
      .then((data) => {
        data.json().then((parsedData) => {
          console.log(parsedData);
          const trailName = parsedData.venue_info.venue_name;
          const weight = conversion[parsedData.analysis.hour_analysis.intensity_nr];
          const trailData = {
            trailName,
            heatMap: {
              latitude: latlong[trail].latitude,
              longitude: latlong[trail].longitude,
              weight,
            }
          };
          resolve(trailData);
        });
      })
      .catch((err) => {
        return next(err);
      })

      /*const trailName = trail;//'Griffith Park Trails';
      const weight = conversion[-2];
      const trailData = {
        trailName,
        heatMap: {
          latitude: latlong[trail].latitude,
          longitude: latlong[trail].longitude,
          weight,
        }
      };
      resolve(trailData);*/
    })
    trailDataArray.push(trailDataPromise)
  }
  
  Promise.all(trailDataArray)
    .then((trailDataArray) => {
      const heatMapStats = [];
      const trailNames = [];
      trailDataArray.forEach(dataObj => {
        heatMapStats.push(dataObj.heatMap);
        trailNames.push(dataObj.trailName);
      })
      const mapInfo = { 
        heatMapStats, 
        trailNames
      }
      res.locals.data = mapInfo;
    })
    .then(() => next())

};

module.exports = mapController;
