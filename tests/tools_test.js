const tools = require('../tools.js');
const fs = require('fs');
const path = require('path');
const newline = require('os').EOL;

const tempDir = path.join('..', 'temp');
// test data
var tags = ['filename','dir','category','age', 'gender', 'skin_tone','hair_color'];
var labels = [ {
        "filename": "tech-wallpapers-007.jpg",
        "dir": "/home/sziraqui/Pictures",
        "category": "person",
        "age": 20,
        "gender": "male",
        "skin_tone": "fair",
        "hair_color": "black"
    }, {
        "filename": "Selection_002.png",
        "dir": "/home/sziraqui/Pictures",
        "category": "person",
        "age": 22,
        "gender": "female",
        "skin_tone": "white",
        "hair_color": "blonde"
    }
];
var filename = 'test.csv';
var data = "filename,dir,category,age,gender,skin_tone,hair_color" + newline
            + "tech-wallpapers-007.jpg,/home/sziraqui/Pictures,person,20,male,fair,black" + newline
            + "Selection_002.png,/home/sziraqui/Pictures,person,22,female,white,blonde";


// test runner
function runTests(){
    testGetSafeFilename();
    testJson2csv();
    testWriteCSV();
}

// test functions
function testGetSafeFilename() {
   var oldname = filename;
   var newname = tools.getSafeFileName(oldname);
   if (newname) {
       console.log("testGetSafeFileName: OK");
       return true;
   } else {
       console.log("testGetSafeFileName: FAIL");
       return false;
    }
}


function testJson2csv() {
    var res = tools.json2csv(tags, labels);
    if (res.localeCompare(data) == 0) {
        console.log('testJson2csv: OK');
    } else console.log('testJson2csv: FAIL');
}


function testWriteCSV(){
    var ogfilename = filename;
    var ogdata = data;
    resfile = tools.writeCSV(ogfilename, ogdata);
    if (fs.existsSync(path.join(tempDir,resfile))) {
        fs.readFile(path.join(tempDir,resfile), (err, res) => {
            if (ogdata.localeCompare(res) == 0) {
               console.log('testWriteCSV: OK');
               return false;
            }
        });
    }
    console.log('testWriteCSV: FAIL');
    return true;
}


exports.runTests = runTests;