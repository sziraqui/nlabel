var express = require('express');
var router = express.Router();

/* GET images directory */
router.get('/', (req, res, next) => {
    var data = require('../public/samples/dummy-data.js').setupData;
    res.render('gallery',{"images":data});
});

module.exports = router;