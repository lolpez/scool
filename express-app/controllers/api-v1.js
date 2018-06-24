var express = require('express');
var router = express.Router();

/* Api V1. */
router.post('/status', function(req, res, next) {
    res.send({message: "Scool server running."});
});

module.exports = router;
