var tableName = "template";
var db = require('../models/connection').get(tableName);
var objID =  require('../models/connection').objID;

 /** 
 * Table Template
 * 
 * @param {object} data Information about the template
 * @param {string} data.id Register ID (optional)
 * @param {string} data.name Name of the discount template. I.E. "Personal descuentos 2015"
 * @param {int} data.month Name of the column for the discount excel template
 * @param {int} data.year Year of the generated template
 * @param {string} data.idTemplateType Type of the the generated template. I.E. "Trabajadores, Soporte y Servicio"
 * @param {date} data.lastUpdate Last update datetime
 * @param {bool} data.enabled Register is Enabled (optional)
 **/

var Model = function(data){
	if (data._id) this._id = data._id;	//Auto generated
	this.id = (data.id) ? data.id : objID();
	this.name = data.name;
	this.month = data.month;
	this.year = data.year;
	this.idTemplateType = data.idTemplateType;
	this.lastUpdate = (data.lastUpdate) ? data.lastUpdate : new Date();
	this.enabled = (data.enabled) ? data.enabled : true;
}

Model.prototype.insert = function(){
	var obj = this;
	var fields = {};
	Object.keys(this).forEach(function (k) {
		if (typeof k !== "function") fields[k] = obj[k];
	});
	return new Promise((resolve, reject) => {
		db.insert(fields, function(err, doc){
			(err) ? reject(`Error inserting new record in table "${tableName}": ${err}`) : resolve(new Model(doc));
		});
	});
};

Model.prototype.update = function(){
	var obj = this;	
	db.update({_id: obj._id}, {$set: {enabled: false}}, {multi: true}), function (err, numReplaced) {
		if (numReplaced > 1){
			delete obj._id;
			obj.lastUpdate = new Date();
			return new Promise((resolve, reject) => {
				obj.insert().then((doc) => {
					resolve(doc);
				}).catch((err) => {
					reject(err)
				});
			});
		}
	};	
};

Model.selectAll = function(){
	return new Promise((resolve, reject) => {
		db.find({}, (err, docs) => {
			docs.forEach(function(doc, i){
				docs[i] = new Model(doc);
			});
			(err) ? reject(`Error selecting all records in table "${tableName}": ${err}`) : resolve(docs);
		});
		//In case you need sorting
		/*dataPerson.find({}).sort({ name: 1 }).exec((err, docs) => {
			(err) ? reject(`Error selecting and sorting all record in table "${tableName}": ${err}`) : resolve(docs);
		}); 
		*/
	});
}

Model.findById = function(id){
	return new Promise((resolve, reject) => {
		db.findOne({_id: id}, (err, doc) => {
			(err) ? reject(`Error finding record by ID in table "${tableName}": ${err}`) : resolve(new Model(doc));
		});
	});
}

module.exports = Model;