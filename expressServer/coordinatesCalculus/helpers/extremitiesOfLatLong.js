/**
 * 
 * @param {*} chunck 
 * @param {*} memory 
 * @returns {lat:{from: Number, to: Number},long: {from: Number, to: Number}}
 */

const flatten = (chunck, memory = {lat:{from: null, to: null},long: {from: null, to: null}}) => {

    return chunck.reduce((prev, cur) => {
        if (typeof cur[0][0] === 'number') {

            const localExtremes = cur.reduce((prevInner, curInner) => {

                const long = curInner[0],
                    lat = curInner[1];

                if (lat < prevInner.lat.from || prevInner.lat.from  === null) {
                    prevInner.lat.from = lat;
                } else if (lat > prevInner.lat.to || prevInner.lat.to  === null) {
                    prevInner.lat.to = lat;
                } 

                if (long < prevInner.long.from || prevInner.long.from  === null) {
                    prevInner.long.from = long;
                } else if (long > prevInner.long.to || prevInner.long.to  === null) {
                    prevInner.long.to = long;
                }

                return prevInner;

            }, memory);

            if (localExtremes.lat.from < prev.lat.from ||prev.lat.from === null) prev.lat.from = localExtremes.lat.from;
            if (localExtremes.lat.to > prev.lat.to) prev.lat.to = localExtremes.lat.to;
            if (localExtremes.long.from < prev.long.from || prev.long.from === null) prev.long.from = localExtremes.long.from;
            if (localExtremes.long.to > prev.long.to) prev.long.to = localExtremes.long.to;

            return prev;
        } else {
            return flatten(cur, prev);
        }
    }, {long:{from: null, to: null},lat: {from: null, to: null}});

};

module.exports = flatten;






