const express = require("express"),
	path = require("path"),
	//favicon = require('serve-favicon'),
	logger = require("morgan"),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	dataStore = require("nedb"),
	db = new dataStore({
		filename: path.join(__dirname, "database.db"),
		autoload: true
	})
	app = express();

//Database Setup
var doc = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };
db.insert(doc, function (err, newDoc) { 
	console.log(newDoc)
});

//Controllers
var indexController = require('./controllers/index');
var userController = require('./controllers/user');

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexController);
app.use('/user', userController);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (app.get("env") === "development") {
	app.use(function (err, req, res) {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err
		});
	});
}

//production error handler
//no stacktraces leaked to user
app.use(function (err, req, res) {
	res.status(err.status || 500);
	res.render("error", {
		message: err.message,
		error: {}
	});
});

module.exports = app;
