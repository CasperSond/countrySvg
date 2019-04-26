const shorten = (chunk, fixed = 2) => {

    const inner = (chunk) => {

        return chunk.map((el) => {
            if (typeof el[0] === 'number') {

                let xlong = Number(el[0].toFixed(fixed)),
                    ylat = Number(el[1].toFixed(fixed));
    
                return [xlong, ylat];
            } else {
                return inner(el);
            }
        });
    };

    return inner(chunk);
};

module.exports = shorten;



