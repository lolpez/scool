var express = require('express');
var router = express.Router();
var modelTeacher = require('../models/teacher');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('teacher/index',
        {
            title: 'Maestros',
            teachers:  modelTeacher.selectAll(),
            url: req.originalUrl
        }
    );
});

router.post('/', function(req, res, next) {
    var teacher = new modelTeacher(req.body).insert();
    if (teacher){
        res.status(201);
        res.location(`${req.protocol}://${req.get("host")}${req.originalUrl}/${teacher.id}`);
        res.send({
            response: teacher,
            message: "Nuevo maestro registrado.",
            success: true
        })  
    }else{
        res.status(500);
        res.send({
            message: "Error al registrar nuevo maestro.",
            success: false
        });
    }    
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    modelTeacher.deleteById(req.body.id)
    res.status(200);
    res.send({
        response: true,
        message: `Maestro con id ${id} eliminado exitosamente.`,
        success: true
    })
});

module.exports = router;
