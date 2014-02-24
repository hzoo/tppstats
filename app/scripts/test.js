if (location.host.split(':')[0] === 'localhost') {
    var socket = io.connect('http://localhost:8080');
} else {
    var socket = io.connect(location.host);
}
var realTimeData = {'a':[],'b':[],'u':[],'l':[],'r':[],'d':[],'s':[],'e':[],'n':[],'m':[]},
queueLength = 6;

function resetCounts() {
    return {'a':0,'b':0,'u':0,'l':0,'r':0,'d':0,'s':0,'e':0,'n':0,'m':0};
}

function addToCommands(key,numCommands) {
    if (realTimeData[key].length >= queueLength) {
        realTimeData[key].shift();
    }
    realTimeData[key].push(numCommands);
}

socket.on('lastCmds', function(data) {
    var temp = resetCounts(), key;
    for (var i = 0; i < data.length; i++) {
        key = data[i].slice(0,1);
        temp[key]++;
    }
    for (var cmd in temp) {
        addToCommands(cmd,temp[cmd]);
    }
});

var keymap = {
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

//create metric
function command(name) {
    var firstTime = true,
    values = [],
    last;
    return context.metric(function(start, stop, step, callback) {
        if (firstTime) {
            firstTime = false;
            start = +start;
            stop = +stop;
            if (isNaN(last)) { last = start; }
            while (last < stop) {
                last += step;
                values.push(0);
            }
            callback(null, values = values.slice((start - stop) / step));
        } else {
            // console.log(realTimeData[keymap[name]]);
            callback(null, realTimeData[keymap[name]]);
        }
    }, name);
}

// 1e4 or 10 seconds, 6e4 or 1 minute, 3e5 or 5 minutes, 36e5 or 1 hour
var commandList = ['start','up', 'down', 'left', 'right','a', 'b', 'select'],
step = 1e4;
var context = cubism.context()
    .serverDelay(500)
    .clientDelay(0)
    .step(step)
    .size(720);

var demo = command("democracy"),
anar = command("anarchy");

d3.select('#demo1').call(function (div) {
    //axis
    div.append('div').attr('class', 'axis').call(context.axis().orient('top'));

    //horizon chart
    div.selectAll('.horizon')
            .data([demo.subtract(anar)])
        .enter().append('div')
            .attr('class', 'horizon')
            .call(context.horizon()
                .height(60)
                .extent([-20,20])
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
                .extent([0, 30])
                .colors(['#6baed6','#bdd7e7','#bae4b3','#74c476'])
            );
});

context.on('focus', function(i) {
    d3.selectAll('.value').style('right',                  // Make the rule coincide
        i === null ? null : context.size() - i + 'px'); // with the mouse
});
