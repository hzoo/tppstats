if (process.env.REDISTOGO_URL) {
    console.log('url: ' + process.env.REDISTOGO_URL);
    var rtg  = require('url').parse(process.env.REDISTOGO_URL),
    redis = require('redis').createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(':')[1]);
} else {
    var redis = require('redis').createClient();
}

var TimeSeries = require('redis-timeseries'),
ts = new TimeSeries(redis, 'stats');
ts.granularities = {
    '1second'  : { ttl: ts.minutes(12), duration: 1 },
    // '5seconds'  : { ttl: ts.hours(1)  , duration: 5 ) },
    '10seconds'  : { ttl: ts.hours(2)  , duration: 10 },
    '30seconds'  : { ttl: ts.hours(6)  , duration: 30 },
    '1minute'  : { ttl: ts.hours(42)  , duration: ts.minutes(1) },
    // '5minutes' : { ttl: ts.days(2.5) , duration: ts.minutes(5) },
    '10minutes': { ttl: ts.days(5)   , duration: ts.minutes(10) },
    '30minutes': { ttl: ts.days(15)   , duration: ts.minutes(30) },
    '1hour'    : { ttl: ts.days(30)   , duration: ts.hours(1) }
    // '1day'     : { ttl: ts.weeks(52) , duration: ts.days(1) }
};

redis.on('error', function(err) { console.log('Error REDIS_URL_HERE';

module.exports = {
    ts: ts,
    client: redis
};
