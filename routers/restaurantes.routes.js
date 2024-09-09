// restaurante.routes.js
module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/restaurante.controller.js");

    router.get("/", controller.listaRestaurantes);
    router.get("/create", controller.crearRestaurante);
    router.post("/create", controller.insertRestaurante);
    router.get("/:id/edit", controller.editarRestaurante); //mostrar el formulario de edición
    router.post("/:id/edit", controller.actualizarRestaurante); //actualizar el restaurante
    router.post("/:id/delete", controller.eliminarRestaurante);

    app.use('/restaurantes', router);
};
