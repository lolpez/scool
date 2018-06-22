var express = require('express');
var router = express.Router();
var modelUser = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	var user = { hello: 'world'
               , n: 5
               , today: new Date()
               , nedbIsAwesome: true
               , notthere: null
               , notToBeSaved: undefined  // Will not be saved
               , fruits: [ 'apple', 'orange', 'pear' ]
               , infos: { name: 'nedb' }
               };
    modelUser.insert(user);
    modelUser.find({}, function (err, users) {
        res.render('index',
            {
                title: 'Home',
                users: users
            }
        );
    });
});

module.exports = router;
