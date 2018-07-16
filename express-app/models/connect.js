const low = require('lowdb'),
	FileSync = require('lowdb/adapters/FileSync'),
	path = require("path"),
	adapter = new FileSync(path.join(__dirname, "..", "database" , `db.json`)),
	db = low(adapter);

db.objID = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + "xxxxxxxxxxxxxxxx".replace(/[x]/g, function(){
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}

module.exports = db;