const fs = require('fs');

const getCountry = async () => {


  const all = await fs.promises.readFile('./data/countries.geojson')
  const data = JSON.parse(all);
  
  const formatted = data.features.map(el => {
    return el.properties
  })


  const a = await fs.promises.writeFile('./dist/countries.json', JSON.stringify(formatted));
  console.log('formatted');
  
    
};

getCountry();


