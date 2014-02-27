function makeWithConcat(a){var b,c,d;if(0===a)return[];for(b=[0],d=1;a>d;)c=a-d,b=b.concat(d>c?b.slice(0,c):b),d=b.length;return b}function getParameterByName(a){a=a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var b=new RegExp("[\\?&]"+a+"=([^&#]*)"),c=b.exec(location.search);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))}function command(a){var b=!0,c=[];return context.metric(function(d,e,f,g){if(b){var h=realTimeData[keymap[a]];b=!1,c=makeWithConcat(graphSize-h.length),c=c.concat(h),g(null,c=c.slice((d-e)/f))}else c=realTimeData[keymap[a]],g(null,c=c.slice((d-e)/f))},a)}function changeScale(a){window.location.search="step="+a.value}function startGraph(){d3.select("#demo1").call(function(a){a.append("div").attr("class","axis").call(context.axis().orient("top")),a.selectAll(".horizon").data([demo.subtract(anar)]).enter().append("div").attr("class","horizon").call(context.horizon().height(60).colors(["#6baed6","#bdd7e7","#bae4b3","#74c476"])),a.append("div").attr("class","rule").call(context.rule())}),d3.select("#demo2").call(function(a){a.selectAll(".horizon").data(commandList.map(command)).enter().append("div").attr("class","horizon").call(context.horizon().height(60).colors(["#6baed6","#bdd7e7","#bae4b3","#74c476"]))});var a=command("up"),b=command("down"),c=command("left"),d=command("right"),e=a.add(b).add(c).add(d),f=a.subtract(b),g=d.subtract(c);d3.select("#demo3").call(function(a){a.selectAll(".horizon").data([e]).enter().append("div").attr("class","horizon").call(context.horizon().height(60).colors(["#6baed6","#bdd7e7","#bae4b3","#74c476"]).title("dpad"))}),d3.select("#demo4").call(function(a){a.selectAll(".horizon").data([f,g]).enter().append("div").attr("class","horizon").call(context.horizon().height(60).colors(["#6baed6","#bdd7e7","#bae4b3","#74c476"]).title(function(a,b){return 0===b?"vertical":1===b?"horizontal":void 0}))})}if("localhost"===location.host.split(":")[0])var socket=io.connect("http://localhost:8080");else var socket=io.connect(location.host);for(var realTimeData={a:[],b:[],u:[],l:[],r:[],d:[],s:[],e:[],n:[],m:[]},commands=["a","b","u","l","r","d","s","e","n","m"],graphSize=720,queueLength=graphSize,keymap={up:"u",left:"l",down:"d",right:"r",a:"a",b:"b",democracy:"m",anarchy:"n",start:"s",select:"e"},commandList=["start","a","b","up","down","left","right"],step=Number(getParameterByName("step"))||1e4,context=cubism.context().serverDelay(100).clientDelay(0).step(step).size(graphSize),demo=command("democracy"),anar=command("anarchy"),granularities={1e4:"10seconds",3e4:"30seconds",6e4:"1minute",6e5:"10minutes",18e5:"30minutes",36e5:"1hour"},sel=document.querySelector("select"),j=0;j<sel.options.length;j++){var i=sel.options[j];if(Number(i.value)===Number(getParameterByName("step"))){sel.selectedIndex=j;break}}context.on("focus",function(a){d3.selectAll(".value").style("right",null===a?null:context.size()-a+"px")}),socket.emit("graphInfo",{step:granularities[step.toString()]}),socket.on("realtime",function(a){for(var b=0;b<a.length;b++)realTimeData[commands[b]].length>=queueLength&&realTimeData[commands[b]].shift(),realTimeData[commands[b]].push(a[b][0])}),socket.on("history",function(a){for(var b=0;b<a.length;b++)realTimeData[commands[b]]=a[b];startGraph()});