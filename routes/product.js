var express = require('express')
var router = express.Router()
const isauthorized = require('./auth');
const Joi = require('joi');
const upload = require('express-fileupload');
const bodyParser = require('body-parser');
var uuid = require('uuid');
const con = require('./dbservice')[1];


// define the home page route
router.use(upload());
router.use(bodyParser.json())



router.get('/page/:pageNum', isauthorized, function (req, res) {
    let pageNum = req.params.pageNum * 10 - 10
    let query = "Select * from product ORDER BY Price ASC LIMIT 10 OFFSET " + pageNum

    con.query(query, function (err, result) {
        if (err) res.status(400).json({ message: "Unable to add product" + query })
        res.status(200).json(result)

    })
})


router.get('/:productId', isauthorized, function (req, res) {
    let productid = req.params.productId
    let query = "Select * from product where id= " + productid

    con.query(query, function (err, result) {
        if (err) res.status(400).json({ message: "Unable to add product" + query })
        res.status(200).json(result)

    })
})

router.delete('/:productId', isauthorized, function (req, res) {
    let productid = req.params.productId
    let query = "Select Vendor from product where id= " + productid
    con.query(query, function (err, result) {
        if (err) res.status(400).json({ message: "Unable to Delete product" })
        if (result[0] == undefined)
            res.status(400).json({ message: "Product Not found" })
        else {
            if (result[0].Vendor == req.id) {
                let querydelete = "delete from product where id= " + productid
                con.query(querydelete, function (err, result) {
                    if (err) res.status(400).json({ message: "Unable to Delete product" })
                    res.status(200).json({ message: "Product succsusfully deleted" })
                })
            } else {
                res.status(400).json({ message: "Permission denied" })
            }
        }

    })
})




router.post('/', isauthorized, function (req, res) {
 console.log(req.body);
    let formdata = ProductSchema.validate({
        ProductName: req.body["ProductName"],
        Price: req.body["Price"],
        Description: req.body["Description"],
        DetailedDescription: req.body['DetailedDescription'],
        Image: req.files ? req.files.Image : undefined,
        FileType: req.files ? req.files.Image.mimetype : undefined,

    });

    if (formdata.error)
        res.status(400).send({ message: formdata.error.details[0]["message"] });
    else {
        var image = req.files.Image
        var type = req.files.Image.mimetype;
        var extention = type.substring(type.indexOf('/') + 1, type.length)
        var filename = uuid.v4() + '.' + extention;



        image.mv('./uploads/' + filename, function (err) {
            if (err)
                return res.status(500).send(err);
            else {

                let query = "Insert into product (Name,Price,Vendor,PhotoUrl,Description,DetailedDescription) values ";

                query = query + "('" + req.body["ProductName"]
                    + "','" + req.body["Price"]
                    + "','" + req.id
                    + "','" + filename
                    + "','" + req.body["Description"]
                    + "','" + req.body['DetailedDescription'] + "')"
                con.query(query, function (err, result) {
                    if (err) res.status(400).json({ message: "Unable to add product" })
                    console.log(result)

                    res.status(200).json({ message: "Product added Succsusfuly " })

                })

            }

        });


    }




})



const ProductSchema = Joi.object({
    ProductName: Joi.string()
        .min(3)
        .max(20)
        .required()
        .regex(/^[a-zA-Z0-9 ]*$/i, 'Please only use alphanumeric characters and space.'),

    Price: Joi.number().positive().required(),
    DetailedDescription: Joi.string()
        .min(10)
        .max(255)
        .required()
        .regex(/^[a-zA-Z0-9 ]*$/i, 'Please only use alphanumeric characters and space.'),
    Description: Joi.string()
        .min(10)
        .max(60)
        .required()
        .regex(/^[a-zA-Z0-9 ]*$/i, 'Please only use alphanumeric characters and space.'),
    Image: Joi.required(),
    FileType: Joi.string()
        .required()
        .regex(/(image\/)(jpe?g|png)$/i, 'Please only use [jpg|jpeg|png].'),

});

module.exports = router