var express = require('express');
var path = require("path");
var router = express.Router();
var modelTemplate = require('../models/template');
var modelWorker = require('../models/worker');
var Excel = require('exceljs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var date = new Date();
    modelWorker.selectByType("docente").then((teachers) => {
        modelWorker.selectByType("soporte").then((supports) => {       
            modelWorker.selectByType("administrativo").then((admins) => {
                res.render('template/index',
                    {
                        url: "/template",
                        title: "Planilla",
                        date: date,
                        teachers: teachers,
                        supports: supports,
                        admins: admins
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

router.post('/', function(req, res, next) {
    var data = req.body;
    var date = new Date(data.date);
    var filename = `SUELDOS ${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${date.getUTCFullYear()}.xlsx`;
    new modelTemplate({
        month: date.getUTCMonth() + 1,
        year: date.getFullYear(),
        filename: filename,
        creator: require("os").userInfo().username,
        discountSupport: data.discountSupport,
        discountAdminTeacher: data.discountAdminTeacher,
        finalTemplate: data.finalTemplate
    }).insert();

/*
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
    });*/
});


module.exports = router;
