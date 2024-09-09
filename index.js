const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const fileUpload = require('express-fileupload');// para subir archivos
//const path = require('path'); //complemento de lo de arriba
const session = require('express-session'); // Import express-session module//+


app.set('view engine', 'ejs'); // configuro el motor de plantillas ejs
app.use(fileUpload());
app.use(express.static('public'));

const db = require("./models");
db.sequelize.sync({
    // force: true // drop database and recreate
}).then(() => {
    console.log("database resync")
});


app.use(session({
    secret: 'esta es la clave de encriptacion de la sesion y eso eso',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // En producción, deberías poner `true` y usar HTTPS
}));


app.set('views', __dirname + '/views');
require('./routers')(app);
const port = 3000;
app.listen(port, () => {
    console.log(`Exito! escuchando el puerto ${port}...`);
});
