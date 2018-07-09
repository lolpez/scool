var dataStore = require("nedb"),
	path = require("path");

var db = new dataStore({
	filename: path.join(__dirname, "..", "database" , "detailTemplateColumn.db"),
	autoload: true
});

var tableName = "Template";

/** 
 * Table Template
 * @param {string} name The name of the discount template. I.E. "Personal descuentos 2015"
 * @param {string} idTemplate ID of the template
 * @param {string} idColumn ID of the column
 **/

var Model = function(idTemplate, idColumn, lastUpdate=new Date(), enabled=true){
	var fields = {
		idTemplate: idTemplate,
		idColumn: idColumn,
		lastUpdate: lastUpdate,
		enabled: enabled
	};
	this.insert = function() {
		return new Promise((resolve, reject) => {
			db.insert(fields, function(err, doc){
				(err) ? reject(`Error inserting new record in table "${tableName}": ${err}`) : resolve(doc);
			});
		});
	}
	this.selectAll = function(){
		return new Promise((resolve, reject) => {
			db.find({}, (err, docs) => {
				(err) ? reject(`Error selecting all records in table "${tableName}": ${err}`) : resolve(docs);
			});
			//In case you need sorting
			/*dataPerson.find({}).sort({ name: 1 }).exec((err, docs) => {
				(err) ? reject(`Error selecting and sorting all record in table "${tableName}": ${err}`) : resolve(docs);
			});*/ 
		});
	}
	this.findById = function(id){
		return new Promise((resolve, reject) => {
			db.findOne({_id: id}, (err, doc) => {
				(err) ? reject(`Error finding record by ID in table "${tableName}": ${err}`) : resolve(doc); 
			});
		});
	}
	this.findByMonthAndYear = function(month, year){
		return new Promise((resolve, reject) => {
			db.findOne({month: month, year: year}, (err, doc) => {
				(err) ? reject(`Error finding record by month and year in table "${tableName}": ${err}`) : resolve(doc); 
			});
		});
	}
}

module.exports = Model;