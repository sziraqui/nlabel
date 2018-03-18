var express = require('express');
var router = express.Router();

/* GET images directory */
router.get('/', (req, res, next) => {
    res.render('index', {title:'Gallery'});
});

module.exports = router;