var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var linkUserdir = require('../tools.js').linkUserDir;
var loadJSON = require('../tools.js').loadJSON;
const dataDir = require('../tools.js').dataDir;
const picDir = require('../tools.js').picDir;
var config;

// template context for Handlebars
var substitute;

/* GET home page. */
router.get('/', function(req, res, next) {
  loadJSON(path.join(dataDir, 'config.json'), (data) => {
    config = JSON.parse(data);
    substitute = {
      title: 'NLabel',
      dir: config.rootDir,
      imgWidth: config.imageSize.width,
      imgHeight: config.imageSize.height,
      classes: config.classes
    }
    res.render('index', substitute);
  });
  
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
      res.redirect('/gallery');
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
