const express = require('express');
const router = express.Router();
const con = require('./dbservice')[1];
const isauthorized = require('./auth');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');



router.use(bodyParser.json())

router.use(upload())



router.post('/', isauthorized, (req, res) => {
    console.log()
    products = req.body["products"].split(',');
    if (Array.isArray(products)) {
        // Add to DB 
        let productList = products;
        productList.forEach((value, index) => {
            let quantityQuery = "SELECT quantity as Quantity FROM cart where product_id=" + value + " and user_id=" + req.id
            let maincartQuery = ""
            let checkProductAvalablity = "Select Count(*) as Avalablity from product where id = " + value
            // + "')"


            con.query(checkProductAvalablity, function (err2, res2) {
                if (err2) res.status(400).json({ message: "failed to add product" })
                if (res2[0].Avalablity == 0) {
                    res.status(400).json({ message: "Product ID not avalable" })
                }
                else {
                    con.query(quantityQuery, function (err, result) {
                        if (err) res.status(400).json({ message: "failed to add product" })
                        if (result[0] == undefined) {
                            maincartQuery = "Insert into cart (product_id,user_id,quantity) values ('" + value + "','" + req.id + "','" + 1 + "')"

                        } else {

                            maincartQuery = "Update cart Set quantity = " + ++result[0].Quantity + " where product_id=" + value + " and user_id=" + req.id
                            // maincartQuery + "','" + ++result[0].Quantity + "')"
                        }

                        con.query(maincartQuery, function (err, result) {
                            if (err) res.status(400).json({ message: "failed to add product" })
                            if (index == productList.length - 1)
                                res.status(200).json({ message: "products added" })
                        })

                    })
                }

            })

        })

    } else {
        res.status(400).json({ message: "products array must be set" })
    }


})


router.get('/', isauthorized, (req, res) => {
    let cartQuery = "SELECT * FROM cart where user_id=" + req.id
    con.query(cartQuery, function (err, result) {
        if (err) res.status(400).json({ message: "failed to get cart" })

        res.status(200).json(result)
    })
})

router.get('/:cartId', isauthorized, (req, res) => {
    let cartId = req.params.cartId

    let cartQuery = "SELECT * FROM cart INNER JOIN product ON cart.product_id = product.id where cart_id=" + cartId
    con.query(cartQuery, function (err, result) {
        if (err) res.status(400).json({ message: "failed to get cart" })

        res.status(200).json(result)
    })
})



router.delete('/:cartId', isauthorized, (req, res) => {
    let cartId = req.params.cartId
    let checkQuery = "Select user_id from cart where cart_id = " + cartId;
    con.query(checkQuery, function (err, result) {
        if (result[0] == undefined) {
            res.status(400).json({ message: "Item not found" })
        } else if (result[0].user_id === req.id) {
            let cartQuery = "delete from cart where  cart_id=" + cartId
            con.query(cartQuery, function (err, result) {
                if (err) res.status(400).json({ message: "failed to delete cart" + cartQuery })

                res.status(400).json({ message: "Cart item deleted sucsusfully" })
            })

        } else {
            res.status(400).json({ message: " Permission denied " })
        }
    })



})
module.exports = router;