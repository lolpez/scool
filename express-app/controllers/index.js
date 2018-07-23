var express = require('express');
var router = express.Router();
var modelWorker = require('../models/worker');

/* GET home page. */
router.get('/', function(req, res, next) {
    modelWorker.selectAll().then((workers) => {
        res.render('index',
            {
                title: 'Home',
                workers: workers
            }
        );
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
