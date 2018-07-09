var express = require('express');
var router = express.Router();
var modelTemplate = require('../models/template');

/* GET home page. */
router.get('/', function(req, res, next) {
    modelTemplate.selectAll().then((templates) => {
        res.render('template/index',
            {
                title: 'Home',
                templates: templates
            }
        );
    }).catch((err) => {
        res.send(err);
    });
});

router.post('/', function(req, res, next) {
    var template = new modelTemplate({name: "hello", month: 8, year: 2018, idTemplateType: "XD"});
    template.insert().then((doc) => {
        res.status(201);
        res.location(`${req.protocol}://${req.get("host")}${req.originalUrl}/${doc.id}`);
        res.send({
            response: doc,
            message: "Nueva planilla creada",
            success: true
        })
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
