exports.sendKey = sendKey;

var timeToWait = 10000,
keymap = {
    'up':'Up','left':'Left','down':'Down','right':'Right',
    'a':'a','b':'b',
    'x':'x','y':'y',
    'start':'s','select':'e'
},
lastTime = new Date().getTime();

function sendKey(command,programName) {
    //TODO: remove digits or process them
    key = keymap[command];
    var allowKey = true;
    //start delay
    if (key === 's') {
        var newTime = new Date().getTime();
        if (newTime - lastTime < timeToWait) {
            allowKey = false;
        } else {
            lastTime = newTime;
        }
    // filter commands
    } else if (key === 'democracy' || key === 'anarchy') { allowKey = false; }
    if (allowKey) {
        //send to correct window
        var xdo = exec("xdotool search --onlyvisible --name " + programName, function (error, stdout, stderr) {
            var windowID = stdout.trim();
            console.log(key, windowID);
            exec("xdotool key --window " + windowID + " --delay 100 " + key);
        });
    }
};
