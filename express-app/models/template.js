const db = require("./connect"),
	tableName = "template";
	
if (!db.has(tableName).value()) db.set(tableName, []).write()

/** 
 * Table Template
 * 
 * @param {object} data Information about the template
 * @param {string} data.id Templates`s ID (optional)
 * @param {int} data.month Month of the generated template 
 * @param {int} data.year Year of the generated template
 * @param {string} data.filename Filename of the stored template
 * @param {string} data.creator User who generated the template
 * @param {date} data.created Datetime of the creation of the template (optional)
 * @param {date} data.lastUpdate Last update datetime (optional)
 * @param {bool} data.enabled Register is Enabled (optional)
 * @param {object} data.discountSupport Discount template of Support workers
 * @param {object} data.discountAdminTeacher Discount template of Teachers and Administrator workers
 * @param {object} data.finalTemplate Summary of the full template
 *
**/

var Model = function(data){
	/*Template Data*/
	this.id = (data.id) ? data.id : db.objID();	
	this.month = (data.month) ? data.month : 1;
	this.year = (data.year) ? data.year : 2018;
	this.filename = data.filename;
	this.creator = data.creator;
	this.created = data.created;
	this.lastUpdate = (data.lastUpdate) ? data.lastUpdate : new Date();
	this.enabled = (data.enabled) ? data.enabled : true;
	/*Discount Support Data*/
	this.discountSupport = data.discountSupport;
	/*Discount Admin-Teacher Data*/
	this.discountAdminTeacher = data.discountAdminTeacher;
	/*Full Summary Data*/
	this.finalTemplate = data.finalTemplate;
}

Model.findByID = function (id) {
	return new Promise((resolve, reject) => {
		resolve(db.get(tableName).find({id: id}).value())
	});
}

Model.prototype.insert = function(){
    var obj = this;
	var fields = {};
	Object.keys(this).forEach(function (k) {
		if (typeof k !== "function") fields[k] = obj[k];
	});
	db.get(tableName).push(fields).write();
	return obj;
};

Model.prototype.update = function(){
	var obj = this;	
	db.get(tableName).find({ id: obj.id }).assign(obj).write();
};

Model.prototype.delete = function(){
	var obj = this;	
	db.get(tableName).remove({ id: obj.id }).write();
};

Model.deleteById = function(id){
	db.get(tableName).remove({ id: id }).write();
};

Model.selectAll = function () {
	return new Promise((resolve, reject) => {
		resolve(db.get(tableName).filter({ enabled: true }).value())
	});
}

Model.selectByType = function (type) {
	return new Promise((resolve, reject) => {
		resolve(db.get(tableName).filter({ type: type, enabled: true }).value())
	});
}

Model.getCountByType = function (type) {
	return new Promise((resolve, reject) => {
		resolve(db.get(tableName).filter({ type: type, enabled: true }).size().value())
	});
}

module.exports = Model;