const fs = require('fs');
const recursiveShortnerFn = require('./src/helpers/shortenLatLongArray')



fs.readFile('./src/data/countries.geojson', (error, response) => {
  const parsed = JSON.parse(response);
  
  const transform = parsed.features.map(el => {

    const o = {
      name: el.properties.ISO_A3,
      countryId: el.properties,
      coordinates: recursiveShortnerFn(el.geometry.coordinates)
    }
    return o
  })

  const andStringified = JSON.stringify(transform)


  fs.promises.writeFile('./src/data/short.json', andStringified).then((err) => {
    console.log(err);
    
  })
  
});



 

