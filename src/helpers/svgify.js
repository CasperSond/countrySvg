
const svgTransform = (chunk, extremes, fixed = 2) => {

    const toFixed = (number) => {
        const proxy = Math.pow(10, fixed); 
        return Math.round(number * proxy) / proxy;
    };

    const bottomYAxis  = toFixed(extremes.lat.from),
        leftXAxis = toFixed(extremes.long.from);

    const totalDistance = extremes.lat.to - extremes.lat.from;

    const inner = (chunk) => {
        return chunk.reduce((prev, cur) => {

            /** [[x,y],[x,y]] */
            const isContainerOfCoordinatesArrays = typeof cur[0][0] === 'number';

            if (isContainerOfCoordinatesArrays) {

                const mod = cur.map(el => {
                    const xlong = toFixed(toFixed(el[0]) - leftXAxis),
                        ylat =  toFixed(totalDistance - (el[1] - bottomYAxis));  
                    // these change position to work, but why   
                    return `${xlong} ${ylat}`;
                }).join(' L ');

                return `M ${mod}`;


            } else {
                return prev + inner(cur);
            }

        }, '');
    };
        

    return inner(chunk);

};

module.exports = svgTransform;
 



