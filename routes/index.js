var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var dataDir = require('../tools.js').dataDir;
var config = require(path.join(dataDir, 'config.json'));

substitute = {
  title: 'NLabel',
  dir: config.rootDir,
  imgWidth: config.imageSize.width,
  imgHeight: config.imageSize.height,
  classes: config.classes,
  classesList: Object.keys(config.classes).join(' '),
  classkeys: Object.keys(config.classes)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('substitute:', JSON.stringify(substitute));
  res.render('index', substitute);
});


router.post('/new', function(req, res, next) {
    updateSubstitute(req.body);
    res.redirect('/');
});


router.post('/', function(req, res, next) {
  // get a list of file names
  
  config = updateConfig(req.body);
  console.log('new config', JSON.stringify(config));
  // update config file
  fs.writeFile(path.join(dataDir,'config.json'), JSON.stringify(config), (err) => {
    if (err) {
      console.log('E/updateConfig:', err.message);
      res.status(500);
    } else {
      res.redirect('/gallery');
    }
  });
  
});

function updateSubstitute(body){
  var fileDir = String(body.directoryPath);
  var imgWidth = body.imgWidthInput;
  var imgHeight = body.imgHeightInput;
  var classes = String(body.classesInput);
   // update substitute json
   if (fileDir != '') {
    substitute.dir = fileDir;
  }
  if (classes != '') {
    substitute.classesList = classes;
    substitute.classkeys = classes.split(' ');
  }
  if (imgHeight !='' && imgWidth !='') {
    substitute.imgWidth = imgWidth;
    substitute.imgHeight = imgHeight;
  }
  
  return substitute
}
function updateConfig(body) {
  var fileDir = String(body.directoryPath);
  var imgWidth = body.imgWidthInput;
  var imgHeight = body.imgHeightInput;
  var classes = JSON.parse(body.newconfig);
  console.log('classes', JSON.stringify(classes));
  // update config.json
  if (fileDir != '') {
    config.rootDir = fileDir;
  }
  if (classes != '') {
    config.classes = classes;
  }
  if (imgHeight !='' && imgWidth !='') {
    config.imageSize.width = imgWidth;
    config.imageSize.height = imgHeight;
  }
  
  return config
}

module.exports = router;
