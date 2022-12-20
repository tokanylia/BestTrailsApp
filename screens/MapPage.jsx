import React, { useEffect, useState, useRef} from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Heatmap,
  Marker,
  Callout,
} from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Switch
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import config from "../config.json";

export function MapPage({ route }) {
  const { userInfo } = route.params;
  const [dark, setDark] = useState(false);
  const toggleSwitch = () => setDark((prevState) => !prevState);
  const [trails, setTrails] = useState([]);
  const [heatMapStats, setHeatMapStats] = useState([]);
  const [faves, setFaves] = useState([]);

  const [like, setLike] = useState(false);
  let markerRef = useRef(null);

  useEffect(() => {
    fetch(`http://${config.ip_address}:5001/api/getData`)
      .then((res) => res.json())
      .then((res) => {
        setHeatMapStats(res.heatMapStats);
        setTrails(res.trailNames);
      })
      .catch((err) => console.log(err));

    if(userInfo) {
      fetch(`http://${config.ip_address}:5001/api/getFaves?user_id=${userInfo.id}`)
          .then((res) => res.json())
          .then((parsedRes) => setFaves(parsedRes))
          .catch((err) => console.log(err));
    }

  }, []);

  function heartChange(trailName) {
    if(!userInfo) {
      return;
    }

    if(like) {
      deleteFaves(trailName);
    } else {
      addFaves(trailName);
    }

    setTimeout(() => { markerRef.current.showCallout(); }, 1);
  }

  function addFaves(trailName) {
    const postObj = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.id,
        trail_name: trailName,
      }),
    };
    fetch(`http://192.168.1.64:5001/api/addFaves`, postObj)
        .then(() => {
          faves.push(trailName);
          setLike((prev) => !prev);
        })
        .catch((err) => console.log(err));
  }

  function deleteFaves(trailName) {
    const deleteObj = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user_id: userInfo.id,
        trail_name: trailName,
      }),
    };
    fetch(`http://192.168.1.64:5001/api/deleteFaves`, deleteObj)
        .then(() => {
          setFaves(faves.filter(item => item !== trailName));
          setLike((prev) => !prev);
        })
        .catch((err) => console.log(err));
  }

  function heartCheck(trailName) {
    return faves.includes(trailName);
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: 34.052235,
          longitude: -118.243683,
          latitudeDelta: 0.09,
          longitudeDelta: 0.0121,
        }}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={dark ? mapDarkMode : []}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 35,
          }}
        >
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={dark ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={dark}
          />
        </View>

        {heatMapStats.map((marker, i) => {
          return (
            <Marker
              key={i}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              ref={markerRef}
            >
              <Callout tooltip onPress={() => {heartChange(trails[i])}}>
                <View>
                  <View style={styles.bubble}>
                    <Text style={styles.name}>{trails[i]}</Text>
                    <Ionicons
                      name="ios-heart"
                      style={heartCheck(trails[i]) ? styles.heartIconRed : styles.heartIconGray}
                    />
                  </View>
                  <View style={styles.arrowBorder} />
                  <View style={styles.arrow} />
                </View>
              </Callout>
            </Marker>
          );
        })}
        <Heatmap
          points={heatMapStats}
          radius={50}
          gradient={{
            colors: ["#0DE5FF", "#0D14FF", "#980DFF", "#FF0DED", "#E50000"],
            startPoints: [0.01, 0.25, 0.5, 0.75, 1],
            colorMapSize: 256,
          }}
        />
      </MapView>
    </View>
  );
}

// Map styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  map: {
    flex: 1,
  },
  // Callout bubble
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
    // marginBottom: -15
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
    alignItems: "center",
  },
  // Character image
  image: {
    width: "100%",
    height: 80,
  },
  heartIconRed: {
    color: "red",
    fontSize: 25,
    alignItems: "flex-end",
  },
  heartIconGray: {
    color: "#DCDCDC",
    fontSize: 25,
    alignItems: "flex-end",
  },
});

// Map dark mode
const mapDarkMode = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8ec3b9",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1a3646",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#64779e",
      },
    ],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#334e87",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6f9ba5",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3C7680",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#304a7d",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c6675",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#255763",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#b0d5ce",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#3a4762",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#0e1626",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#4e6d70",
      },
    ],
  },
];
