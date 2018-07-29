var express = require('express');
var path = require("path");
var router = express.Router();
var modelWorker = require('../models/worker');
var Excel = require('exceljs');

/* GET home page. */
router.get('/:type', function(req, res, next) {
    modelWorker.selectByType(req.params.type).then((workers) => {        
        res.render('discount/index',
            {
                title: `Personal ${req.params.type}`,
                workers: workers
            }
        );
    }).catch((err) => {
        res.send(err);
    });
});

router.post('/', function(req, res, next) {
    var date = new Date();
    var filename = `Descuentos ${("0" + (date.getUTCDate())).slice(-2)}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${date.getUTCFullYear()}.xlsx`;
    var downloadPath = path.join(__dirname, "..", "..", "download");
    var workbook = new Excel.Workbook();
    workbook.creator = 'SERN';
    workbook.created = date;
    var worksheet = workbook.addWorksheet('Descuentos');
    worksheet.columns = [
        { header: 'Nº', key: 'n', width: 5},
        { header: 'Apellidos y Nombres', key: 'name', width: 30},
        { header: 'Adelantos', key: 'advances', width: 15},
        { header: 'Pension escolar', key: 'schoolPension', width: 20},
        { header: 'Libreria', key: 'papers', width: 15},
        { header: 'Canastones', key: 'baskets', width: 15},
        { header: 'Cumpleaños del dìa del padre', key: 'fathersDay', width: 36},
        { header: 'Descuentos Uniforme', key: 'uniform', width: 15},
        { header: 'Total Descuentos', key: 'total', width: 25}
    ];
    var row = worksheet.lastRow;
    row.eachCell(function(cell, colNumber) {
        cell.style = { font: { name: 'Arial Black' } };
    });    
    modelWorker.selectAll().then((workers) => {
        var n = 1;        
        workers.forEach(worker => {
            worksheet.addRow({
                n: n,
                name: `${(worker.person.paternalLastName) ? worker.person.paternalLastName : ""} ${(worker.person.maternalLastName) ? worker.person.maternalLastName : ""} ${(worker.person.firstName) ? worker.person.firstName : ""} ${(worker.person.secondName) ? worker.person.secondName : ""}`,
                advances: 0,
                schoolPension: 0,
                papers: 0,
                baskets: 0,
                fathersDay: 0,
                uniform: 0,
                total: 0,
            });
            var row = worksheet.lastRow;
            row.getCell('total').value = row.getCell('advances').value +
                                            row.getCell('schoolPension').value +
                                            row.getCell('papers').value +
                                            row.getCell('baskets').value +
                                            row.getCell('fathersDay').value +
                                            row.getCell('uniform').value;
            n++;
        });
        workbook.xlsx.writeFile(`${downloadPath}/${filename}`).then(function() {
            res.download(`${downloadPath}/${filename}`);
        });
    }).catch((err) => {
        res.send(err);
    });
});

module.exports = router;
