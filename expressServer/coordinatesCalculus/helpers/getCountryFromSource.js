const fs = require('fs');

const getCountry = (country) => {

    return new Promise(resolve => {

        fs.promises.readFile('./data/countries.geojson')
            .then(result => {
                const data = JSON.parse(result);
            
                const countryData = data.features.find(el => {
                    return el.properties.ADMIN === country;
                }).geometry.coordinates; 

                resolve(countryData);

            });

    });

};

module.exports = getCountry;

