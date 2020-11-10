const express = require('express');
const app = express();
const port = 5000;
const main = require('./routes/main')
app.get('/', (req, res) => {
    res.send('Swagger JS DOC');
})

app.use('/main', main)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})