var express = require('express')
var router = express.Router()
const isauthorized = require('./auth');

// define the home page route
router.get('/', isauthorized, function (req, res) {
    res.status(200).json({ message: "Product added Succsusfuly " })
})




module.exports = router