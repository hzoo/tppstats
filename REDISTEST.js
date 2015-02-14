var redis = require('redis'),
redisClient = redis.createClient();

redisClient.flushdb(function(err, didSucceed) {
    console.log('flushed: ', didSucceed); // true
});

// redisClient.zadd('commands',Date.now(),JSON.stringify({'f': 'abba1', 'c': 'a'}));
redisClient.zadd('commands', Date.now(), 'a' + Date.now());
redisClient.zadd('commands', Date.now(), 'b' + Date.now());
redisClient.zadd('commands', Date.now(), 'l' + Date.now());
redisClient.zadd('commands', Date.now(), 'r' + Date.now());
redisClient.zadd('commands', Date.now(), 'u' + Date.now());
redisClient.zadd('commands', Date.now(), 'd' + Date.now());
redisClient.zadd('anarchy', Date.now(), 'a' + 'abba3');
redisClient.zadd('anarchy', Date.now(), 'b' + 'abba3');
redisClient.zadd('anarchy', Date.now(), 'a' + 'abba4');
redisClient.zadd('anarchy', Date.now(), 'b' + 'abba5');

redisClient.zrevrange(['commands',-100,-1], function(err, response) {
        if (err) throw err;
        console.log('res: ', response);
});

// var multi = redisClient.multi();
// multi.zrevrange('commands',-1*6,-1);
// multi.zrevrange('anarchy',-1*1,-1);
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

// other stuff

// var stepInterval = 10000;
// setInterval(function() {
//     //redis
//     var now = Date.now();
//     redisClient.zrangebyscore(['commands',now-stepInterval,now], function(err, res) {
//         if (err) {
//             console.log('Error: ', err);
//         }
//         common.io.sockets.emit('realtime',res);
//     });
// }, stepInterval);

// anarchy
// if (command === 'm' || command === 'n') {
//     if (politicsBuffer.length >= politicsBufferLength) {
//         politicsBuffer.shift();
//     }
//     politicsBuffer.push(command);
// }

//redis
// var date = Date.now();
// redisClient.zadd('commands',date,command+ '' +date);
// if (command === 'm' || command === 'n') {
//     // redisClient.zadd('politics',date,{'t': date, 'c': command});
//     redisClient.zadd('politics',date,command+ '' +date);
// }

//when a connection starts, send buffer (last x commands)
// common.io.sockets.on('connection', function(socket) {
    //redis multi
    // var multi = redisClient.multi();
    // multi.zrevrange('commands',-1*commandsBufferLength,-1);
    // multi.zrevrange('politics',-1*politicsBufferLength,-1);
    // // drains multi queue and runs atomically
    // multi.exec(function (err, replies) {
    //     socket.emit('i', { 'cb': commandsBuffer, 'pb': politicsBuffer } );
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

    //redis
    // redisClient.zrevrange(['commands',-1*commandsBufferLength,-1], function(err, res) {
    //     // socket.emit('i', { 'cb': commandsBuffer} );
    //     if (err) {
    //         console.log('Error: ', err);
    //     }
    //     socket.emit('cb', res);
    // });
    // redisClient.zrevrange(['politics',-1*politicsBufferLength,-1], function(err, res) {
    //     // socket.emit('i', { 'pb': politicsBuffer} );
    //     if (err) {
    //         console.log('Error: ', err);
    //     }
    //     socket.emit('pb', res);
    // });

    // // socket.emit('cb', commandsBuffer);
    // // socket.emit('sb', streamerBuffer);
    //socket.emit('pb', politicsBuffer);
// });
