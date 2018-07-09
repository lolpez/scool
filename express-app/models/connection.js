var dataStore = require("nedb"),
	path = require("path");

var connect = {};

connect.get = function(name){
    return new dataStore({
        filename: path.join(__dirname, "..", "database" , `${name}.db`),
        autoload: true
    });
}

connect.objID = function () {
    var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + "xxxxxxxxxxxxxxxx".replace(/[x]/g, function(){
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}

module.exports = connect;