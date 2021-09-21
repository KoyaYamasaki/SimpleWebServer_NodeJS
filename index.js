const express     = require('express');
const app         = express();
const fileUpload = require('express-fileupload');

const router = require(`./router/router`)
// product router
const productRouter = require('./router/productRoutes');

app.use(fileUpload({ useTempFiles: true }));


app.use('/', router)
app.use('/upload', productRouter)

// front end
app.use(express.static('public'))

app.use(express.json());

app.listen(3005, function() {
    console.log("[NodeJS] Application Listening on Port 3005");
});