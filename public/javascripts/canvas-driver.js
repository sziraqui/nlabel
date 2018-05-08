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
var output = [];
/**
 * Event handlers
 */
window.onload = function() {
    
    canvas = document.getElementById('selection-layer');
    c = canvas.getContext('2d');

    mCanvas = document.getElementById('main-layer');
    mC = mCanvas.getContext('2d');

    c.strokeStyle = "red";
    c.fillStyle = "blue";
    c.globalAlpha = 0.5;
    mC.strokeStyle = "green";
    
    // custom event triggered after image is rendered on main canvas
    mCanvas.addEventListener('imageRendered', redrawBBs);
    renderImage(mCanvas);

    canvas.onmousedown = mouseHold;
    canvas.onmousemove = mouseMove;
    canvas.onmouseup = mouseRelease;

    /**
     * Handle clicks
     */
    document.getElementById('bb-save-btn').onclick = saveItem;
    document.getElementById('bb-save-all').onclick = saveAll;
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
    saveAnnotation(output);

}


function saveAnnotation(output) {
    var imgname = document.getElementById('img-name').innerHTML;
    const data = {
        filename: imgname,
        annotes: items
    }
    output.push(data);
    var jsonViewer = document.getElementById('json-viewer');
    jsonViewer.innerHTML = JSON.stringify(output, null, 4);
}


function saveAll(){
    $('#submit-save-all').click();
}


function renderImage(target) {
    console.log('rendering image');
    var event = new Event('imageRendered');
    var image = new Image();
    var name = document.getElementById('img-name').innerHTML;
    if(typeof name != 'undefined') {
        image.src = picDir + name;
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
    var jsonStr = document.getElementById('json-viewer').innerHTML;
    if(jsonStr == "") return;
    var data = {};
    try {
        data = JSON.parse(jsonStr);
    } catch (error) {
        console.log('E/onResume:', error);
    }
    output = data;
    var imgname = document.getElementById('img-name').innerHTML;

    var drawList = currImageAnnotes(data, imgname);
    console.log('drawList')
    if(Array.isArray(drawList) && typeof drawList != 'undefined'){
        for(var i = 0; i < drawList.length; i++) {
            var bb = drawList[i].location;
            console.log('I/onResume: redrawing canvas...');
            if(typeof bb != 'undefined'){
                saveBB(bb.startX, bb.startY,
                       bb.endX - bb.startX, bb.endY - bb.startY);
                items.push(drawList[i]);
                
            }
        }
    }
}


function currImageAnnotes(data, imgname) {

    for(var i = 0; i < data.length; i++) {
        if(data[i].filename == imgname) {
            
            return data[i].annotes;
        }
    }
    return [];
}