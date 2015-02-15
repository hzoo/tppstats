/* exported changeScale */
/* global io, d3, colorbrewer, cubism */

if (location.host.split(':')[0] === 'localhost') {
    var socket = io.connect('http://localhost:8080');
} else {
    var socket = io.connect(location.host);
}

var realTimeData = {'a':[],'b':[],'u':[],'l':[],'r':[],'d':[],'s':[],'e':[],'n':[],'m':[]},
commands = ['a','b','u','l','r','d','s','e','n','m'],
graphSize = 720,
queueLength = graphSize,
keymap = {
    'up':'u',
    'left':'l',
    'down':'d',
    'right':'r',
    'a':'a',
    'b':'b',
    'democracy':'m',
    'anarchy':'n',
    'start':'s',
    'select':'e'
};


function makeWithConcat(len) {
    var a, rem, currlen;
    if (len === 0) {
        return [];
    }
    a = [0];
    currlen = 1;
    while (currlen < len) {
        rem = len - currlen;
        if (rem < currlen) {
            a = a.concat(a.slice(0, rem));
        }
        else {
            a = a.concat(a);
        }
        currlen = a.length;
    }
    return a;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 1e4 or 10 seconds, 6e4 or 1 minute, 3e5 or 5 minutes, 36e5 or 1 hour
var commandList = ['up', 'down', 'left', 'right', 'a', 'b', 'start'],//, 'select','start'],
step = Number(getParameterByName('step')) || 1e4,
context = cubism.context()
    .serverDelay(100)
    .clientDelay(0)
    .step(step)
    .size(graphSize);

//create metric
function command(name) {
    var firstTime = true,
    values = [];
    // last;
    return context.metric(function(start, stop, step, callback) {
        if (firstTime) {
            var data = realTimeData[keymap[name]];
            firstTime = false;
            // start = +start;
            // stop = +stop;
            // if (isNaN(last)) { last = start; }
            // while (last < stop) {
            //     last += step;
            //     values.push(1);
            // }
            values = makeWithConcat(graphSize - data.length);
            values = values.concat(data);
            callback(null, values = values.slice((start - stop) / step));
        } else {
            // console.log(realTimeData[keymap[name]]);
            values = realTimeData[keymap[name]];
            callback(null, values = values.slice((start - stop) / step));
        }
    }, name);
}

var granularities = {
    1e3:'1second',
    5e3:'5seconds',
    1e4:'10seconds',
    3e4:'30seconds',
    6e4:'1minute',
    3e5:'5minutes'
    // 6e5:'10minutes',
    // 18e5:'30minutes',
    // 36e5:'1hour'
};

var sel = document.getElementById('timeIntervalSelect');
for (var j = 0; j < sel.options.length; j++) {
    var i = sel.options[j];
    if (Number(i.value) === Number(getParameterByName('step'))) {
        sel.selectedIndex = j;
        break;
    }
}

context.on('focus', function(i) {
    d3.selectAll('.value').style('right', // Make the rule coincide
        i === null ? null : context.size() - i + 'px'); // with the mouse
});

socket.emit('graphInfo', {'step': granularities[step.toString()] });

function changeScale(sel) {
    window.location.search = 'step=' + sel.value;
}

function startGraph() {
    var up = command('up'),
    down = command('down'),
    left = command('left'),
    right = command('right'),
    start = command('start'),
    dpad = up.add(down).add(left).add(right),
    // mag = up.subtract(down).add(right).subtract(left),
    a = command('a'),
    b = command('b'),
    ab = a.add(b);
    // vertical = up.subtract(down),
    // horizontal = right.subtract(left);
    // var demo = command('democracy'),
    // anar = command('anarchy');

    d3.select('#demo1').call(function(div) {
        //axis
        div.append('div').attr('class', 'axis').call(context.axis().orient('top'));

        // horizon chart
        div.selectAll('.horizon')
                .data([dpad.add(ab).add(start)])
            .enter().append('div')
                .attr('class', 'horizon')
                .call(context.horizon()
                    .height(30)
                    // .extent([-15,15].map(function(d) {return d*step/1000/4;}))
                    // .colors([0].concat(colorbrewer.Greys[3]))
                    .colors([0].concat(colorbrewer.Purples[3]))
                    .title(function(d, i) {
                        if (i === 0) { return 'all keys'; }
                        else { return 'mag'; }
                    })
                );

        //line
        div.append('div')
             .attr('class', 'rule')
             .call(context.rule());
    });

    // d3.select('#demo2').call(function(div) {
    //     // horizon chart
    //     div.selectAll('.horizon')
    //             .data([mag])
    //         .enter().append('div')
    //             .attr('class', 'horizon')
    //             .call(context.horizon()
    //                 .height(30)
    //                 // .extent([-15,15].map(function(d) {return d*step/1000/4;}))
    //                 // .colors([0].concat(colorbrewer.Greys[3]))
    //                 .colors([0].concat(colorbrewer.PuOr[5]))
    //                 .title('mag')
    //             );
    // });

    d3.select('#demo2').call(function(div) {
        //horizon chart
        div.selectAll('.horizon')
                .data(commandList.map(command))
            .enter().append('div')
                .attr('class', 'horizon')
                .call(context.horizon()
                    .height(60)
                    // .extent([0,60].map(function(d) {return d*step/1000/8;}))
                    // .extent([0,120])
                    .colors(function() {
                    // .colors(function(d,i) {
                        // if (i === 0) { return [0].concat(colorbrewer.BuGn[3]);
                        // } else if (i === 1) { return [0].concat(colorbrewer.Greens[3]);
                        // } else if (i === 2) { return [0].concat(colorbrewer.Blues[3]);
                        // } else if (i === 3) { return [0].concat(colorbrewer.PuRd[3]);
                        // } else if (i === 4) { return [0].concat(colorbrewer.RdPu[3]);
                        // } else if (i === 5) { return [0].concat(colorbrewer.Oranges[3]);
                        // } else if (i === 6) { return [0].concat(colorbrewer.YlOrBr[3]);
                        // }
                        return [0].concat(colorbrewer.Purples[3]);
                    })
                );
    });

}

socket.on('realtime', function(data) {
    // console.log('realtime: ', data);
    for (var i = 0; i < data.length; i++) {
        if (realTimeData[commands[i]] && realTimeData[commands[i]].length >= queueLength) {
            realTimeData[commands[i]].shift();
        }
        realTimeData[commands[i]].push(data[i][0]);
    }
});

socket.on('history', function(data) {
    // console.log('HISTORY!', data);
    for (var i = 0; i < data.length; i++) {
        realTimeData[commands[i]] = data[i];
    }
    startGraph();
});
