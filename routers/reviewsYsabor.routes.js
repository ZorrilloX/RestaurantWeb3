// .routes.js
module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/reviewsYsabor.controller.js");

    router.get("/", controller.catalogoRestaurante);
    router.get("/:id/", controller.catalogoHamburgesas);
    router.get('/:idRestaurante/:idHamburguesa', controller.detalleHamburguesa);
    router.post('/:idRestaurante/:idHamburguesa', controller.guardarValoracion);

    app.use('/reviewsYsabor', router);
};
