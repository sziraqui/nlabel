var express = require('express');
var path = require('path');
const writeCSV = require('../tools.js').writeCSV;
const json2csv = require('../tools.js').json2csv;
const tempDir = require('../tools.js').tempDir;
var parseTagsNlabels = require('../tools.js').parseTagsNlabels;
var getImagesByDir = require('../tools.js').getImagesByDir;
var config = require('../public/data/config.json');

var router = express.Router();
var jsonParser = express.json();

/* GET images directory */
router.get('/', (req, res, next) => {
    res.render('gallery');
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


module.exports = router;