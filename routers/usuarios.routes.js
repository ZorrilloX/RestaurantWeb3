module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/usuario.controller.js");

    router.get("/", controller.listaUsuarios); //solo es la lista en Json de los usuarios
    router.get("/create", controller.crearUsuario);
    router.post("/create", controller.insertUsuario);

    router.get("/login", controller.mostrarLogin);
    router.post("/login", controller.Login);
    router.get('/logout', controller.logout);

    router.get("/verReviews", controller.mostrarReviews);
    router.get("/formulaSecreta", controller.formulaSecreta);

    app.use('/usuarios', router);
};