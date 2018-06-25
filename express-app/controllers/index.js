var express = require('express');
var router = express.Router();
var modelPerson = require('../models/person');

/* GET home page. */
router.get('/', function(req, res, next) {
    new modelPerson().selectAll().then((persons) => {
        res.render('index',
            {
                title: 'Home',
                persons: persons
            }
        );
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
