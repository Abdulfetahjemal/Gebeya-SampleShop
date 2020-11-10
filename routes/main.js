const express = require('express');
const router = express.Router();
const userRegstration = require('./regstration');
const product = require('./product')
const userLogin = require('./login')

router.use('/user/login', userLogin)
router.use('/user/regstration', userRegstration)
router.use('/product', product)




router.get('/', (req, res) => {
    res.send('Working ROuter')
})


module.exports = router;