var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var dataDir = require('../tools.js').dataDir;
var config = require(path.join(dataDir, 'config.json'));

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
  var imgWidth = req.body.imgWidthInput;
  var imgHeight = req.body.imgHeightInput;
  var classes = req.body.classesInput.split(',');
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
  
  console.log('new config',JSON.stringify(config));
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


module.exports = router;
