var redis = require('redis'),
redisClient = redis.createClient();

redisClient.flushdb(function(err, didSucceed) {
    console.log('flushed: ', didSucceed); // true
});

// redisClient.zadd('commands',Date.now(),JSON.stringify({'f': 'abba1', 'c': 'a'}));
redisClient.zadd('commands', Date.now(),'a' + Date.now());
redisClient.zadd('commands', Date.now(),'b' + Date.now());
redisClient.zadd('commands', Date.now(),'l' + Date.now());
redisClient.zadd('commands', Date.now(),'r' + Date.now());
redisClient.zadd('commands', Date.now(),'u' + Date.now());
redisClient.zadd('commands', Date.now(),'d' + Date.now());
redisClient.zadd('politics', Date.now(),'a' + 'abba3');
redisClient.zadd('politics', Date.now(),'b' + 'abba3');
redisClient.zadd('politics', Date.now(),'a' + 'abba4');
redisClient.zadd('politics', Date.now(),'b' + 'abba5');

redisClient.zrevrange(['commands',-100,-1], function(err, response) {
        if (err) throw err;
        console.log('res: ', response);
});

// var multi = redisClient.multi();
// multi.zrevrange('commands',-1*6,-1);
// multi.zrevrange('politics',-1*1,-1);
// // drains multi queue and runs atomically
// multi.exec(function (err, replies) {
//     console.log('res2: ', replies);
// });

//redis-timeseries
// ts.getHits(key, '1minute', 20, function(err, data) {
//     // data.length == count
//     // data = [ [ts1, count1], [ts2, count2]... ]
//     if (err) {
//         console.log('Error: ', err);
//     } else {
//         console.log('Data: ', data);
//     }
// });



redisClient.quit();

//by index low to high
//zrange name n m
//high to low
//zrevrange name n m

//by score
//can use -inf/inf
//zrangebyscore name n m

//remove range
//zremrangebyscore name n m
