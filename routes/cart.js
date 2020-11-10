const express = require('express');
const router = express.Router();
const con = require('./dbservice')[1];
const isauthorized = require('./auth');
const bodyParser = require('body-parser');



router.use(bodyParser.json())





router.post('/', isauthorized, (req, res) => {
    console.log(req.body)
    if (Array.isArray(req.body["products"])) {
        // Add to DB 
        let productList = req.body["products"];
        productList.forEach((value, index) => {
            let quantityQuery = "SELECT quantity as Quantity FROM cart where product_id=" + value + " and user_id=" + req.id
            let maincartQuery = ""
            // + "')"
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
                        res.status(400).json({ message: "products added" })
                })

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

        res.status(400).json(result)
    })
})

router.get('/:cartId', isauthorized, (req, res) => {
    let cartId = req.params.cartId
    
    let cartQuery = "SELECT * FROM cart INNER JOIN product ON cart.product_id = product.id where cart_id=" + cartId
    con.query(cartQuery, function (err, result) {
        if (err) res.status(400).json({ message: "failed to get cart" })

        res.status(400).json(result)
    })
})



router.delete('/:cartId', isauthorized, (req, res) => {
    let cartId = req.params.cartId
    let cartQuery = "delete from cart where  cart_id=" + cartId
    con.query(cartQuery, function (err, result) {
        if (err) res.status(400).json({ message: "failed to delete cart" + cartQuery })

        res.status(400).json({ message: "Cart item deleted sucsusfully" })
    })
})
module.exports = router;