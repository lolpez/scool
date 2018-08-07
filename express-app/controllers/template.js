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
        { header: 'Nº', key: 'n', width: 3},
        { header: 'Apellidos y Nombres', key: 'name', width: 25},
        { header: 'Adelantos', key: 'advances', width: 12},
        { header: 'Pension escolar', key: 'schoolPension', width: 12},
        { header: 'Libreria', key: 'papers', width: 12},
        { header: 'Canastones', key: 'baskets', width: 12},
        { header: 'Cumpleaños del dìa del padre', key: 'fathersDay', width: 12},
        { header: 'Descuentos Uniforme', key: 'uniform', width: 12},
        { header: 'Total Descuentos', key: 'total', width: 12}
    ];
    var row = worksheet.lastRow;
    row.eachCell(function(cell, colNumber) {
        cell.style = { font: { name: 'Arial Black', size: 8, bold: true, color: { argb: 'F25500' }  } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
        var row = worksheet.lastRow;
        row.height = 15;
        row.eachCell(function(cell, colNumber) {
            cell.style.font = { size: 9 }
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });   
    });

    //Sheet for admins and teachers
    var worksheet = workbook.addWorksheet(`Desc. docentes y admin.`);
    worksheet.columns = [
        { header: 'Nº', key: 'n', width: 3},
        { header: 'Apellidos y Nombres', key: 'name', width: 25},
        { header: 'Pension escolar', key: 'schoolPension', width: 12},
        { header: 'Adelantos', key: 'advances', width: 12},
        { header: 'Libreria y uniformes', key: 'papers', width: 12},
        { header: 'Canaston', key: 'baskets', width: 12},
        { header: 'Día del padre', key: 'fathersDay', width: 12},
        { header: 'Cumpleaños pasanaku', key: 'pasanaku', width: 12},
        { header: 'Uniforme', key: 'uniform', width: 12},
        { header: 'Total Descuentos', key: 'total', width: 12}
    ];
    var row = worksheet.lastRow;
    row.eachCell(function(cell, colNumber) {
        cell.style = { font: { name: 'Arial Black', size: 8, bold: true, color: { argb: 'F25500' }  } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
        var row = worksheet.lastRow;
        row.height = 15;
        row.eachCell(function(cell, colNumber) {
            cell.style.font = { size: 9 }
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });    
    });

    //Sheet final template 
    var worksheet = workbook.addWorksheet(`Planilla de sueldos`);
    worksheet.columns = [
        { header: 'Nº', key: 'n', width: 3},
        { header: 'Carnet de identidad', key: 'identification', width: 7},
        { header: 'Ext.', key: 'identificationExt', width: 3},
        { header: 'Primer apellido', key: 'firstLastName', width: 5},
        { header: 'Segundo apellido', key: 'secondLastName', width: 5},
        { header: 'Apellido de casado', key: 'secondLastName', width: 5},
        { header: 'Nombre 1', key: 'firstName', width: 5},
        { header: 'Nombre 2', key: 'secondName', width: 5},
        { header: 'Nac.', key: 'nationality', width: 5},
        { header: 'Fecha nacimiento', key: 'birthday', width: 5, style: { numFmt: 'dd/mm/yyyy' }},
        { header: 'Sexo', key: 'sex', width: 3},
        { header: 'Cargo', key: 'charge', width: 5},
        { header: 'Fecha de ingreso', key: 'startDate', width: 5, style: { numFmt: 'dd/mm/yyyy' }},
        { header: 'Haber basico anterior', key: 'salary', width: 12},
        { header: 'Incremento 2018', key: 'afpIncrement', width: 12},
        { header: 'Otros bonos', key: 'otherBonus', width: 12},
        { header: 'Total ganado', key: 'totalGain', width: 12},
        { header: 'Descuendo AFP 12.71%', key: 'afpDiscount', width: 12},
        { header: 'Otros descuentos', key: 'otherDiscounts', width: 12},
        { header: 'Liquido pagable', key: 'liquidPayable', width: 12},
        { header: 'Firmas', key: 'signature', width: 20},
        { header: 'Nº', key: 'n2', width: 3}
    ];
    var row = worksheet.lastRow;
    row.eachCell(function(cell, colNumber) {
        cell.style = { font: { name: 'Arial Black', size: 8, bold: true, color: { argb: 'F25500' }  } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
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
        row.eachCell(function(cell, colNumber) {
            cell.style.font = { size: 9 }
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });         
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
