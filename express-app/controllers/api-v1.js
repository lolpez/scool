var express = require('express');
var router = express.Router();
var modelWorker = require('../models/worker');

/* Api V1. */
router.post('/status', function (req, res, next) {
    res.send({ message: "Scool server running." });
});

//Initialize database from excel file
router.post('/initdb', function (req, res, next) {
    getWorkersFormExcel().forEach((worker) => {
        new modelWorker({
            startDate: (worker.fechaIngreso) ? new Date(1900, 0, worker.fechaIngreso - 1) : null,
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
               birthday: (worker.fechaNacimiento) ? new Date(1900, 0, worker.fechaNacimiento - 1) : null,
               sex: (worker.sexo) ? worker.sexo : null,
            }
        }).insert();
    });
});

function getWorkersFormExcel() {
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('trabajadores.xlsx');
    var worksheet = workbook.Sheets["workers"];
    var headers = {};
    var data = [];
    for (z in worksheet) {
        if (z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0, tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if (row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    return data;
}

module.exports = router;
