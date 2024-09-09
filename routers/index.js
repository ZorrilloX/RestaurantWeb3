//esta es la salida para exportar lo conjunto de modulos de esta carpeta
module.exports = app => {
    require('./usuarios.routes')(app);
    require('./restaurantes.routes')(app);
    require('./hamburguesas.routes')(app);
    require('./reviewsYsabor.routes')(app);
}