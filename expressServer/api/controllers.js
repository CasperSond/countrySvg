const express = require('express')
const country = require('../model/countryCoordinate')
const allcountries = require('../model/country')
const router = express.Router()
const svgify = require('../CalcHelpers/svgify')
const extremes = require('../CalcHelpers/extremitiesOfLatLong')

router.get('/getcoordinates/:id', async (req, res) => {
  const countryId = req.params.id
  const coordinates = await country.findOne({ name: countryId }).exec()

  res.send(coordinates)
})

router.get('/allcountries', async (req, res) => {
  const all = await allcountries.find({}).exec()
  res.send(all)
})

router.get('/svg/:id', async (req, res) => {
  const countryId = req.params.id
  const { coordinates } = await country.findOne({ name: countryId }).exec()
  const extremities = extremes(coordinates)
  const translate = svgify(coordinates, extremities)

  res.send({ d: translate, extremes: extremities, id: countryId })
})

module.exports = router
