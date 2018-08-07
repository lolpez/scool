var express = require('express');
var router = express.Router();
var modelWorker = require('../models/worker');
var Excel = require('exceljs');
var path = require("path");
var downloadPath = path.join(__dirname, "..", "..", "download");

/* GET home page. */
router.get('/', function(req, res, next) {
    lmao();
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

function lmao() {
    var workbook = new Excel.Workbook();
    var filename = `XD.xlsx`;
    var worksheet = workbook.addWorksheet(`lmao`);

    //Columns width
    var col = worksheet.getColumn('A');
    col.width = 20;
    col = worksheet.getColumn('B');
    col.width = 20;
    col = worksheet.getColumn('C');
    col.width = 1;
    col = worksheet.getColumn('D');
    col.width = 20;
    col = worksheet.getColumn('E');
    col.width = 20;
    col = worksheet.getColumn('F');
    col.width = 1;
    col = worksheet.getColumn('G');
    col.width = 20;
    col = worksheet.getColumn('H');
    col.width = 20;
    
    //Merge cells
    worksheet.mergeCells('A1:B1');
    worksheet.mergeCells('A4:B4');
    worksheet.mergeCells('A5:H5');
    worksheet.mergeCells('A12:B13');
    worksheet.mergeCells('A14:B14');
    worksheet.mergeCells('D1:E1');
    worksheet.mergeCells('D3:E3');
    worksheet.mergeCells('D4:E4');
    worksheet.mergeCells('G1:H4');    

    
    //Header cell styles
    var cell = worksheet.getCell('A1'); 
    cell.value ="UNIDAD EDUCATIVA RIO NUEVO SRL";
    cell.font = {size: 11, bold: true};
    cell.alignment = {horizontal: "center"};

    cell = worksheet.getCell('D1'); 
    cell.value = "BOLETA DE PAGO";
    cell.font = {size: 14, bold: true};
    cell.alignment = {horizontal: "center"};

    cell = worksheet.getCell('A6'); 
    cell.value = "EMPLEADO";
    cell.font = {size: 11, bold: true};
    cell.alignment = {horizontal: "left"};

    cell = worksheet.getCell('D6'); 
    cell.value = "INGRESOS";
    cell.font = {size: 11, bold: true};
    cell.alignment = {horizontal: "left"};

    cell = worksheet.getCell('G6'); 
    cell.value = "DESCUENTOS";
    cell.font = {size: 11, bold: true};
    cell.alignment = {horizontal: "left"};

    cell = worksheet.getCell('A9'); 
    cell.value = "Nroº";
    cell.font = {bold: true};
    cell.alignment = {horizontal: "left"};

    cell = worksheet.getCell('A10'); 
    cell.value = "TOTAL GANADO";
    cell.font = {bold: true};
    cell.alignment = {horizontal: "left"};

    cell = worksheet.getCell('A11'); 
    cell.value = "TOTAL PAGABLE";
    cell.font = {bold: true};
    cell.alignment = {horizontal: "left"};

    cell = worksheet.getCell('A14'); 
    cell.value = "RECIBI CONFORME";
    cell.font = {bold: true, italic: true};
    cell.alignment = {horizontal: "center"};

    workbook.xlsx.writeFile(`${downloadPath}/${filename}`).then(function() {
       
        
    })
}
module.exports = router;
