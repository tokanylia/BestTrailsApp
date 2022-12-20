const config = require('../config.json');
const myURI = config.postgres_uri;

const { Pool } = require('pg');

const pool = new Pool({connectionString: myURI})

module.exports = {
  query: function (text, params, callback) {
    return pool.query(text, params, callback);
  }
};