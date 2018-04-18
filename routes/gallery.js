var express = require('express');
var path = require('path');
const writeCSV = require('../tools.js').writeCSV;
const json2csv = require('../tools.js').json2csv;
const tempDir = require('../tools.js').tempDir;

var router = express.Router();
var jsonParser = express.json();

/* GET images directory */
router.get('/', (req, res, next) => {
    var data = require('../public/data/dummy-data.js').setupData;
    res.render('gallery',{"images":data});
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