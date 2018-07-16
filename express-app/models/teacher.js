const db = require("./connect"),
	tableName = "teacher";
	
if (!db.has(tableName).value()) db.set(tableName, []).write()

 /** 
 * Table Teacher
 * 
 * @param {object} data Information about the template
 * @param {string} data.id Register ID (optional)
 * @param {name} data.name  Name
 * @param {date} data.lastUpdate Last update datetime
 * @param {bool} data.enabled Register is Enabled (optional)
 **/

var Model = function(data){
	this.id = (data.id) ? data.id : db.objID();
	this.name = data.name;
	this.lastUpdate = (data.lastUpdate) ? data.lastUpdate : new Date();
	this.enabled = (data.enabled) ? data.enabled : true;
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
	return db.get(tableName).filter({ enabled: true }).value();
}

module.exports = Model;