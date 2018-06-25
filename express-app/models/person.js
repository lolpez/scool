var dataStore = require("nedb"),
	path = require("path");

var dataPerson = new dataStore({
	filename: path.join(__dirname, "..", "database" , "person.db"),
	autoload: true
});

/** 
 * Table Person
 * @param {string} name The name of the person 
 * @param {string} paternalLastName The last name of the person's father 
 * @param {string} maternalLastName The last name of the person's mother 
 **/

var Person = function(name, paternalLastName, maternalLastName, lastUpdate=new Date(), enabled=true){
	var fields = {
		name: name,
		paternalLastName: paternalLastName,
		maternalLastName: maternalLastName,
		lastUpdate: lastUpdate,
		enabled: enabled
	};
	this.insert = function() {
		return new Promise((resolve, reject) => {
			dataPerson.insert(fields, function(err, doc){
				(err) ? reject(`Error inserting new Person: ${err}`) : resolve(doc);
			});
		});	
	}
	this.selectAll = function(){
		return new Promise((resolve, reject) => {
			dataPerson.find({}, (err, docs) => {
				(err) ? reject(`Error selecting all Person: ${err}`) : resolve(docs);
			});
			//In case you need sorting
			/*dataPerson.find({}).sort({ name: 1 }).exec((err, docs) => {
				(err) ? reject(`Error selecting all Person: ${err}`) : resolve(docs);
			});*/ 
		});
	}
	this.findById = function(id){
		return new Promise((resolve, reject) => {
			dataPerson.findOne({_id: id}, (err, doc) => {
				(err) ? reject(`Error finding person by ID: ${err}`) : resolve(doc); 
			});
		});
	}
	this.update = function(){
		console.log(this.name);
		/*return new Promise((resolve, reject) => {
			dataPerson.findOne({_id: id}, (err, docs) => {
				db.update({ planet: 'Jupiter' }, { planet: 'Pluton'}, {}, function (err, numReplaced) { // numReplaced = 1 // The doc #3 has been replaced by { _id: 'id3', planet: 'Pluton' } // Note that the _id is kept unchanged, and the document has been replaced // (the 'system' and inhabited fields are not here anymore) });

				(err) ? reject(`Error finding person by ID: ${err}`) : resolve(docs);
			});
		});*/
	}
}

module.exports = Person;