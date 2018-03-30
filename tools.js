/* All backend functions are defined in this module */
const fs = require('fs');
const path = require('path');
const mimeCheck = require('mime-types');
const newLine = require('os').EOL;
const tempDir = path.join(__dirname, 'temp');
const dataDir = path.join(__dirname, 'public', 'data');
const outDir = path.join(__dirname, 'public', 'data', 'outputs');

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


function writeCSV(filename, data, callback) {
    if(!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    filename = getSafeFileName(filename);
    callback(filename);
    fs.writeFile(path.join(tempDir, filename), data, (err) => {
        if (err) {
            console.log(`writeCSV/ERROR: cannot write file ${filename}`);
        } else {
            console.log(`writeCSV/INFO: wrote ${filename} file`); 
        }
        callback(filename);
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


function parseTagsNlabels(fileDir, fileList, tagList) {
    out = [];
    for (var i in fileList) {
        var filename = fileList[i];
        var json = {'src':path.join(fileDir,filename), 'filename': String(filename), 'tags':tagList};
        out.push(json);
    }
    return out;
} 

function getImagesByDir(dir, callback) {
    
    imageList = [];
    fs.readdir(dir, (err, items) => {
        if(err) {
            console.log('getImagesByDir/ERROR:', err.message);
        } else {
            for(var i in items) {
                console.log('items[i]:',items[i]);
                if(items[i].lastIndexOf('.')!=-1 && mimeCheck.lookup(items[i]).indexOf('image')!=-1) {
                    linkPath = path.join(dataDir, 'pictures', path.basename(items[i]));
                    fs.symlink(path.join(dir,items[i]),linkPath, (err) => {
                        
                        imageList.push(items[i]);
                    });
                }
            }
        }
        callback(items);
    });
}

exports.getSafeFileName = getSafeFileName;
exports.json2csv = json2csv;
exports.writeCSV = writeCSV;
exports.parseTagsNlabels = parseTagsNlabels;
exports.getImagesByDir = getImagesByDir;