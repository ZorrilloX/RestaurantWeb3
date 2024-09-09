//declaramos el modelo de las columnas de la tabla HAMBURGUESA para mas sabor...
module.exports = (sequelize, Sequelize) => {
    const Hamburguesa = sequelize.define("hamburguesa",{
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        precio: {
            type: Sequelize.INTEGER
        },
        ID_restaurante:{ //FK de restaurante
            type: Sequelize.INTEGER,
            references: {
                model: "restaurantes",
                key: "id"
            }
        }
    });
    return Hamburguesa;
}