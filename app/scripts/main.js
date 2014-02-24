//connect

if (location.host.split(':')[0] === 'localhost') {
    var socket = io.connect('http://localhost:8080');
} else {
    var socket = io.connect(location.host);
}

//use instead of setInterval/setTimeout
//http://creativejs.com/resources/requestanimationframe/
(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
    window.requestAnimationFrame = requestAnimationFrame;
})();

//initial state of commands
function resetCounts() {
    //e = select, n = anarchy, d = democracy
    return {'a':0,'b':0,'u':0,'l':0,'r':0,'d':0,'s':0,'e':0,'n':0,'m':0};
}
var counts = resetCounts();
// var perSecondCounts = resetCounts();
var politicsCounts = {'n':0,'m':0};

//get canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

//queue to keep count of the last queueLength commands
var queue = [];
var politicsQueue = [];
// var perSecondQueue = [];
var queueLength = 100;
var politicsQueueLength = 1000;

function addToCommands(command) {
    //add to array
    counts[command]++;
    // perSecondCounts[command]++;
    if (queue.length >= queueLength) {
        counts[queue.shift()]--;
    }
    queue.push(command);
}

function addToPolitics(command) {
    if (command === 'm' || command === 'n') {
        politicsCounts[command]++;
        if (politicsQueue.length >= politicsQueueLength) {
            politicsCounts[politicsQueue.shift()]--;
        }
        politicsQueue.push(command);
    }
}

function processLastData(command) {
    addToCommands(command);
    addToPolitics(command);
    // perSecondQueue.push(command);
}

//when data is sent
socket.on('cmd', function(data) {
    // console.log('cmd: ', data);
    processLastData(data);
});

socket.on('cb', function(data) {
    // console.log('cb: ',data);
    for (var i = 0; i < Math.min(data.length,queueLength); i++) {
        addToCommands(data[i].slice(0,1));
    }
});
socket.on('pb', function(data) {
    // console.log('pb: ',data);
    for (var j = 0; j < Math.min(data.length,politicsQueueLength); j++) {
        addToPolitics(data[j].slice(0,1));
    }
});

// var commandsPerSecond = 0;
//check commands/second
// setInterval(function() {
//     commandsPerSecond = perSecondQueue.length;
//     perSecondQueue = [];
//     perSecondCounts = resetCounts();
// }, 1000);

function pad(number, size) {
    number = number.toString();
    while (number.length < size) { number = ' ' + number; }
    return number;
}

function animate() {
    //clear canvas state
    //canvas.width hack is slow
    //ctx.clearRect itself does not clear properly with modified transform matrix
    //http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing

    // Store the current transformation matrix
    ctx.save();

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Restore the transform
    ctx.restore();

    var a = counts.a,
    b = counts.b,
    up = counts.u,
    down = counts.d,
    left = counts.l,
    right = counts.r,
    start = counts.s,
    select = counts.e,
    democracy = counts.m,
    anarchy = counts.n,
    //normalize to 100
    politicsSum = politicsCounts.m + politicsCounts.n,
    demVote = politicsCounts.m,
    dpad = up+down+left+right;

    //settings
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = '#AAA';

    //axes
    var num1 = 100.5;
    ctx.moveTo(num1,0.5);
    ctx.lineTo(num1,200.5);
    ctx.moveTo(0.5,num1);
    ctx.lineTo(200.5,num1);
    ctx.stroke();

    //up,down,left,right
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#EEE';

    //make these larger
    var multipler = 3;
    ctx.moveTo(num1, num1-up*multipler);
    ctx.lineTo(num1+right*multipler, num1);
    ctx.lineTo(num1,num1+down*multipler);
    ctx.lineTo(num1-left*multipler,num1);
    ctx.lineTo(num1,num1-up*multipler);
    ctx.stroke();
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle='#000';

    //bold axes
    // ctx.fillRect(num1,num1,1,-up);
    // ctx.fillRect(num1,num1,1,down);
    // ctx.fillRect(num1,num1,-left,1);
    // ctx.fillRect(num1,num1,right,1);

    //other buttons
    ctx.beginPath();
    var rectX = 250.5;
    var rectY = 60.5;
    ctx.fillRect(rectX,rectY,a,5);
    ctx.fillRect(rectX,rectY+15*1,b,5);
    ctx.fillRect(rectX,rectY+15*2,start,5);
    ctx.fillRect(rectX,rectY+15*3,select,5);
    ctx.fillRect(rectX,rectY+15*4,democracy,5);
    ctx.fillRect(rectX,rectY+15*5,anarchy,5);
    ctx.fillRect(rectX,rectY+15*6,dpad,5);
    ctx.font = '10px Arial';
    ctx.fillText('A',rectX-35,rectY+5);
    ctx.fillText('B',rectX-35,rectY+5+15*1);
    ctx.fillText('STAR',rectX-35,rectY+5+15*2);
    ctx.fillText('SELE',rectX-35,rectY+5+15*3);
    ctx.fillText('DEMO',rectX-35,rectY+5+15*4);
    ctx.fillText('ANAR',rectX-35,rectY+5+15*5);
    ctx.fillText('DPAD',rectX-35,rectY+5+15*6);
    //%s
    ctx.fillText(pad(a        ,2),rectX+117,rectY+5);
    ctx.fillText(pad(b        ,2),rectX+117,rectY+5+15*1);
    ctx.fillText(pad(start    ,2),rectX+117,rectY+5+15*2);
    ctx.fillText(pad(select   ,2),rectX+117,rectY+5+15*3);
    ctx.fillText(pad(democracy,2),rectX+117,rectY+5+15*4);
    ctx.fillText(pad(anarchy  ,2),rectX+117,rectY+5+15*5);
    ctx.fillText(pad(dpad     ,2),rectX+117,rectY+5+15*6);
    //edge
    ctx.fill();

    //demo/anarchy bar
    var politicsBarX = canvas.width/2;
    var politicsBarY = 238.5;
    ctx.beginPath();
    ctx.fillStyle= '#E82C0C';
    //minus 50 since that's the middle point
    if (politicsSum > 500) {
        ctx.fillRect(politicsBarX,politicsBarY-15*2,demVote*100/(politicsSum)-50,5);
    }
    ctx.fillStyle='#000';
    //80% line
    ctx.fillRect(politicsBarX+30,politicsBarY-15*2-2,1,8);
    //50% line
    ctx.fillRect(politicsBarX,politicsBarY-15*2-2,1,8);
    //edges
    ctx.fillStyle='#aaaaaa';
    ctx.fillRect(politicsBarX+50,politicsBarY-15*2-2,1,8);
    ctx.fillRect(politicsBarX-50,politicsBarY-15*2-2,1,8);

    ctx.fillStyle='#000';
    ctx.font = '10px Arial';
    ctx.fillText('DEMOCRACY',politicsBarX+54,politicsBarY+5-15*2);
    ctx.fillText('ANARCHY',politicsBarX-104,politicsBarY+5-15*2);
    ctx.fill();

    //calculate magnitude/direction
    var direction = Math.atan2((right-left)/2,(down-up)/2);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.fillStyle= '#b2b2b2';
    ctx.fillText('AVG direction of RED',50.5,140.5);
    ctx.fill();
    ctx.fillStyle= '#000';

    ctx.beginPath();
    ctx.fillStyle= '#555';
    //' + queue.length + '
    ctx.fillText('last 100 keys',rectX+25,rectY-15);
    ctx.fill();

    // mag = sqrt(a^2+b^2), a = right-left, b = up - down
    var mag = Math.sqrt((right-left)*(right-left) + (up-down)*(up-down));
    if (mag < 4) { mag = 4; }

    //arrow line/mag
    var originX = 100.5;
    var originY = 100.5;
    ctx.strokeStyle = '#E82C0C';
    ctx.moveTo(originX,originY);
    ctx.lineTo(originX+Math.sin(direction)*mag,originY+Math.cos(direction)*mag);
    ctx.stroke();
    ctx.beginPath();
    //longer line
    ctx.strokeStyle = '#bdbdbd';
    ctx.moveTo(originX,originY);
    ctx.lineTo(originX+Math.sin(direction)*100,originY+Math.cos(direction)*100);
    ctx.stroke();
    ctx.beginPath();

    //arrow head
    //arrow offset
    var arrowAngleOffset = 0.1;
    //arrow size
    var arrowSizeDiff = 3,
    arrowHeadSize = 27;
    ctx.strokeStyle = '#000';
    ctx.lineTo(
        originX + Math.sin(direction-arrowAngleOffset) * (Math.max(mag-arrowSizeDiff,arrowHeadSize)),
        originY + Math.cos(direction-arrowAngleOffset) * (Math.max(mag-arrowSizeDiff,arrowHeadSize))
    );
    ctx.lineTo(
        originX + Math.sin(direction+arrowAngleOffset) * (Math.max(mag-arrowSizeDiff,arrowHeadSize)),
        originY + Math.cos(direction+arrowAngleOffset) * (Math.max(mag-arrowSizeDiff,arrowHeadSize))
    );
    ctx.lineTo(
        originX + Math.sin(direction) * Math.max(mag,arrowHeadSize+arrowSizeDiff),
        originY + Math.cos(direction) * Math.max(mag,arrowHeadSize+arrowSizeDiff)
    );
    ctx.fill();
    ctx.stroke();

    //commands/sec
    // ctx.fillStyle='#000';
    // ctx.font = '10px Arial';
    // ctx.fillText(commandsPerSecond+' keys/s',290,175);

    window.requestAnimationFrame(animate);
}

animate();
