var canvas, c;
const picDir = '/data/pictures/';
var shouldDraw = false;
var currX = 0;
var currY = 0;

window.onload = function() {
    
    canvas = document.getElementById('artboard'),
    c = canvas.getContext('2d');

    renderImage();
    c.fillStyle = "red";
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
        var width = canvas.width;
        var height = canvas.height;

        image.onload = function() {
            c.drawImage(image, x, y, width, height);
            console.log('Image rendered successfully');
            console.log(`I/canvas: Height: ${canvas.height} Width: ${canvas.width}`);
        };
    }
}

function drawBB(x, y, w, h) {
    c.rect(x, y, w, h);
    c.stroke();
}

function mouseHold(event) {
    shouldDraw = true;
    var pos = getMousePos(event);
    currX = pos.x;
    currY = pos.y;
    console.log(`currX ${currX} currY ${currY}`);

}

function mouseRelease(event) {
    shouldDraw = false;
    var pos = getMousePos(event);
    var w = Math.abs(currX - pos.x);
    var h = Math.abs(currY - pos.y);
    console.log(`posx ${pos.x} posy ${pos.y}`);
    drawBB(currX, currY, w, h);
}

function mouseMove(event) {
    var prevX = 0;
    var prevY = 0;
    if(shouldDraw) {
       // c.clearRect(0, 0, prevX, prevY);
       // renderImage();
       // var pos = getMousePos(event);
       // var w = Math.abs(currX - pos.x);
       // var h = Math.abs(currY - pos.y);
       // console.log(`posx ${pos.x} posy ${pos.y}`);
       // drawBB(currX, currY, w, h);
       // prevX = w;
       // prevY = h;
    }
}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}
