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
    var things = ['Rock', 'Paper', 'Scissor'];
    var thing = things[Math.floor(Math.random()*things.length)];
    var template = new modelTemplate({name: thing, month: Math.floor((Math.random() * 12) + 1), year: Math.floor((Math.random() * 3000) + 1000), idTemplateType: "XD"});
    template.insert().then((doc) => {
        res.status(201);
        res.location(`${req.protocol}://${req.get("host")}${req.originalUrl}/${doc._id}`);
        res.send({
            response: doc,
            message: "Nueva planilla creada",
            success: true
        })
    }).catch((err) => {
        res.send(err);
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    modelTemplate.deleteById(id).then((isDeleted) => {
        console.log(isDeleted)
        if (isDeleted){
            res.status(200);
            res.send({
                response: true,
                message: `Plantilla con id ${id} eliminada exitosamente.`,
                success: true
            })
        }else{
            res.status(204);
            res.send({
                response: false,
                message: `Plantilla con id ${id} fallo en eliminar.`,
                success: true
            })
        }        
    }).catch((err) => {
        res.send({
            response: doc,
            message: `Error al eliminar plantilla con id ${id}: ${err}.`,
            success: true
        })
    }) 
});

module.exports = router;
