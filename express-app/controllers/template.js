var express = require('express');
var path = require("path");
var router = express.Router();
var modelWorker = require('../models/worker');
var Excel = require('exceljs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var date = new Date();
    var filename = `Planilla de sueldo ${("0" + (date.getUTCDate())).slice(-2)}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${date.getUTCFullYear()}.xlsx`;
    var downloadPath = path.join(__dirname, "..", "..", "download");
    var data = [];
    /*modelWorker.selectAll().then((workers) => {
        var n = 1;        
        workers.forEach(worker => {
            var workerBirthday = null;
            var workerStartDate = null;
            if (worker.person.birthday){
                workerBirthday = new Date(worker.person.birthday);
                workerBirthday = `${("0" + (workerBirthday.getUTCDate())).slice(-2)}/${("0" + (workerBirthday.getUTCMonth() + 1)).slice(-2)}/${workerBirthday.getUTCFullYear()}`
            }
            if (worker.startDate){
                workerStartDate = new Date(worker.startDate);
                workerStartDate = `${("0" + (workerStartDate.getUTCDate())).slice(-2)}/${("0" + (workerStartDate.getUTCMonth() + 1)).slice(-2)}/${workerStartDate.getUTCFullYear()}`
            }
            data.push({
                "Nº": n,
                "CARNET DE IDENTIDAD": worker.person.identification,
                "EXT.": worker.person.identificationExt,
                "AFP.": worker.afp,
                "NUA/CUA": worker.afpAccount,
                "PRIMER APELLIDO": worker.person.paternalLastName,
                "SEGUNDO APELLIDO": worker.person.maternalLastName,
                "APELLIDO DE CASADA": worker.person.marriedLastName,
                "NOMBRE 1": worker.person.firstName,
                "NOMBRE 2": worker.person.secondName,
                "NAC.": worker.person.nationality,
                "FECHA NACIMIENTO": workerBirthday,
                "SEXO": worker.person.sex,
                "CARGO": worker.charge,
                "FECHA DE INGRESO": workerStartDate,
                "HABER BASICO": worker.salary
            });
            n++;
        });
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Planilla sueldos");
        XLSX.writeFile(wb, `${downloadPath}/${filename}`);*/

        var workbook = new Excel.Workbook();
        workbook.creator = 'Me';
        workbook.lastModifiedBy = 'Her';
        workbook.created = new Date(1985, 8, 30);
        workbook.modified = new Date();
        workbook.lastPrinted = new Date(2016, 9, 27);
        var worksheet = workbook.addWorksheet('My Sheet');
        worksheet.columns = [
            { header: 'Id', key: 'id', width: 10 },
            { header: 'Name', key: 'name', width: 100, style: { font: { name: 'Arial Black' } }  },
            { header: 'D.O.B.', key: 'dob', width: 50, style: { numFmt: 'dd/mm/yyyy' } }
        ];
        
        worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
        var row = worksheet.lastRow;
        row.height = 42.5;
        row.outlineLevel  = 1;
        worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});
        
        workbook.xlsx.writeFile(`${downloadPath}/${filename}`).then(function() {
            res.download(`${downloadPath}/${filename}`);
        });
        
    /*}).catch((err) => {
        res.send(err);
    });*/
});

module.exports = router;
