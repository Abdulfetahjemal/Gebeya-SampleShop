const express = require('express');
const app = express();
const port = 5000;
const main = require('./routes/main')
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


app.use('/main', main)
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})