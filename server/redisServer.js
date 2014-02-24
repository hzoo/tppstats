var redis = require('redis').createClient(),
TimeSeries = require('redis-timeseries'),
ts = new TimeSeries(redis, 'stats');

redis.on('error', function(err) { console.log('Error REDIS_URL_HERE';

module.exports = {
    ts: ts,
    client: redis
};
