const db = require("./connect"),
	tableName = "template";
	
if (!db.has(tableName).value()) db.set(tableName, []).write()

/** 
 * Table Template
 * 
 * @param {object} data Information about the template
 * @param {string} data.id template`s ID (optional)
 * @param {date} data.generatedDate Date when the template was generated (optional)
 * @param {string} data.title Title of the template
 * @param {string} data.subtitle Subtitle of the template
 * @param {date} data.lastUpdate Last update datetime (optional)
 * @param {bool} data.enabled Register is Enabled (optional)
 * @param {object} data.row Row information
 * @param {string} data.row.identification Worker's unique country ID
 * @param {string} data.row.identificationExt Worker's unique city extension ID
 * @param {string} data.row.afp Country nationality of the worker
 * @param {string} data.row.afpAccount Worker's firt name
 * @param {string} data.row.paternamLastName Worker's second name
 * @param {string} data.row.maternalLastName Worker's father paternal last name
 * @param {string} data.row.marriedLastName Worker's husband paternal last name only if the worker is woman and married
 * @param {string} data.row.firstName Worker's first name
 * @param {string} data.row.nationality Country nationality of the worker
 * @param {date} data.row.birthday Date when the worker was born
 * @param {date} data.row.sex Date when the worker was born
 * @param {date} data.row.charge Date when the worker was born
 * @param {string} data.row.startDate Date when the worker started working (optional)
 * @param {string} data.row.salary Worker's husband paternal last name only if the worker is women and married
 * @param {string} data.person.sex If the worker is man or women
 *
**/

var Model = function(data){
	/*Worker Data*/
	this.id = (data.id) ? data.id : db.objID();	
	this.startDate = (data.startDate) ? data.startDate : new Date();
	this.salary = data.salary;
	this.charge = data.charge;
	this.type = data.type;
	this.afp = data.afp;
	this.afpAccount= data.afpAccount;
	this.lastUpdate = (data.lastUpdate) ? data.lastUpdate : new Date();
	this.enabled = (data.enabled) ? data.enabled : true;
	/*Person Data*/
	this.person = {};
	this.person.identification = data.person.identification;
	this.person.identificationExt = data.person.identificationExt;
	this.person.nationality = data.person.nationality;
	this.person.firstName = data.person.firstName;
	this.person.secondName = data.person.secondName;
	this.person.paternalLastName = data.person.paternalLastName;
	this.person.maternalLastName = data.person.maternalLastName;
	this.person.marriedLastName = data.person.marriedLastName;
	this.person.birthday = data.person.birthday;
	this.person.sex = data.person.sex;
}

Model.prototype.findByID = function (id) {
	return db.find({id: id}).value();
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

module.exports = Model;