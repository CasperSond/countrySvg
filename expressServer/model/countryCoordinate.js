const mongoose = require('mongoose');

const country = new mongoose.Schema({
  name: String,
  countryId: {
    ADMIN: String,
    ISO_A3: String

  },
  coordinates: Object

})

const coordinatesShort = mongoose.model('coordinate', country);

module.exports = coordinatesShort;
