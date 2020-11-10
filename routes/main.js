const express = require('express');
const router = express.Router();
const userRegstration = require('./regstration');
const product = require('./product')


router.use('/user/regstration', userRegstration)
router.use('/product', product)




router.get('/', (req, res) => {
    res.send('Working ROuter')
})


module.exports = router;