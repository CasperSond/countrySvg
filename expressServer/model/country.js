const mongoose = require('mongoose');

const country = new mongoose.Schema({
  ADMIN: String,
  ISO_A3: String
})

const Country = mongoose.model('countries', country, 'countries');

module.exports = Country;