const db = require('../models');
const path = require('path');
const fs = require('fs');

// Función para obtener la lista de hamburguesas
// Función para obtener la lista de hamburguesas de un restaurante específico
exports.listaHamburguesas = async (req, res) => {
    try {
        const restauranteId = req.params.restauranteId;
        const restaurante = await db.restaurantes.findByPk(restauranteId);
        console.log(restaurante)
        const hamburguesas = await db.hamburguesas.findAll({
            where: { ID_restaurante: restauranteId }
        });
        res.render('hamburguesas/list.ejs', { hamburguesas: hamburguesas, restaurante: restaurante});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al traer hamburguesas');
    }
};

exports.crearHamburguesa = async (req, res) => { //CARGAR EL FORMULARIO DE CREACION DEL PLATO TIPICO DE EEUU
    const restaurantes = await db.restaurantes.findAll();
    res.render('hamburguesas/form.ejs', {hamburguesa : null, restaurantes});
};
exports.insertHamburguesa = async (req, res) => {
    try {
        const hamburguesa = await db.hamburguesas.create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            ID_restaurante: req.body.ID_restaurante
        });
        //#####seccion de imagen
        if (req.files && req.files.imagen) { //cargarle la imagen
            const imagen = req.files.imagen;
            const newFilename = `${hamburguesa.id}.jpg`;
            const uploadPath = path.join(__dirname, '../public/images/hamburguesas', newFilename);

            imagen.mv(uploadPath, (err) => {
                if (err) {
                    console.error('Error al mover la imagen:', err);
                    return res.status(500).send('Error al mover la imagen');
                }
                res.redirect(`/hamburguesas/${req.body.ID_restaurante}`);
            });
        } else {res.redirect(`/hamburguesas/${req.body.ID_restaurante}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al insertar la hamburguesa');
    }
};

exports.editarHamburguesa = async function (req,res){
    const id = req.params.id;
    const hamburguesa = await db.hamburguesas.findByPk(id);
    const restaurantes = await db.restaurantes.findAll();
    res.render('hamburguesas/form.ejs', {hamburguesa: hamburguesa, restaurantes});
}

exports.actualizarHamburguesa = async (req, res) => {
    try {
        const id = req.params.id;
        const hamburguesa = await db.hamburguesas.findByPk(id);

        hamburguesa.nombre = req.body.nombre;
        hamburguesa.descripcion = req.body.descripcion;
        hamburguesa.precio = req.body.precio;
        await hamburguesa.save();

        if (req.files && req.files.imagen) {
            const imagen = req.files.imagen;
            const newFilename = `${id}.jpg`;
            const uploadPath = path.join(__dirname, '../public/images/hamburguesas', newFilename);
            const oldImagePath = path.join(__dirname, '../public/images/hamburguesas', `${id}.jpg`);

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
                res.redirect(`/hamburguesas/${hamburguesa.ID_restaurante}`);
            });
        } else {
            res.redirect(`/hamburguesas/${hamburguesa.ID_restaurante}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar la hamburguesa');
    }
};


exports.eliminarHamburguesa = async (req, res) => {
    try {
        const hamburguesaId = req.params.id;
        const restauranteId = req.params.restauranteId;

        //eliminar la imagen de la burger
        const imagenPath = path.join(__dirname, '../public/images/hamburguesas', `${hamburguesaId}.jpg`);
        if (fs.existsSync(imagenPath)) {
            fs.unlinkSync(imagenPath);
        }

        await db.valoraciones.destroy({ //eliminamos los registros de la tabla de valoraciones
            where: { ID_hamburguesa: hamburguesaId }
        });

        await db.hamburguesas.destroy({ // te la sabes la de matar?
            where: { id: hamburguesaId }
        });

        res.redirect(`/hamburguesas/${restauranteId}`); // Redirigir a la lista de hamburguesas del restaurante
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar la hamburguesa');
    }
};

//exports.actualizarHamburguesa = (req, res) => { /* Implementar en el futuro */ };
//exports.eliminarHamburguesa = (req, res) => { /* Implementar en el futuro */ };
