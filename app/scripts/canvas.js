/* global socket */

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

//get canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

//queue to keep count of the last queueLength commands
var queue = [],
queueLength = 100;
// var perSecondQueue = [];

function addToCommands(command) {
    //add to array
    counts[command]++;
    // perSecondCounts[command]++;
    queue.push(command);
    if (queue.length >= queueLength) {
        counts[queue.shift()]--;
    }
}

function processLastData(command) {
    addToCommands(command);
    // perSecondQueue.push(command);
}

//when data is sent
socket.on('cmd', function(command) {
    processLastData(command);
});

socket.on('cb', function(cb) {
    for (var i = 0; i < Math.min(cb.length,queueLength); i++) {
        addToCommands(cb[i]);
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

var showGraph = true;
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
    anarchy = counts.n,
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
    ctx.fillStyle= colorbrewer.Purples[3][2];//'#000';

    //other buttons
    ctx.beginPath();
    var rectX = 250.5;
    var rectY = 60.5;
    ctx.fillRect(rectX,rectY,a,5);
    ctx.fillRect(rectX,rectY+15*1,b,5);
    ctx.fillRect(rectX,rectY+15*2,start,5);
    ctx.fillRect(rectX,rectY+15*3,anarchy,5);
    ctx.fillRect(rectX,rectY+15*4,dpad,5);
    ctx.font = '10px Arial';
    ctx.fillText('A',rectX-35,rectY+5);
    ctx.fillText('B',rectX-35,rectY+5+15*1);
    ctx.fillText('STAR',rectX-35,rectY+5+15*2);
    ctx.fillText('ANAR',rectX-35,rectY+5+15*3);
    ctx.fillText('DPAD',rectX-35,rectY+5+15*4);
    //%s
    ctx.fillText(pad(a        ,2),rectX+117,rectY+5);
    ctx.fillText(pad(b        ,2),rectX+117,rectY+5+15*1);
    ctx.fillText(pad(start    ,2),rectX+117,rectY+5+15*2);
    ctx.fillText(pad(anarchy  ,2),rectX+117,rectY+5+15*3);
    ctx.fillText(pad(dpad     ,2),rectX+117,rectY+5+15*4);
    //edge
    ctx.fill();

    //calculate magnitude/direction
    var direction = Math.atan2((right-left)/2,(down-up)/2);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.fillStyle= '#b2b2b2';
    ctx.fillText('AVG direction of AJ',50.5,140.5);
    ctx.fill();

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

    if (showGraph === true) {
        window.requestAnimationFrame(animate);
    }
}

document.getElementById('toggleButton').onclick = function() {
    showGraph = showGraph ? false : true;
    if (showGraph) {
        canvas.style.display = 'block';
        animate();
    } else {
        canvas.style.display = 'none';
    }
};

animate();
