var jwt = require('jsonwebtoken');

async function isAuthorized(req, res, next) {
    idToken = req.header('authorization');
    if (idToken !== undefined) {
        jwt.verify(idToken, 'ForDemoOnlllny', function (err, decoded) {
            if (decoded == undefined) {
                res.status(200).json({ message: "Wrong token" })
            } else {
                req.id = decoded.uid
                next()
            }
        });
    } else res.status(400).json({ message: 'Auth token required' });
};


module.exports = isAuthorized