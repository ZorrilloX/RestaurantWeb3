const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//declaracion de las entidades--------------------//
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.restaurantes = require("./restaurante.model.js")(sequelize, Sequelize);
db.hamburguesas = require("./hamburguesa.model.js")(sequelize, Sequelize);
db.valoraciones = require("./valoracion.model.js")(sequelize, Sequelize);



//declaraciones de relacion de tablas como 1 to N / N to N: -------------
db.restaurantes.hasMany(db.hamburguesas, {foreignKey: 'ID_restaurante'});
db.hamburguesas.belongsTo(db.restaurantes, {foreignKey: 'ID_restaurante'});

db.hamburguesas.hasMany(db.valoraciones, { foreignKey: 'ID_hamburguesa' });
db.valoraciones.belongsTo(db.hamburguesas, { foreignKey: 'ID_hamburguesa' });

db.usuarios.hasMany(db.valoraciones, { foreignKey: 'ID_usuario' });
db.valoraciones.belongsTo(db.usuarios, { foreignKey: 'ID_usuario' });

//DECLARACION FINAL ----------------------------------------------------------------
module.exports = db;