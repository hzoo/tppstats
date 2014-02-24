var ts = require('./redisServer.js').ts,
stepInterval = 5000;
count = 3;

setInterval(function() {
    // Give me the hits/second for the last 3 minutes
     // ts.getHits('your_stats_key', '1second', ts.minutes(3), callback);
     // Give me the number of hits per day for the last 2 weeks
     // ts.getHits('your_stats_key', '1day', 14, callback);

     ts.getHits('a', '1minute', count, function(err, data) {
         // data.length == count
         // data = [ [ts1, count1], [ts2, count2]... ]
         if (err) {
             console.log('Error getHits: ', err);
         } else {
             console.log('Data: ', data);
            // data.forEach(function(d) {
            //     console.log(d[0],d[1]);
            // });
         }
     });

}, stepInterval);