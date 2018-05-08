var express = require('express');
var path = require('path');
const Jimp = require('jimp');

const writeCSV = require('../tools.js').writeCSV;
const json2csv = require('../tools.js').json2csv;
const tempDir = require('../tools.js').tempDir;
var parseTagsNlabels = require('../tools.js').parseTagsNlabels;
var getImagesByDir = require('../tools.js').getImagesByDir;
var picDir = require('../tools.js').picDir;
var config = require('../public/data/config.json');

var router = express.Router();
var jsonParser = express.json();

var imgPtr = 0;
var imageList = [];

var substitute = {
    dir: config.rootDir,
    canvas: {
        width: config.imageSize.width,
        height: config.imageSize.height
        },
    image: {},
    classList: getClassList(config.classes),
    currClass : config.classes[0]
}


/* GET images directory */
imageList = getImagesByDir(config.rootDir, (images) => {
    imageList = images;
    });

router.get('/', (req, res, next) => {
    imgPtr = -1;
    getNextImage((imageProps) => {
        substitute.image = imageProps;
        res.render('gallery', substitute);
    });    
    
});

router.get('/:ptr/:classname', (req, res, next) => {
   
    var currClass = findClassByName(config.classes, req.params.classname);
    if (currClass == null) {
        res.redirect('/gallery');
    } else {
        imgPtr = Number(req.params.ptr) - 1;
        getNextImage((imageProps) => {
            substitute.image = imageProps;
            substitute.currClass = currClass;
            res.render('gallery', substitute);
        });
    }
});


router.post('/save-all', (req, res, next) => {
    console.log('I/saveAll:', req.body.annotesData);
    res.sendStatus(200);
});


router.post('/', jsonParser, (req, res, next) => {
    var payload = JSON.parse(req.body.payload);
    console.log("D/router.post: payload", JSON.stringify(payload));
    tags = payload.tags;
    console.log("D/router.post: tags", JSON.stringify(tags));
    var labels = payload.labels;
    var data = json2csv(tags, labels); 
    var fileName = 'test.csv';

    writeCSV(fileName, data, (file) => {
        fileName = file;
        res.download(path.join(tempDir, fileName));
    });

});

function getNextImage(callback) {
    imgPtr++;
    if (imageList.length == 0) {
        console.log('E/getNextImage: No images in imageList');
        return {};
    }
    if (imgPtr < imageList.length) {
        // read image[i] and return its props
        var image = new Jimp(path.join(config.rootDir, imageList[imgPtr]), (err, image) => {
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

function findImageByName(imageName) {

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