/* All backend functions are defined in this module */
const fs = require('fs');
const path = require('path');
const mimeCheck = require('mime-types');
const newLine = require('os').EOL;
const tempDir = path.join(__dirname, 'temp');
const dataDir = path.join(__dirname, 'public', 'data');
const outDir = path.join(dataDir, 'outputs');
const picDir = path.join(dataDir, 'pictures');


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


function writeCSV(fileName, data, callback) {

    if(!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    fileName = getSafeFileName(fileName);
    
    fs.writeFile(path.join(tempDir, fileName), data, (err) => {
        if (err) {
            console.log(`E/writeCSV: cannot write file ${fileName}. ${err.message}`);
            return false;
        } else {
            console.log(`I/writeCSV: wrote ${fileName} file`); 
        }
        callback(fileName);
    });
    return true;
}


function getSafeFileName(fileName, suffix=1) {
    let safeName = fileName;
    let extIndex = fileName.lastIndexOf('.');
    while (fs.existsSync(path.join(tempDir, safeName)) && suffix <= Number.MAX_SAFE_INTEGER) {
        // file exists, change file name
        safeName = fileName.substr(0, extIndex) + '-' + suffix + fileName.substr(extIndex);
        suffix++;
    } 
    // file doesn't exist, safe to use existing name
    return safeName;
}


function parseTagsNlabels(fileDir, fileList, tagList) {
    out = [];
    for (var i in fileList) {
        var fileName = fileList[i];
        var json = {'src': path.join(fileDir,fileName),
                    'filename': String(fileName),
                    'id': Number(i),
                    'tags':tagList};
        out.push(json);
    }
    return out;
} 


function getImagesByDir(dir, callback) {
    
    imageList = [];
    fs.readdir(dir, (err, items) => {
        if(err) {
            console.log('E/getImagesByDir:', err.message);
        } else {
            for(var i in items) {
                mime_check = mimeCheck.lookup(items[i]);
                if(typeof mime_check == 'string' && mime_check.indexOf('image')!=-1) {
                    
                    imageList.push(items[i]);
                }
            }
            callback(imageList);
        }
    });
}


function extnLessName(filename) {
    return path.basename(filename, path.extname(filename));
}


function linkUserDir(target, source) {
    // overrides existing
    var temp = source + '.bak';
    fs.symlinkSync(target, temp, 'dir');
    fs.renameSync(temp, source);
}


function normalizeBox(item, ogSize, scaleSize) {
    
    var W = scaleSize.width / ogSize.width;
    var H = scaleSize.height / ogSize.height;

    item["scaled"] = {
        startX: Math.round(item.location.startX * W),
        startY: Math.round(item.location.startY * H),
        endX: Math.round(item.location.endX * W),
        endY: Math.round(item.location.endY * H)
    }
    return item;
}


exports.getSafeFileName = getSafeFileName;
exports.json2csv = json2csv;
exports.writeCSV = writeCSV;
exports.parseTagsNlabels = parseTagsNlabels;
exports.getImagesByDir = getImagesByDir;
exports.linkUserDir = linkUserDir;
exports.extnLessName = extnLessName;
exports.normalizeBox = normalizeBox;
exports.dataDir = dataDir;
exports.tempDir = tempDir;
exports.outDir = outDir;
exports.picDir = picDir;