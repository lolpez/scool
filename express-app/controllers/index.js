var express = require('express');
var router = express.Router();
var modelWorker = require('../models/worker');

/* GET home page. */
router.get('/', function(req, res, next) {
    modelWorker.getCountByType("docente").then((docenteCount) => {
        modelWorker.getCountByType("administrativo").then((administrativoCount) => {
            modelWorker.getCountByType("soporte").then((soporteCount) => {
                res.render('index',
                    {
                        title: 'Home',
                        docenteCount: docenteCount,
                        administrativoCount: administrativoCount,
                        soporteCount: soporteCount
                    }
                );
            }).catch((err) => {
                res.send(err);
            });
        }).catch((err) => {
            res.send(err);
        });
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
