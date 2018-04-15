var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const writeCSV = require('../tools.js').writeCSV;
const json2csv = require('../tools.js').json2csv;
var jsonParser = bodyParser.json();

/* GET images directory */
router.get('/', (req, res, next) => {
    var data = require('../public/data/dummy-data.js').setupData;
    res.render('gallery',{"images":data});
});


router.post('/', jsonParser, (req, res, next) => {
    var payload = req.body;
    console.log("payload",JSON.stringify(payload));
    tags = payload.tags;
    console.log("tags",JSON.stringify(tags));
    var labels = payload.labels;
    var data = json2csv(tags, labels); 
    var filename = '';
    writeCSV('test.csv', data, (file) => {
        console.log('attempted to write', file);
        filename = file;
    });
    res.download('./temp/'+filename);

});

module.exports = router;