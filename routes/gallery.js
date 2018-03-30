var express = require('express');
var router = express.Router();

const writeCSV = require('../tools.js').writeCSV;
const json2csv = require('../tools.js').json2csv;

/* GET images directory */
router.get('/', (req, res, next) => {
    var data = require('../public/data/dummy-data.js').setupData;
    res.render('gallery',{"images":data});
});


router.post('/', (req, res, next) => {
    var tags = require('../public/data/dummy-data.js').tags;
    var labels = require('../public/data/dummy-data.js').labels;
    var data = json2csv(tags, labels);
    var filename = '';
    writeCSV('test.csv', data, (file) => {
        console.log('attempted to write', file);
        filename = file;
    });
    res.download('./temp/'+filename);

});

module.exports = router;