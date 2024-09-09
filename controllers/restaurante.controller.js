// controllers/restaurante.controller.js
const db = require('../models'); 
const path = require('path');
const fs = require('fs');

// Función para obtener la lista de restaurantes
exports.listaRestaurantes = async (req, res) => {
    db.restaurantes.findAll()
        .then(restaurantes => {
            res.render('restaurantes/list.ejs', { restaurantes: restaurantes });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error al traer restaurantes');
        });
};

exports.crearRestaurante = function (req, res){ //te trae el formulario de registro
    res.render('restaurantes/form.ejs', { restaurante: null });
}

exports.insertRestaurante = function (req, res){ //insertar en la base de datos el registro nuevo
    db.restaurantes.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion
    }).then((restaurante) => {
        if (req.files && req.files.imagen) {
            const imagen = req.files.imagen;
            const newFilename = `${restaurante.id}.jpg`;
            const uploadPath = path.join(__dirname, '../public/images/restaurantes', newFilename);
            
            imagen.mv(uploadPath, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error al mover la imagen');
                }
                // Enviar la respuesta después de mover la imagen
                res.redirect('/restaurantes');
            });
        }else{
            res.redirect('/restaurantes'); 
        }
    });
}

exports.editarRestaurante = async function (req, res) { //nos muestra la ventana de editar restaurante
    const id = req.params.id;
    const restaurante = await db.restaurantes.findByPk(id);
    res.render('restaurantes/form.ejs', { restaurante: restaurante});
}


exports.actualizarRestaurante = async function (req, res) { //actualizamos el registro de restaurante
    const id = req.params.id;
    const restaurante = await db.restaurantes.findByPk(id);

    restaurante.nombre = req.body.nombre;
    restaurante.descripcion = req.body.descripcion;
    console.log(restaurante);
    await restaurante.save();
    
    // AQUI SOLO ASUNTOS DE CARGADO DE IMAGEN
    if (req.files && req.files.imagen) {
        const imagen = req.files.imagen;
        const newFilename = `${id}.jpg`;
        const uploadPath = path.join(__dirname, '../public/images/restaurantes', newFilename);
        const oldImagePath = path.join(__dirname, '../public/images/restaurantes', `${id}.jpg`);

        // Eliminar imagen anterior si existe
        try {
            if (fs.existsSync(oldImagePath)) {
                await fs.promises.unlink(oldImagePath);
            }
        } catch (err) {
            console.error('Error al eliminar la imagen antigua:', err);
            return res.status(500).send('Error al eliminar la imagen antigua');
        }

        // Mover la nueva imagen
        imagen.mv(uploadPath, (err) => {
            if (err) {
                console.error('Error al mover la nueva imagen:', err);
                return res.status(500).send('Error al mover la imagen');
            }
            res.redirect('/restaurantes');// Enviar la respuesta después de mover la imagen
        });
    } else { res.redirect('/restaurantes'); //redirigir si no cargas nada
    }
}


exports.eliminarRestaurante = async function (req, res){
    try{
        const id = req.params.id
        const hamburguesas = await db.hamburguesas.findAll({ //obtenermos la lista de hamburguesas hijas
            where: { ID_restaurante: id }
        });
        for(const hamburguesa of hamburguesas){ //las matamos una por una, a sus imagenes digo..
            const hamburguesaId = hamburguesa.id;
            await db.valoraciones.destroy({
                where: { ID_hamburguesa: hamburguesaId }  //y las valoraciones también
            })

            const imagenPath = path.join(__dirname, '../public/images/hamburguesas', `${hamburguesa.id}.jpg`);
            if (fs.existsSync(imagenPath)) {
                fs.unlinkSync(imagenPath);
            }
        }
        await db.hamburguesas.destroy({ //matar hamburguesas del restaurante toditititas
            where: { ID_restaurante: id } 
        })
        const restaurante = await db.restaurantes.findByPk(id); //encontrar y matar al restaurante y su foto
        if (restaurante) {
            const restauranteImagenPath = path.join(__dirname, '../public/images/restaurantes', `${id}.jpg`);
            if (fs.existsSync(restauranteImagenPath)) {
                fs.unlinkSync(restauranteImagenPath);
            }
            await restaurante.destroy(); 
        }
        res.redirect('/restaurantes');
    }catch(error){
        console.error(error);
        res.status(500).send('Error al eliminar el restaurante');
    }
}
