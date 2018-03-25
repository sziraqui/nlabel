var express = require('express');
var router = express.Router();
var parseTagsNlabels = require('../tools.js').parseTagsNlabels;
var getImagesByDir = require('../tools.js').getImagesByDir;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', function(req, res, next) {
  // get a list of file names
  var fileDir = String(req.body.directoryPath);
  var tags = String(req.body.tagTextAreaData);
  var tagsArr = tags.split(',');
  getImagesByDir(fileDir, (imageList) => {
    var data = parseTagsNlabels(fileDir, imageList, tagsArr);
    console.log(JSON.stringify(data));
    res.render('gallery',{"images":data});
  });
  
});


module.exports = router;
