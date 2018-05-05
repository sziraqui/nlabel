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
  classList: Object.keys(config.classes).join(' '),
  classkeys: Object.keys(config.classes)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', substitute);
});


router.post('/new', function(req, res, next) {
    updateSubstitute(req.body);
    res.redirect('/');
});


router.post('/', function(req, res, next) {
  // get a list of file names
  
  config = updateConfig(req.body);
  
  console.log('new config', JSON.stringify(config, null, 4));
  // update config file
  fs.writeFile(path.join(dataDir,'config.json'), JSON.stringify(config, null, 4), (err) => {
    if (err) {
      console.log('E/updateConfig:', err.message);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
  
});


function updateSubstitute(body){
  var fileDir = String(body.directoryPath);
  var imgWidth = Number(body.imgWidthInput);
  var imgHeight = Number(body.imgHeightInput);
  var classList = String(body.classesInput);
   // update substitute json
   if (fileDir != '' && fileDir != 'undefined') {
    substitute.dir = fileDir;
  }
  if (classList != '') {
    substitute.classList = classList;
    substitute.classkeys = classList.split(' ');
  }
  if (imgHeight !=0 && imgWidth !=0 && !isNaN(imgWidth) && !isNaN(imgHeight)) {
    substitute.imgWidth = imgWidth;
    substitute.imgHeight = imgHeight;
  }
  
  return substitute
}


function updateConfig(body) {
  
  var classes = body.newclasses;
  // update config.json
  config.rootDir = substitute.dir;
  config.imageSize.width = substitute.imgWidth;
  config.imageSize.height = substitute.imgHeight;
  if (typeof classes != 'undefined') {
    config.classes = JSON.parse(classes);
  } else {
    config.classes = substitute.classes;
  }
  
  return config
}

module.exports = router;
