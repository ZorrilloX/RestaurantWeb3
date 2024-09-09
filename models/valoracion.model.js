// Declaramos el modelo de las columnas de la tabla VALORACION para más sabor...
module.exports = (sequelize, Sequelize) => {
    const Valoracion = sequelize.define("valoracion", {
        ID_usuario: { // FK del usuario
            type: Sequelize.INTEGER,
            references: {
                model: "usuarios", // Nombre de la tabla de usuarios
                key: "id"
            }
        },
        ID_hamburguesa: { // FK de hamburguesa
            type: Sequelize.INTEGER,
            references: {
                model: "hamburguesas", // Nombre de la tabla de hamburguesas
                key: "id"
            }
        },
        puntaje: {
            type: Sequelize.INTEGER,
            validate: {
                min: 1,
                max: 5
            }
        },
        review: {
            type: Sequelize.TEXT 
        }
    });
    return Valoracion;
};
