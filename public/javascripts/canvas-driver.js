/**
 * Global variables and constants
 */
var canvas, c;
var mCanvas, mC;
const picDir = '/data/pictures/';
var shouldDraw = false;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var items = [];
/**
 * Event handlers
 */
window.onload = function() {
    
    canvas = document.getElementById('selection-layer');
    c = canvas.getContext('2d');

    mCanvas = document.getElementById('main-layer');
    mC = mCanvas.getContext('2d');

    renderImage();

    c.strokeStyle = "red";
    c.fillStyle = "blue";
    c.globalAlpha = 0.5;
    mC.strokeStyle = "green";
    canvas.onmousedown = mouseHold;
    canvas.onmousemove = mouseMove;
    canvas.onmouseup = mouseRelease;

    /**
     * Handle clicks
     */
    document.getElementById('bb-save-btn').onclick = saveItem;
}


function saveItem() {
    saveBB(startX, startY, endX - startX, endY - startY);
    
    var classname = getCurrClass();
    var labels = getLabels();
    const item = {
        location: {
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY
        },
        classname: classname,
        labels: labels
    }
    items.push(item);
    saveAnnotation();

}

function saveAnnotation(output) {
    var imgname = document.getElementById('img-name').innerHTML;
    output = {
        filename: imgname,
        annotes: items
    }
    
    var jsonViewer = document.getElementById('json-viewer');
    jsonViewer.innerHTML = JSON.stringify(output, null, 4);
}

function renderImage() {
    console.log('rendering image');
    var image = new Image();
    var name = document.getElementById('img-name').innerHTML;
    if(typeof name != 'undefined') {
        image.src = picDir + name;
        var x = 0;
        var y = 0;
        var width = mC.canvas.width;
        var height = mC.canvas.height;

        image.onload = function() {
            mC.drawImage(image, x, y, width, height);
            console.log('Image rendered successfully');
            console.log(`I/canvas: Height: ${mCanvas.height} Width: ${mCanvas.width}`);
        };
    }
}


function mouseHold(event) {
    shouldDraw = true;
    var pos = getMousePos(event);
    startX = pos.x;
    startY = pos.y;
    console.log(`currX ${startX} currY ${startY}`);

}


function mouseMove(event) {
    var prevX = 0;
    var prevY = 0;
    if(shouldDraw) {
       var pos = getMousePos(event);
       endX =  pos.x;
       endY = pos.y;
       console.log(`posx ${pos.x} posy ${pos.y}`);
       drawSelection(startX, startY, endX - startX, endY - startY);
       showBBInfo();
    }
}


function mouseRelease(event) {
    shouldDraw = false;
    var pos = getMousePos(event);
    endX =  pos.x;
    endY = pos.y;
    console.log(`posx ${pos.x} posy ${pos.y}`);
    drawBB(startX, startY, endX - startX, endY - startY);
    showBBInfo();
}


function showBBInfo(){
    document.getElementById('bb-start-x').innerHTML = startX;
    document.getElementById('bb-start-y').innerHTML = startY;
    document.getElementById('bb-end-x').innerHTML = endX;
    document.getElementById('bb-end-y').innerHTML = endY;
    document.getElementById('bb-width').innerHTML = Math.abs(endX - startX);
    document.getElementById('bb-height').innerHTML = Math.abs(endY - startY);
}


function drawSelection(x, y, w, h) {
    clearCanvas(c);
    c.fillRect(x, y, w, h);
}


function drawBB(x, y, w, h) {
    clearCanvas(c);
    c.globalAlpha = 1;
    c.rect(x, y, w, h);
    c.stroke();    
    c.globalAlpha = 0.5;
}


function saveBB(x, y, w, h) {
    clearCanvas(c);
    mC.rect(x, y, w, h);
    mC.stroke();
}


function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
}


function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}


function getCurrClass() {
    var classname = document.getElementById('data-classname').value;
}

function getLabels() {
    var labels = [];
    var labelNodes = document.getElementsByName('label-container');
    for(var i = 0; i < labelNodes.length; i++) {
        var name = labelNodes[i].getElementsByClassName('data-label-name')[0].innerHTML;
        var val = labelNodes[i].getElementsByClassName('data-label-value')[0].value;
        label = {
            name: name,
            value: val
        }
        labels.push(label);
    }
    return labels;
}