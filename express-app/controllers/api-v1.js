var express = require('express');
var router = express.Router();
var modelPerson = require('../models/person');

/* Api V1. */
router.post('/status', function(req, res, next) {
    res.send({message: "Scool server running."});
});

//Test Insert
router.post('/test', function(req, res, next) {
    var person = new modelPerson("Luis","Lopez","Sandi");
    person.insert().then((objPerson) => {
        res.send(objPerson);
    }).catch((err) => {
        res.send(err);
    });
});

//Test Update
router.post('/test2', function(req, res, next) {
    var md = new modelPerson();
    md.findById("KgggqAEzI7wFkKYe").then((objPerson) => {
        
        console.log(objPerson)
    }).catch((err) => {
        res.send(err);
    });
   /* person.name = "XD";
    person.update().then((objPerson) => {
        res.send(objPerson);
    }).catch((err) => {
        res.send(err);
    });*/
});

module.exports = router;
