const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const con = require('./dbservice')[1];
const Joi = require('joi');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json())
router.post('/', (req, res) => {

    let formdata = RegstrationUserSchema.validate({
        email: req.body["email"],
        password: req.body["password"],

    });
    if (formdata.error) {
        res.status(400).json({ message: formdata.error.details[0]["message"] })
    }
    else {

        con.query("Select uid, password from Users where email = '" + req.body["email"] + "'", function (err, result) {
            bcrypt.compare(req.body["password"], result[0].password, function (err, result2) {
                if (result2)
                    res.send(jwt.sign({ uid: result[0].uid, email: req.body["email"] }, 'ForDemoOnlllny'))
                else
                    res.send('Login failed')
            });
        })

    }
})


const RegstrationUserSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(255),

})
module.exports = router;