//declaramos el modelo de las columnas de la tabla RESTAURANTE para mas sabor...
module.exports = (sequelize, Sequelize) => {
    const Restaurante = sequelize.define("restaurante",{
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        }
    });
    return Restaurante;
}