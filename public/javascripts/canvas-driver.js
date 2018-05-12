/**
 * Global variables and constants
 */
var canvas, c;
var mCanvas, mC;
const picDir = '/data/pictures/';
var currImg;
var shouldDraw = false;
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var output = {};
var trash = [];

/**
 * Event handlers
 */
window.onload = function() {
    console.log('I/canvas: onload');
    canvas = document.getElementById('selection-layer');
    c = canvas.getContext('2d');

    mCanvas = document.getElementById('main-layer');
    mC = mCanvas.getContext('2d');

    c.strokeStyle = "red";
    c.fillStyle = "blue";
    c.globalAlpha = 0.5;
    mC.strokeStyle = "green";
    console.log('I/canvas: Both canvases ready');
    // custom event triggered after image is rendered on main canvas
    mCanvas.addEventListener('imageRendered', redrawBBs);
    console.log('I/canvas: imageRendered event added');
    renderImage(mCanvas);
  
    console.log('I/canvas: image rendered');
    canvas.onmousedown = mouseHold;
    canvas.onmousemove = mouseMove;
    canvas.onmouseup = mouseRelease;

    /**
     * Handle clicks
     */
    document.getElementById("bb-save-btn").onclick = saveItem;
    document.getElementById("tb-next").onclick = nextImage;
    document.getElementById("tb-previous").onclick = previousImage;
    document.getElementById("tb-save-all").onclick = saveAll;
    document.getElementById("tb-discard-all").onclick = discardAll;
    document.getElementById("tb-undo").onclick = undo;
    document.getElementById("tb-redo").onclick = redo;

    /**
     * Handle text change. Page will reload with new params
     * defined by changed text
     */
    document.getElementById("data-classname").onchange = onClassChange;

    /**
     * Clear text on focus for easier selection of next item
     */
    document.getElementById("data-classname").onfocus = function() {
        this.value = "";
    };
    var labelInps = document.getElementsByClassName("data-label-value");
    for (var i = 0; i < labelInps.length; i++) {
        labelInps[i].onfocus = function() {
            this.value = "";
        }
    }
}


function saveItem() {
    saveBB(startX, startY, endX - startX, endY - startY);
    console.log('saveItem: start saving');
    var classname = getCurrClass();
    var labels = getLabels();
    var item = {
        location: {
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY
        },
        classname: classname,
        labels: labels
    }
    console.log('output:', JSON.stringify(output, null, 4));
    output.annotes.push(item);
    console.log('saveItem: end saving');
    var jsonViewer = document.getElementById('json-viewer');
    jsonViewer.value = JSON.stringify(output);

}


function renderImage(target) {
    console.log('rendering image');
    var event = new Event('imageRendered');
    var image = new Image();
    currImg = document.getElementById('img-name').innerHTML;
    if(typeof currImg != 'undefined') {
        image.src = picDir + currImg;
        var imgW = parseInt(document.getElementById('img-true-w').innerHTML);
        var imgH = parseInt(document.getElementById('img-true-h').innerHTML);
        image.onload = function() {
            mC.drawImage(image, 0, 0, imgW, imgH,
                                0, 0, mC.canvas.width, mC.canvas.height);
            
            target.dispatchEvent(event);
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
        if (val == "") {
            val = null;
        }
        label = {
            name: name,
            value: val
        }
        labels.push(label);
    }
    return labels;
}


function redrawBBs() {

    output = {
        filename: currImg,
        annotes: []
    };

    var jsonStr = document.getElementById('json-viewer').value;
    if(jsonStr == "") {
        return;
    }
    var data;
    try {
        data = JSON.parse(jsonStr);
    } catch (error) {
        console.log('E/onResume:', error);
        data = {};
    }
    if (data.hasOwnProperty('filename') && data.hasOwnProperty('annotes')) {
        output = data;
    }
    if(currImg != output.filename) return false;
    if(Array.isArray(output.annotes) && typeof output.annotes != 'undefined'){
        for(var i = 0; i < output.annotes.length; i++) {
            var bb = output.annotes[i].location;
            console.log('I/onResume: redrawing canvas...');
            if(typeof bb != 'undefined'){
                saveBB(bb.startX, bb.startY,
                       bb.endX - bb.startX, bb.endY - bb.startY);
            }
        }
    }
    return true;
}


function nextImage() {
    window.location.href = "/gallery/next-image";
    return true; // to satisfy a bug in chrome
}


function previousImage() {
    window.location.href = "/gallery/previous-image";
    return true; // to satisfy a bug in chrome
}


function saveAll(){
    $("#submit-save-all").click();
}


function discardAll() {
    output.annotes = [];
    document.getElementById('json-viewer').value = JSON.stringify(output);
    clearCanvas(mC);
    renderImage(mCanvas);
}


function onClassChange() {
    var classname = document.getElementById('data-classname').value;
    saveAll();
}


function undo() {
    if (output.annotes.length > 0) {
        trash.push(output.annotes.pop());
        document.getElementById('json-viewer').value = JSON.stringify(output);
        clearCanvas(mC);
        renderImage(mCanvas);
    }
}

function redo() {
    if(trash.length > 0) {
        output.annotes.push(trash.pop());
        document.getElementById('json-viewer').value = JSON.stringify(output);
        clearCanvas(mC);
        renderImage(mCanvas);
    }
}