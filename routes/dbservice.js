const mysql = require('mysql');



const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'gebeya'
});

function dbServiceConnect() {
    con.connect(function (err) {
        if (err) {
            console.log({ "error": "Connecting to DB" + err.message + "Code" + err.code })
            throw err;
        }
    })
}

module.exports = [dbServiceConnect, con];