const mongoose = require('mongoose');

const zipcodeSchema = new mongoose.Schema({
  zipCode: Number,
  city: String,
  mixedCity: String,
  stateCode: String,
  stateFIPS: Number,
  county: String,
  mixedCounty: String,
  countyFIPS: Number,
  latitude: Number,
  longitude: Number,
  gmt: Number,
  dst: String,
});

module.exports = mongoose.model('ZipCode', zipcodeSchema);
