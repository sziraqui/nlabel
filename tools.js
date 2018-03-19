/* All backend functions are defined in this module */
const fs = require('fs');
const path = require('path');
const newLine = require('os').EOL;
const tempDir = path.join(__dirname, 'temp');


function json2csv(tags, labels) {
    
    var data = tags.join(',');
    for (var i in labels) {
        var row = [];
        for (var k in tags) {
            if (labels[i].hasOwnProperty(tags[k])) {
                row.push(labels[i][tags[k]]);
            } else {
                row.push[''];
            }
        }
        data = data + newLine + row.join(',');
    }
    return data;
}


function writeCSV(filename, data) {
    if(!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    filename = getSafeFileName(filename);
    fs.writeFile(path.join(tempDir, filename), data, (err) => {
        if (err) {
            console.log(`writeCSV/ERROR: cannot write file ${filename}`);
            return false
        } else {
            console.log(`writeCSV/INFO: wrote ${filename} file`);
            return filename;
        }
    });
}


function getSafeFileName(filename) {
    if (fs.existsSync(path.join(tempDir, filename))) {
        // file exists, change file name
        let extIndex = filename.lastIndexOf('.');
        filename = filename.substr(0, extIndex) + '-1' + filename.substr(extIndex);
        return getSafeFileName(filename);
    } else {
        // file doesn't exist, safe to use existing name
        return filename;
    }
}


exports.getSafeFileName = getSafeFileName;
exports.json2csv = json2csv;
exports.writeCSV = writeCSV;