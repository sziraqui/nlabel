var express = require('express');
var path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

const picDir = require('../tools.js').picDir;
const dataDir = require('../tools.js').dataDir;
var config;
var annotations = require('../public/data/annotations.json');
const getImagesByDir = require('../tools.js').getImagesByDir;
const extnLessName = require('../tools.js').extnLessName;
const normalizeBox = require('../tools.js').normalizeBox;
var loadJSON = require('../tools.js').loadJSON;


var router = express.Router();
var jsonParser = express.json();

// Pointer maintains current file index
var imgPtr = 0;
var imageList = [];

// template context for Handlerbars
var substitute = {};


/* GET images directory */

router.get('/', (req, res, next) => {
    loadJSON(path.join(dataDir, 'config.json'), (data) => {
        config = JSON.parse(data);
        loadJSON(path.join(dataDir, 'annotations.json'), (data) => {
            annotations = JSON.parse(data);
            imageList = getImagesByDir(picDir, (images) => {
                imageList = images;
                substitute = {
                    dir: config.rootDir,
                    canvas: {
                        width: config.imageSize.width,
                        height: config.imageSize.height
                        },
                    image: {},
                    classList: getClassList(config.classes),
                    currClass : config.classes[0],
                    currFileData: ""
                }
                res.redirect('/gallery/0');
            });
        });
    });
    
    
});


router.get('/next-image', (req, res, next) => {
    imgPtr = (imgPtr + 1) % imageList.length;
    res.redirect(`/gallery/${imgPtr}/${currClass}`);
});


router.get('/previous-image', (req, res, next) => {
    if (imgPtr <= 0) {
        imgPtr = 0;
    } else {
        imgPtr = imgPtr - 1;
    }
    
    res.redirect(`/gallery/${imgPtr}/${currClass}`);
});


router.get('/:param', (req, res, next) => {
    var ptr = parseInt(req.params.param);
    if(isNaN(ptr)) {
        var classname = req.params.param;
        res.redirect(`/gallery/${imgPtr}/${classname}`);
    } else {
        currClass = substitute.classList[0];
        res.redirect(`/gallery/${imgPtr}/${currClass}`);
    }

});


router.get('/:ptr/:classname', (req, res, next) => {
   
    var currClass = findClassByName(config.classes, req.params.classname);
    if (currClass == null) {
        currClass = {
            classname: classname,
            labels: []
        }
    } else {
        imgPtr = parseInt(req.params.ptr) - 1;
        getNextImage((imageProps) => {
            substitute.image = imageProps;
            substitute.currClass = currClass;
            substitute.currFileData = getDataForImage(imageList[imgPtr]);
            
            res.render('gallery', substitute);
        });
    }
});


router.post('/save-all', (req, res, next) => {
    var data = req.body.annotesData;
    try {
        data = JSON.parse(data);
    } catch (error) {
        console.log('E/save-all:', error.message);
        data = null;
    }
    if(data != null){
        if(!annotations.annotedFiles.includes(data.filename)){
            annotations.annotedFiles.push(data.filename);
            fs.writeFile(path.join(dataDir, 'annotations.json'), JSON.stringify(annotations, null, 4), (err) => {
                if(err) console.log('E/save-all:', err.message);
            });
        }

        var dataFile = extnLessName(data.filename) + '.json';

        for(var i = 0; i < data.annotes.length; i++) {
            data.annotes[i] = normalizeBox(data.annotes[i], data.ogSize, config.imageSize);
        }

        fs.writeFile(path.join(dataDir, 'outputs', dataFile), JSON.stringify(data, null, 4), (err) => {
            if (err) {
                console.log('E/save-all:', err.message);
                res.sendStatus(500);
            } else {
                res.redirect(`/gallery/${imgPtr}/${currClass}`);
            }
        });
    } else {
        res.sendStatus(500);
    }
});


function getNextImage(callback) {
    imgPtr++;
    if (imageList.length == 0) {
        console.log('E/getNextImage: No images in imageList');
        return {};
    }
    if (imgPtr < imageList.length) {
        // read image[i] and return its props
        var image = new Jimp(path.join(picDir, imageList[imgPtr]), (err, image) => {
            if (err) {
                console.log('E/getNextImage:', err.message);
                return getNextImage(callback);
            } else {
                console.log('I/getNextImage: Image read OK');
                imageProps = {
                    name: imageList[imgPtr],
                    dim: {
                        width: image.bitmap.width,
                        height: image.bitmap.height
                    }
                }
                image = null;
                callback(imageProps);
                return;
            }
        });
        
    } else {
        imgPtr = -1;
        return getNextImage(callback);
    }
}


function getClassList(classes) {
    list = [];
    for(var i = 0; i < classes.length; i++) {
        list.push(classes[i].classname);
    }
    return list;
}


function getDataForImage(imgName) {
    for(var i = 0; i < annotations.annotedFiles.length; i++) {
        if(imgName == annotations.annotedFiles[i])
            return fs.readFileSync(path.join(dataDir, 'outputs', extnLessName(annotations.annotedFiles[i]) + '.json'));
    }
    return "";
}


function findClassByName(classes, name) {
    console.log('classes', classes);
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].classname == name) {
            return classes[i];
        }
    }
    return null;
}

module.exports = router;