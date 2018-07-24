const db = require("./connect"),
	tableName = "worker";
	
if (!db.has(tableName).value()) db.set(tableName, []).write()

/** 
 * Table Worker
 * 
 * @param {object} data Information about the worker
 * @param {string} data.id Worker`s ID (optional)
 * @param {string} data.startDate Date when the worker started working (optional)
 * @param {string} data.salary Ammount of money the worker can make when a month
 * @param {string} data.charge Worker`s charge
 * @param {string} data.type If worker is support, administrative or teacher
 * @param {string} data.afp AFP
 * @param {string} data.afpAccount AFP
 * @param {date} data.lastUpdate Last update datetime (optional)
 * @param {bool} data.enabled Register is Enabled (optional)
 * @param {object} data.person Information about the worker's personal data
 * @param {string} data.person.identification Worker's unique country ID
 * @param {string} data.person.identificationExt Worker's unique city extension ID
 * @param {string} data.person.nationality Country nationality of the worker
 * @param {string} data.person.firstName Worker's firt name
 * @param {string} data.person.secondName Worker's second name
 * @param {string} data.person.paternamLastName Worker's father paternal last name
 * @param {string} data.person.maternalLastName Worker's mother paternal lastname
 * @param {string} data.person.marriedLastName Worker's husband paternal last name only if the worker is woman and married
 * @param {date} data.person.birthday Date when the worker was born
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