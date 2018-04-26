var classItemStart = "  <li class='class-li' name='class-li'>"
            +"    <div>"
            +"      <span class='label-name'>Person</span>"
            +"      <button type='button' onclick='addLabelListItem(this)'>+ Label</button>"
            +"      <ul class='label-ul' name='label-ul'>";
var labelItem = "       <li class='label-li' name='label-li'>"
            +"            <input type='text' class='label-name-input' name='label-name-input' placeholder='label name'>"
            +"            <input type='text' class='label-value-input' name='label-value-input' placeholder='default values'>"
            +"          </li>";
var classItemEnd = " </ul>" 
            +"    </div>"
            +"  </li>";

function createClasses(){
    removeClass();
    var classes = String(document.getElementById("classes-input-id").value);
    if (classes.includes(',')) {
        classes = classes.split(',');
    } else {
        var classes = [classes];
    }
    for(var i = 0; i < classes.length; i++) {
       $('#class-ul').append(classItemStart + labelItem + classItemEnd);
    }
    nameClasses(classes);
}

// Does not work
function removeClass() {
    var parent = document.getElementById("classes-input-id");
    for (var i = 0; i < parent.length; i++) {
        parent.removeChild(parent[i]);
    }
}

function nameClasses(names) {
    var classUl = document.getElementById("class-ul");
    for (var i = 0; i < names.length;) {
        var classListItems = classUl.getElementsByClassName("class-li");
        for (var j = 0; j < classListItems.length; j++) {
            var labelName = classListItems[j].getElementsByClassName("label-name");
            labelName[0].innerHTML = names[i];
            i++;
        }
    }
}

function addLabelListItem(clickedItem) {
    var labelUl = clickedItem.parentNode.getElementsByClassName('label-ul');
    $(labelUl[0]).append(labelItem);
}