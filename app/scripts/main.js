/* exported changeScale */

if (location.host.split(':')[0] === 'localhost') {
    var socket = io.connect('http://localhost:8080');
} else {
    var socket = io.connect(location.host);
}

var realTimeData = {'a':[],'b':[],'u':[],'l':[],'r':[],'d':[],'s':[],'e':[],'n':[],'m':[],'w':[]},
commands = ['a','b','u','l','r','d','s','e','n','m','w'],
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
    'select':'e',
    'wait':'w'
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
var commandList = ['a', 'b', 'up', 'down', 'left', 'right'],//, 'select','start'],
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

// var demo = command('democracy');
var anar = command('anarchy');
// wait = command('wait');

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

var sel = document.querySelector('select');
for(var j = 0; j < sel.options.length; j++) {
    var i = sel.options[j];
    if(Number(i.value) === Number(getParameterByName('step'))) {
        sel.selectedIndex = j;
        break;
    }
}

context.on('focus', function(i) {
    d3.selectAll('.value').style('right',                  // Make the rule coincide
        i === null ? null : context.size() - i + 'px'); // with the mouse
});

socket.emit('graphInfo', {'step': granularities[step.toString()] });

function changeScale(sel){
    window.location.search = 'step='+sel.value;
}

function startGraph() {

    var up = command('up'),
    down = command('down'),
    left = command('left'),
    right = command('right'),
    start = command('start'),
    dpad = up.add(down).add(left).add(right),
    a = command('a'),
    b = command('b'),
    ab = a.add(b);

    d3.select('#demo1').call(function (div) {
        //axis
        div.append('div').attr('class', 'axis').call(context.axis().orient('top'));

        //horizon chart
        div.selectAll('.horizon')
                // .data([demo.subtract(anar)])
                .data([anar,dpad,ab,start])
            .enter().append('div')
                .attr('class', 'horizon')
                .call(context.horizon()
                    .height(60)
                    // .extent([-15,15].map(function(d) {return d*step/1000/4;}))
                    .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
                );

        //line
        div.append('div')
             .attr('class', 'rule')
             .call(context.rule());
    });

    d3.select('#demo2').call(function (div) {
        //horizon chart
        div.selectAll('.horizon')
                .data(commandList.map(command))
            .enter().append('div')
                .attr('class', 'horizon')
                .call(context.horizon()
                    .height(60)
                    // .extent([0,60].map(function(d) {return d*step/1000/8;}))
                    .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
                );
    });

    // vertical = up.subtract(down),
    // horizontal = right.subtract(left);

    // d3.select('#demo3').call(function (div) {
    //     //horizon chart
    //     div.selectAll('.horizon')
    //             .data([dpad])
    //         .enter().append('div')
    //             .attr('class', 'horizon')
    //             .call(context.horizon()
    //                 .height(60)
    //                 // .extent([0,100].map(function(d) {return d*step/1000/8;}))
    //                 .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
    //                 .title('dpad')
    //             );
    // });
    // d3.select('#demo3').call(function (div) {
    //     //horizon chart
    //     div.selectAll('.horizon')
    //             .data([dpad])
    //         .enter().append('div')
    //             .attr('class', 'horizon')
    //             .call(context.horizon()
    //                 .height(60)
    //                 // .extent([-30,30].map(function(d) {return d*step/1000/8;}))
    //                 .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
    //                 // .title(function(d,i) {
    //                 //     if (i === 0) { return 'vertical'; }
    //                 //     else if (i === 1) { return 'horizontal'; }
    //                 // })
    //             );
    // });
    // d3.select('#demo4').call(function (div) {
    //     //horizon chart
    //     div.selectAll('.horizon')
    //             .data([ab])
    //         .enter().append('div')
    //             .attr('class', 'horizon')
    //             .call(context.horizon()
    //                 .height(60)
    //                 // .extent([-30,30].map(function(d) {return d*step/1000/8;}))
    //                 .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
    //                 // .title(function(d,i) {
    //                 //     if (i === 0) { return 'vertical'; }
    //                 //     else if (i === 1) { return 'horizontal'; }
    //                 // })
    //             );
    // });
    // d3.select('#demo4').call(function (div) {
    //     //horizon chart
    //     div.selectAll('.comparison')
    //             .data([[up,down]])
    //         .enter().append('div')
    //             .attr('class', 'comparison')
    //             .call(context.comparison()
    //                 .height(60)
    //                 // .extent([-30,30].map(function(d) {return d*step/1000/8;}))
    //                 .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
    //                 .title('vertical | ')
    //             );
    // });
    // d3.select('#demo5').call(function (div) {
    //     //horizon chart
    //     div.selectAll('.horizon')
    //             .data([wait])
    //         .enter().append('div')
    //             .attr('class', 'horizon')
    //             .call(context.horizon()
    //                 .height(60)
    //                 // .extent([-30,30].map(function(d) {return d*step/1000/8;}))
    //                 .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
    //             );
    // });
}

socket.on('realtime', function(data) {
    // console.log('realtime: ', data);
    for (var i = 0; i < data.length; i++) {
        if (realTimeData[commands[i]].length >= queueLength) {
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
