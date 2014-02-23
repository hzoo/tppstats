function resetCounts(){return{a:0,b:0,u:0,l:0,r:0,d:0,s:0,e:0,n:0,m:0}}function addToCommands(a){counts[a]++,queue.length>=queueLength&&counts[queue.shift()]--,queue.push(a)}function addToPolitics(a){("m"===a||"n"===a)&&(politicsCounts[a]++,politicsQueue.length>=politicsQueueLength&&politicsCounts[politicsQueue.shift()]--,politicsQueue.push(a))}function processLastData(a){addToCommands(a),addToPolitics(a)}function pad(a,b){for(a=a.toString();a.length<b;)a=" "+a;return a}function animate(){ctx.save(),ctx.setTransform(1,0,0,1,0,0),ctx.clearRect(0,0,canvas.width,canvas.height),ctx.restore();var a=counts.a,b=counts.b,c=counts.u,d=counts.d,e=counts.l,f=counts.r,g=counts.s,h=counts.e,i=counts.m,j=counts.n,k=politicsCounts.m+politicsCounts.n,l=politicsCounts.m,m=c+d+e+f;ctx.globalAlpha=.25,ctx.lineWidth=.5,ctx.strokeStyle="#AAA";var n=100.5;ctx.moveTo(n,.5),ctx.lineTo(n,200.5),ctx.moveTo(.5,n),ctx.lineTo(200.5,n),ctx.stroke(),ctx.strokeStyle="#000",ctx.lineWidth=.5,ctx.fillStyle="#EEE";var o=3;ctx.moveTo(n,n-c*o),ctx.lineTo(n+f*o,n),ctx.lineTo(n,n+d*o),ctx.lineTo(n-e*o,n),ctx.lineTo(n,n-c*o),ctx.stroke(),ctx.fill(),ctx.globalAlpha=1,ctx.fillStyle="#000",ctx.beginPath();var p=250.5,q=60.5;ctx.fillRect(p,q,a,5),ctx.fillRect(p,q+15,b,5),ctx.fillRect(p,q+30,g,5),ctx.fillRect(p,q+45,h,5),ctx.fillRect(p,q+60,i,5),ctx.fillRect(p,q+75,j,5),ctx.fillRect(p,q+90,m,5),ctx.font="10px Arial",ctx.fillText("A",p-35,q+5),ctx.fillText("B",p-35,q+5+15),ctx.fillText("STAR",p-35,q+5+30),ctx.fillText("SELE",p-35,q+5+45),ctx.fillText("DEMO",p-35,q+5+60),ctx.fillText("ANAR",p-35,q+5+75),ctx.fillText("DPAD",p-35,q+5+90),ctx.fillText(pad(a,2),p+117,q+5),ctx.fillText(pad(b,2),p+117,q+5+15),ctx.fillText(pad(g,2),p+117,q+5+30),ctx.fillText(pad(h,2),p+117,q+5+45),ctx.fillText(pad(i,2),p+117,q+5+60),ctx.fillText(pad(j,2),p+117,q+5+75),ctx.fillText(pad(m,2),p+117,q+5+90),ctx.fill();var r=canvas.width/2,s=238.5;ctx.beginPath(),ctx.fillStyle="#E82C0C",k>0&&ctx.fillRect(r,s-30,100*l/k-50,5),ctx.fillStyle="#000",ctx.fillRect(r+30,s-30-2,1,8),ctx.fillRect(r,s-30-2,1,8),ctx.fillStyle="#aaaaaa",ctx.fillRect(r+50,s-30-2,1,8),ctx.fillRect(r-50,s-30-2,1,8),ctx.fillStyle="#000",ctx.font="10px Arial",ctx.fillText("DEMOCRACY",r+54,s+5-30),ctx.fillText("ANARCHY",r-104,s+5-30),ctx.fill();var t=Math.atan2((f-e)/2,(d-c)/2);ctx.strokeStyle="#000",ctx.lineWidth=1,ctx.beginPath(),ctx.fillStyle="#b2b2b2",ctx.fillText("AVG direction of RED",50.5,140.5),ctx.fill(),ctx.fillStyle="#000",ctx.beginPath(),ctx.fillStyle="#555",ctx.fillText("last 100 keys",p+25,q-15),ctx.fill();var u=Math.sqrt((f-e)*(f-e)+(c-d)*(c-d));4>u&&(u=4);var v=100.5,w=100.5;ctx.strokeStyle="#E82C0C",ctx.moveTo(v,w),ctx.lineTo(v+Math.sin(t)*u,w+Math.cos(t)*u),ctx.stroke(),ctx.beginPath(),ctx.strokeStyle="#bdbdbd",ctx.moveTo(v,w),ctx.lineTo(v+100*Math.sin(t),w+100*Math.cos(t)),ctx.stroke(),ctx.beginPath();var x=.1,y=3,z=27;ctx.strokeStyle="#000",ctx.lineTo(v+Math.sin(t-x)*Math.max(u-y,z),w+Math.cos(t-x)*Math.max(u-y,z)),ctx.lineTo(v+Math.sin(t+x)*Math.max(u-y,z),w+Math.cos(t+x)*Math.max(u-y,z)),ctx.lineTo(v+Math.sin(t)*Math.max(u,z+y),w+Math.cos(t)*Math.max(u,z+y)),ctx.fill(),ctx.stroke(),window.requestAnimationFrame(animate)}if("localhost"===location.host.split(":")[0])var socket=io.connect("http://localhost:8080");else var socket=io.connect(location.host);!function(){var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)};window.requestAnimationFrame=a}();var counts=resetCounts(),politicsCounts={n:0,m:0},canvas=document.querySelector("canvas"),ctx=canvas.getContext("2d"),queue=[],politicsQueue=[],queueLength=100,politicsQueueLength=1e3;socket.on("k",function(a){var b=a.k;processLastData(b)}),socket.on("i",function(a){console.log(a.cb.length,a.pb.length);for(var b=a.cb,c=a.pb,d=0;d<Math.min(b.length,queueLength);d++)addToCommands(counts[d]);for(var e=0;e<Math.min(c.length,politicsQueueLength);e++)addToPolitics(politicsCounts[e])}),animate();