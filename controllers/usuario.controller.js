//usuario.controller.js
const db = require('../models');
//const { formatDate } = require('../utils/date.utils');
const sha1 = require('sha1');

exports.listaUsuarios = function(req,res){ //devuelve la lista de usuarios de la tabla usuarios
    db.usuarios.findAll().then(usuarios => {
        res.send(usuarios)
    });
}

exports.crearUsuario = function (req, res){ //te trae el formulario de registro
    res.render('usuarios/form.ejs', { usuario: null , error: null});
}

exports.insertUsuario = async function (req, res){ //insertar en la base de datos el registro nuevo
    const { nombre, correo, password} = req.body;
    if (!nombre || nombre.trim() === '' || !password || password.trim() === '') {
        return res.render('usuarios/form.ejs',{
            usuario: null,
            error: 'Los campos no pueden estar vacíos'
        });
    }
    if (password.length < 8){
        return res.render('usuarios/form.ejs',{
            usuario: null,
            error: 'La contraseña debe tener al menos 8 caracteres'
        });
    }

    const usuarioExistente = await db.usuarios.findOne({
        where: { correo: correo }
    });
    if(usuarioExistente){
        return res.render('usuarios/form.ejs',{
            usuario: null,
            error: 'Ese correo ya se encuentra registrado'
        });
    }
    //tras pasar todas las validaciones puees crear el usuario
    db.usuarios.create({ 
        nombre: req.body.nombre,
        correo: req.body.correo,
        password: sha1(req.body.password)
    }).then(() => {
        console.log(req.body.nombre)
        res.redirect('/usuarios/login'); // Asegúrate de que la ruta sea correcta
    })
}

exports.mostrarLogin = function (req, res) {
    const usuario = req.session.usuario ||  null;
    res.render('usuarios/login', { error: null, usuario }); // Sin la barra inclinada inicial
}


exports.Login = async function (req, res) { //VALIDA Y SI HAY EXITO TE MANDA A LA PAGINA PRINCIPAL
    const { correo, password } = req.body;
    
    if (password.length < 8){ // VALIDAR CONTRASEÑA
        return res.render('usuarios/login.ejs', {
            error: 'La contraseña debe tener al menos 8 caracteres',
            usuario: null
        });
    }else{
        // BUSCAR EL USUARIO EN LA BASE DE DATOS >:v
        const usuario = await db.usuarios.findOne({
            where: { correo: correo }
            });

        if (!usuario){
            return res.render('usuarios/login.ejs',{
                error: 'El correo electronico no esta registrado papasito',
                usuario: null
            });
        }
        if(sha1(password) !== usuario.password){
            return res.render('usuarios/login.ejs',{
                error: 'La contraseña es incorrecta error 666',
                usuario: null 
            });
        }
        req.session.usuario = {id: usuario.id, correo:usuario.correo, nombre:usuario.nombre}; // GUARDAR EL USUARIO EN LA SESION
        res.redirect('/reviewsYsabor'); //EXITO
        
    }
} 

exports.logout = function(req, res) {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).send('error al cerrar la sesion')
        }
        res.redirect('/usuarios/login');
    });
}

exports.mostrarReviews = async function(req, res) {
    const usuario = req.session.usuario ||  null;
    const valoraciones = await db.valoraciones.findAll();
    res.render('usuarios/reviews.ejs', { valoraciones, usuario });
}

const path = require('path');
// mandar una imagen
exports.formulaSecreta = function (req, res) {
    const imagePath = path.join(__dirname, '../public/images/formula secreta.jpg');
    res.sendFile(imagePath);
};