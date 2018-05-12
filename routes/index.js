var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var linkUserdir = require('../tools.js').linkUserDir;
const dataDir = require('../tools.js').dataDir;
const picDir = require('../tools.js').picDir;
var config = require(path.join(dataDir, 'config.json'));

// template context for Handlebars
substitute = {
  title: 'NLabel',
  dir: config.rootDir,
  imgWidth: config.imageSize.width,
  imgHeight: config.imageSize.height,
  classes: config.classes
}

/* GET home page. */
router.get('/', function(req, res, next) {
  config = require(path.join(dataDir, 'config.json'));
  res.render('index', substitute);
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
      linkUserdir(config.rootDir, picDir);
      res.sendStatus(200);
    }
  });
  
});


function updateConfig(body) {
  
  var classes = body.newclasses;
  // update config.json
  var fileDir = String(body.directoryPath);
  var imgWidth = Number(body.imgWidthInput);
  var imgHeight = Number(body.imgHeightInput);
  
   if (fileDir != '' && fileDir != 'undefined') {
    config.rootDir = fileDir;
  }
 
  if (imgHeight !=0 && imgWidth !=0 && !isNaN(imgWidth) && !isNaN(imgHeight)) {
    config.imageSize.width = imgWidth;
    config.imageSize.height = imgHeight;
  }
  if (typeof classes != 'undefined') {
    config.classes = JSON.parse(classes);
  }
  
  return config
}

module.exports = router;
