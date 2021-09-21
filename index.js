const express     = require('express');
const app         = express();
const fileUpload = require('express-fileupload');

const playerRoutes = require(`./router/playerRoutes`)
const uploadRoutes = require('./router/uploadRoutes');

app.use(fileUpload({ useTempFiles: true }));


app.use('/', playerRoutes)
app.use('/upload', uploadRoutes)

// front end
app.use(express.static('public'))

app.use(express.json());

app.listen(3005, function() {
    console.log("[NodeJS] Application Listening on Port 3005");
});