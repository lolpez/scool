var express = require('express');
var router = express.Router();
var modelWorker = require('../models/worker');

/* Api V1. */
router.post('/status', function (req, res, next) {
    res.send({ message: "Scool server running." });
});

//Initialize database from excel file
router.post('/initdb', function (req, res, next) {
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('trabajadores.xlsx').then(function() {
        var data = [];  
        var worksheet = workbook.getWorksheet('workers');
        columns = worksheet.getRow(1).values;
        columns.shift();         
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            var values = row.values;
            values.shift();
            if (rowNumber > 1){
                var obj = {};
                columns.forEach(function(ele, i){
                    obj[ele] = values[i];
                })
                data.push(obj);
            }            
        });
        data.forEach((worker) => {
            new modelWorker({
                startDate: (worker.fechaIngreso) ? worker.fechaIngreso : null,
                salary: (worker.haberBasico) ? worker.haberBasico : null,
                charge: (worker.cargo) ? worker.cargo : null,
                type: (worker.tipo) ? worker.tipo : null,
                afp: (worker.afp) ? worker.afp : null,
                afpAccount: (worker.numeroCuentaAfp) ? worker.numeroCuentaAfp : null,
                person: {
                   identification: (worker.ci) ? worker.ci : null,
                   identificationExt: (worker.ext) ? worker.ext : null,
                   nationality: (worker.nacionalidad) ? worker.nacionalidad : null,
                   firstName: (worker.nombre1) ? worker.nombre1 : null,
                   secondName: (worker.nombre2) ? worker.nombre2 : null,
                   paternalLastName: (worker.primerApelldo) ? worker.primerApelldo : null,
                   maternalLastName: (worker.segundoApellido) ? worker.segundoApellido : null,
                   marriedLastName: (worker.apellidoCasada) ? worker.apellidoCasada : null,
                   birthday: (worker.fechaNacimiento) ? worker.fechaNacimiento : null,
                   sex: (worker.sexo) ? worker.sexo : null,
                }
            }).insert();
        });        
    });
});

module.exports = router;
