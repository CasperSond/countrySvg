const asyncCountryFn = require('./helpers/getCountryFromSource'); 
const extremitiesFn = require('./helpers/extremitiesOfLatLong');
const svgify = require('./helpers/svgify');
const mapLatLong = require('./helpers/shortenLatLongArray');
const fs = require('fs');

const country = 'Philippines';

asyncCountryFn(country).then(result => {
    const extremities = extremitiesFn(result);
    const svgReady = svgify(result, extremities);
    const shorten = mapLatLong(result, 2);

    const test = {some: shorten}

    const shortenString = JSON.stringify(test, null, '\t');
    const svg = JSON.stringify(svgReady);

    fs.promises.writeFile('./dist/test.txt', svg).then(() => {
        console.log('written');
    });

    fs.promises.writeFile('./dist/short.json', shortenString);
    console.log('written 2');

});