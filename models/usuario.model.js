//declaramos el modelo de las columnas de la tabla USUARIO para la base de datos
module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario",{
        nombre: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });
    return Usuario;
}