var classItemStart = "  <li class='class-li' name='class-li'>"
            +"    <div>"
            +"      <input class='class-name' placeholder='classname'></input>"
            +"      <ul class='label-ul' name='label-ul'>";
var labelItem = "       <li class='label-li' name='label-li'>"
            +"            <input type='text' class='label-name-input' name='label-name-input' placeholder='label name'>"
            +"            <input type='text' class='label-value-input' name='label-value-input' placeholder='default values'>"
            +"          </li>";
var classItemEnd = " </ul>" 
            +"    </div>"
            +"  </li>";
var addClassBtn = "<button type='button' onclick='addLabelListItem(this)'>+ Label</button>";



function addClass(){
    $('#class-ul').append(classItemStart + labelItem + classItemEnd);
    $('#class-ul').append(addClassBtn);
}

// Does not work
function removeClass() {
    $('#class-ul').empty();
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
    var labelUl = clickedItem.parentNode.parentNode.getElementsByClassName('label-ul');
    $(labelUl[0]).append(labelItem);
}
