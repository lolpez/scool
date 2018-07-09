var dataStore = require("nedb"),
	path = require("path");

var db = new dataStore({
	filename: path.join(__dirname, "..", "database" , "column.db"),
	autoload: true
});

var tableName = "Column";

/** 
 * Table Column
 * @param {string} name The name of the column for the discount excel template
 **/

var Model = function(name, lastUpdate=new Date(), enabled=true){
	var fields = {
		name: name,
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
}

module.exports = Model;