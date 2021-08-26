const express     = require('express');
const app         = express();

const router = require(`./router`)

app.use('/', router)

app.listen(3005, function() {
    console.log("[NodeJS] Application Listening on Port 3005");
});