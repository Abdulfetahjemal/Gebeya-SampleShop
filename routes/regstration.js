const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Joi = require('joi');
const con = require('./dbservice')[1];
const bcrypt = require('bcrypt');
const saltRounds = 10;
router.use(bodyParser.json())

// define the home page route
router.post('/', function (req, res) {
    let formdata = RegstrationUserSchema.validate({
        email: req.body["email"],
        password: req.body["password"],

    });
    if (formdata.error) {
        res.status(400).json({ message: formdata.error.details[0]["message"] })
    }
    else {

        bcrypt.hash(req.body["password"], saltRounds, function (err, hash) {
            const insertQuery = "Insert into users (email,password) values('" + req.body["email"] + "','" + hash + "')"
            con.query(insertQuery, function (err, result) {
                if (err) res.status(400).json({ message: err.message });
                res.status(200).json({ message: "Succsusful user regstration" + req.body["email"] })
            });
        });

    }

})

const RegstrationUserSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(255),

})

module.exports = router

