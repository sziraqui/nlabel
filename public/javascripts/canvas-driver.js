var canvas, c;
var mCanvas, mC;
const picDir = '/data/pictures/';
var shouldDraw = false;
var currX = 0;
var currY = 0;
var currW = 0;
var currH = 0;

window.onload = function() {
    
    canvas = document.getElementById('selection-layer');
    c = canvas.getContext('2d');

    mCanvas = document.getElementById('main-layer');
    mC = mCanvas.getContext('2d');

    renderImage();

    c.strokeStyle = "blue";
    c.fillStyle = "blue";
    c.globalAlpha = 0.5;
    mC.strokeStyle = "red";
    canvas.onmousedown = mouseHold;
    canvas.onmousemove = mouseMove;
    canvas.onmouseup = mouseRelease;
}


function renderImage() {
    console.log('rendering image');
    var image = new Image();
    var name = document.getElementById('img-name').innerHTML;
    if(typeof name != 'undefined') {
        image.src = picDir + name;
        var x = 0;
        var y = 0;
        var width = mCanvas.width;
        var height = mCanvas.height;

        image.onload = function() {
            mC.drawImage(image, x, y, width, height);
            console.log('Image rendered successfully');
            document.getElementById('log-1').innerHTML = `I/canvas: Height: ${mCanvas.height} Width: ${mCanvas.width}`;
        };
    }
}


function mouseHold(event) {
    shouldDraw = true;
    var pos = getMousePos(event);
    currX = pos.x;
    currY = pos.y;
    document.getElementById('log-0').innerHTML = `currX ${currX} currY ${currY}`;

}


function mouseMove(event) {
    var prevX = 0;
    var prevY = 0;
    if(shouldDraw) {
       var pos = getMousePos(event);
       currW = (pos.x - currX);
       currH = (pos.y - currY);
       console.log(`posx ${pos.x} posy ${pos.y}`);
       drawSelection(currX, currY, currW, currH);
    }
}


function mouseRelease(event) {
    shouldDraw = false;
    var pos = getMousePos(event);
    var w = (pos.x - currX);
    var h = (pos.y - currY);
    document.getElementById('log-2').innerHTML = `posx ${pos.x} posy ${pos.y}`;
    drawBB(currX, currY, w, h);
}

function drawSelection(x, y, w, h) {
    clearCanvas();
    c.fillRect(x, y, w, h);
}


function drawBB(x, y, w, h) {
    clearCanvas();
    mC.rect(x, y, w, h);
    mC.stroke();    
}

function clearCanvas() {

    c.clearRect(0, 0, 1280, 720);
}


function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}
