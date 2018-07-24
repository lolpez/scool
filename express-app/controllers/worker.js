var express = require('express');
var router = express.Router();
var modelWorker = require('../models/worker');

/* GET home page. */
router.get('/', function(req, res, next) {
    modelWorker.selectAll().then((workers) => {        
        res.render('worker/index',
            {
                title: `Todo el personal`,
                workers: workers
            }
        );
    }).catch((err) => {
        res.send(err);
    });
});

router.get('/:type', function(req, res, next) {
    modelWorker.selectByType(req.params.type).then((workers) => {        
        res.render('worker/index',
            {
                title: `Personal ${req.params.type}`,
                workers: workers
            }
        );
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
