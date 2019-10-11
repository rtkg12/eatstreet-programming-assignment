/**
 * Returns updatedVals with only the params from row which are present
 */
module.exports.validCSVRowInput = function validCSVRowInput(row) {
  const updatedVals = {};

  if (row[1]) {
    updatedVals.city = row[1];
  }

  if (row[2]) {
    updatedVals.mixedCity = row[2];
  }
  if (row[3]) {
    updatedVals.stateCode = row[3];
  }
  if (row[4]) {
    updatedVals.stateFIPS = parseInt(row[4], 10);
  }
  if (row[5]) {
    updatedVals.county = row[5];
  }

  if (row[6]) {
    updatedVals.mixedCounty = row[6];
  }

  if (row[7]) {
    updatedVals.countyFIPS = parseInt(row[7], 10);
  }

  if (row[8]) {
    updatedVals.latitude = parseFloat(row[8]);
  }

  if (row[9]) {
    updatedVals.longitude = parseFloat(row[9]);
  }

  if (row[10]) {
    updatedVals.gmt = parseInt(row[10], 10);
  }

  if (row[11]) {
    // (row[11] === 'Y') if want to store as binary
    updatedVals.dst = row[11];
  }

  return updatedVals;
};
