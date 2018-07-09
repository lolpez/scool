var tableName = "worker";
var db = require('../models/connection').get(tableName);
var objID =  require('../models/connection').objID;

/** 
 * Table Worker
 * @param {_id} id ID auto generated
 * @param {string} name The name of the worker
 * @param {array} pays Collection of the worker´s pay
 **/

var Model = function(name, _id=objID(), pays=null, lastUpdate=new Date(), enabled=true){
	this._id = _id;
	this.name = name;	
	this.lastUpdate = lastUpdate;
	this.enabled = enabled;
	//Support keys
	var fields = this;
	this.pays = pays;

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
}

module.exports = Model;