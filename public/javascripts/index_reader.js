
function postConfigData() {
    var classes = readClasses();
    if (!isEmpty(classes)){
        $('#configForm').append('<textarea name="newclasses" class="hidden">'+JSON.stringify(classes,null,2)+'</textarea>');
    }
    $('#configForm button[type="submit"]').click();
}


function readClasses() {
    classes = [];
    // get #class-ul
    var classUl = document.getElementById("class-ul");
   
    // get all class-li by name and create json for class
    var classLis = classUl.getElementsByClassName("class-li");
    
    // for each li
    for (var i = 0; i < classLis.length; i++) {
        // get .class-name
        var className = classLis[i].getElementsByClassName("class-name")[0].value;
        
      
        var classJson = {};
        // get .label-ul
        var labelUl = classLis[i].getElementsByClassName("label-ul")[0];
        // get .label-li(s)
        
        var labelLis = classLis[i].getElementsByClassName("label-li");
        // for each label-li
        var labelList = [];
        var labelName = null
        for (var j = 0; j < labelLis.length; j++) {
            // get value of .label-name-input
            var labelName = labelLis[j].getElementsByClassName("label-name-input")[0].value;
            if (labelName == '') {
                continue;
            }
           
            // get value of .label-value-input  
            var defaultValues = labelLis[j].getElementsByClassName("label-value-input")[0].value;
            
            // convert space separated string to array of strings/ints
            defaultValues = string2Array(defaultValues);
            if (defaultValues == '') {
                defaultValues = [];
            }
            labelJson = { 
                name: labelName,
                values: defaultValues
            }
            labelList.push(labelJson);
        }
        var classJson = {
            classname: className,
            labels: labelList
        }
        
        classes.push(classJson);
    }
    
    return classes;
}


function string2Array(str) {
    // converts space separated strings into array of strings or ints
    var arr = str.replace(/^[ ]+|[ ]+$/g,'').split(' ');
    console.log('arr'+arr);
    if (arr.length > 1) {
        if (!isNaN(Number(arr[0]))) {
        // input is an integer
        arr = arr.map(Number);
        }
    }
    return arr;
}


function isEmpty(ob) {
    return Object.keys(ob).length == 0;
}
