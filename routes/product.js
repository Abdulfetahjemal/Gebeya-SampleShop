var express = require('express')
var router = express.Router()


// define the home page route
router.get('/', function (req, res) {
    res.status(200).json({ message: "Product added Succsusfuly " })
})




module.exports = router