//send historical/realtime data to client
ts = require('./redisServer.js').ts;
var commands = ['a','b','u','l','r','d','s','e','n','m'];

function createHandler(command, count, granularityLabel) {
    return function(callback) {
        ts.getHits(command, granularityLabel, count, function(err, data) { //count*stepMultiplier
            if (err) {
                console.log('err: ' + err);
            } else {
                var temp;
                // if (stepMultiplier !== 1) {
                //     temp = data.reduce(function(currentArrays, nextItem, index) {
                //         if (index % stepMultiplier === 0) { currentArrays.push(0); }
                //         currentArrays[currentArrays.length - 1] += nextItem[1];
                //         return currentArrays;
                //     }, []);
                // } else {
                    temp = data.map(function(data) {
                        //only return # of hits, not the unix time
                        return data[1];
                    });
                // }
                callback(null, temp);
            }
        });
    };
}

module.exports = {
    commands: commands,
    createHandler: createHandler
};
