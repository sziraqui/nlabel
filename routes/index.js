var express = require('express');
var router = express.Router();
var parseTagsNlabels = require('../tools.js').parseTagsNlabels;
var getImagesByDir = require('../tools.js').getImagesByDir;
var config = require('../public/data/config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  substitute = {
    title: 'NLabel',
    dir: config.rootDir,
    imgWidth: config.imageSize.width,
    imgHeight: config.imageSize.height,
    classesList: Object.keys(config.classes).join(',')
  }
  res.render('index', substitute);
});


router.post('/', function(req, res, next) {
  // get a list of file names
  var fileDir = String(req.body.directoryPath);
  var tags = String(req.body.classesInput);
  var tagsArr = tags.split(',');
  getImagesByDir(fileDir, (imageList) => {
    var data = parseTagsNlabels(fileDir, imageList, tagsArr);
    console.log(JSON.stringify(data));
    res.render('gallery', {"images":data});
  });
  
});


module.exports = router;
