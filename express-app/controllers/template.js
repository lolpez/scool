var express = require('express');
var path = require("path");
var router = express.Router();
var modelTemplate = require('../models/template');
var modelWorker = require('../models/worker');
var Excel = require('exceljs');
var downloadPath = path.join(__dirname, "..", "..", "download");

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
    var filename = `Sueldos ${getLteralMonth(date.getUTCMonth() + 1)} ${date.getUTCFullYear()}.xlsx`;
    var template = new modelTemplate({
        month: date.getUTCMonth() + 1,
        year: date.getFullYear(),
        filename: filename,
        creator: require("os").userInfo().username,
        discountSupport: data.discountSupport,
        discountAdminTeacher: data.discountAdminTeacher,
        finalTemplate: data.finalTemplate
    }).insert();
    var workbook = new Excel.Workbook();
    workbook.creator = template.creator;
    workbook.created = template.created;

    //Sheet for support workers
    var worksheet = workbook.addWorksheet(`Desc. soporte y auxiliar`);
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
    template.discountSupport.forEach(sup => {
        worksheet.addRow({
            n: sup.pos,
            name: sup.name,
            advances: sup.value0,
            schoolPension: sup.value1,
            papers: sup.value2,
            baskets: sup.value3,
            fathersDay: sup.value4,
            uniform: sup.value5,
            total: sup.total,
        });
    });

    //Sheet for admins and teachers
    var worksheet = workbook.addWorksheet(`Desc. docentes y admin.`);
    worksheet.columns = [
        { header: 'Nº', key: 'n', width: 5},
        { header: 'Apellidos y Nombres', key: 'name', width: 30},
        { header: 'Pension escolar', key: 'schoolPension', width: 20},
        { header: 'Adelantos', key: 'advances', width: 15},
        { header: 'Libreria y uniformes', key: 'papers', width: 15},
        { header: 'Canaston', key: 'baskets', width: 15},
        { header: 'Día del padre', key: 'fathersDay', width: 36},
        { header: 'Cumpleaños pasanaku', key: 'pasanaku', width: 15},
        { header: 'Uniforme', key: 'uniform', width: 15},
        { header: 'Total Descuentos', key: 'total', width: 25}
    ];
    var row = worksheet.lastRow;
    row.eachCell(function(cell, colNumber) {
        cell.style = { font: { name: 'Arial Black' } };
    });      
    template.discountAdminTeacher.forEach(adm => {
        worksheet.addRow({
            n: adm.pos,
            name: adm.name,
            schoolPension: adm.value0,
            advances: adm.value1,
            papers: adm.value2,
            baskets: adm.value3,
            fathersDay: adm.value4,
            pasanaku: adm.value5,
            uniform: adm.value6,
            total: adm.total,
        });
    });

    //Sheet final template 
    var worksheet = workbook.addWorksheet(`Planilla`);
    worksheet.columns = [
        { header: 'Nº', key: 'n', width: 5},
        { header: 'Carnet de identidad', key: 'identification', width: 10},
        { header: 'Ext.', key: 'identificationExt', width: 5},
        { header: 'Primer apellido', key: 'firstLastName', width: 15},
        { header: 'Segundo apellido', key: 'secondLastName', width: 15},
        { header: 'Apellido de casado', key: 'secondLastName', width: 15},
        { header: 'Nombre 1', key: 'firstName', width: 15},
        { header: 'Nombre 2', key: 'secondName', width: 15},
        { header: 'Nac.', key: 'nationality', width: 5},
        { header: 'Fecha nacimiento', key: 'birthday', width: 15},
        { header: 'Sexo', key: 'sex', width: 5},
        { header: 'Cargo', key: 'charge', width: 5},
        { header: 'Fecha de ingreso', key: 'startDate', width: 15},
        { header: 'Haber basico anterior', key: 'salary', width: 10},
        { header: 'Incremento 2018', key: 'afpIncrement', width: 10},
        { header: 'Otros bonos', key: 'otherBonus', width: 10},
        { header: 'Total ganado', key: 'totalGain', width: 10},
        { header: 'Descuendo AFP 12.71%', key: 'afpDiscount', width: 10},
        { header: 'Otros descuentos', key: 'otherDiscounts', width: 15},
        { header: 'Liquido pagable', key: 'liquidPayable', width: 15},
        { header: 'Firmas', key: 'signature', width: 20},
        { header: 'Nº', key: 'n2', width: 5}
    ];
    var row = worksheet.lastRow;
    row.eachCell(function(cell, colNumber) {
        cell.style = { font: { name: 'Arial Black' } };
    });      
    template.finalTemplate.forEach(final => {
        worksheet.addRow({
            n: final.pos,
            identification: final.identification,
            identificationExt: final.identificationExt,
            firstLastName: final.paternalLastName,
            secondLastName: final.maternalLastName,
            marriedLastName: final.marriedLastName,
            firstName: final.firstName,
            secondName: final.secondName,
            nacionality: final.nationality,
            birthday: final.birthday,
            sex: final.sex,
            charge: final.charge,
            startDate: final.startDate,
            salary: final.valueSalary,
            afpIncrement: final.valueIncrement,
            otherBonus: final.valueOtherBonus,
            totalGain: final.valueTotalGain,
            afpDiscount: final.valueAFPDiscount,
            otherDiscounts: final.valueOtherDiscount,
            liquidPayable: final.valueLiquidPayable,
            signature: "",
            n2: final.pos,
        });
        var row = worksheet.lastRow;
        row.height = 50;
    });    
    workbook.xlsx.writeFile(`${downloadPath}/${template.filename}`).then(function() {
        res.status(201);
        res.location(`${req.protocol}://${req.get("host")}${req.originalUrl}/download/${template.id}`);
        res.send({
            response: template.id,
            message: `Planilla del mes de ${getLteralMonth(template.month)} del año ${template.year} guardado correctamente.`,
            success: true
        })
    }).catch((err) => {
        res.status(500);
        res.send({
            message: `Ocurrio un error al guardar la plantilla.`,
            success: false
        })
    });   
});

router.get('/download/:id', function(req, res, next) {
    modelTemplate.findByID(req.params.id).then((template) => {
        res.download(`${downloadPath}/${template.filename}`);
    }).catch((err) => {
        res.send(err);
    });
});

function getLteralMonth(month){
    switch(month){
        case 1:
            return "Enero";
        case 2:
            return "Febrero";
        case 3:
            return "Marzo";
        case 4:
            return "Abril";
        case 5:
            return "Mayo";
        case 6:
            return "Junio";
        case 7:
            return "Julio";
        case 8:
            return "Agosto";
        case 9:
            return "Septiembre";
        case 10:
            return "Octubre";
        case 11:
            return "Noviembre";
        case 12:
            return "Diciembre";
    }
}


module.exports = router;
