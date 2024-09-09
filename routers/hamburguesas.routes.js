// routes/hamburguesa.routes.js
module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/hamburguesa.controller.js");

    router.get("/:restauranteId", controller.listaHamburguesas);
    router.get("/0/create", controller.crearHamburguesa);
    router.post("/create", controller.insertHamburguesa);
    router.get("/:id/edit", controller.editarHamburguesa);
    router.post("/:id/edit", controller.actualizarHamburguesa);
    router.post("/:restauranteId/:id/delete", controller.eliminarHamburguesa);

    app.use('/hamburguesas', router);
};
