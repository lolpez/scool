var dataStore = require("nedb"),
	path = require("path");

var modelUser = new dataStore({
	filename: path.join(__dirname, "..", "database" , "user.db"),
	autoload: true
});

module.exports = modelUser;