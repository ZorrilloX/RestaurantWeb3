const db = require('../models'); 

exports.catalogoRestaurante = async function(req,res){
    const usuario = req.session.usuario;
    const restaurantes = await db.restaurantes.findAll();
    res.render('dashboard.ejs', {restaurantes: restaurantes, usuario})
}

exports.catalogoHamburgesas = async function(req,res){
    const usuario = req.session.usuario;
    const id = req.params.id
    const restaurante = await db.restaurantes.findByPk(id);
    //recoger las hamburguesas de restaurastes:
    const hamburguesas = await db.hamburguesas.findAll({
        where: {ID_restaurante: id}
    });
    // Calcular el promedio de puntaje para cada hamburguesa
    const hamburguesasConPuntaje = await Promise.all(hamburguesas.map(async (hamburguesa) => {
        const promedioPuntaje = await calcularPromedioPuntaje(hamburguesa.id);
        return {
            ...hamburguesa.toJSON(),
            promedioPuntaje: parseFloat(promedioPuntaje) // Asegúrate de que sea un número
        };
    }));
    res.render('main/catalogoHamburguesas.ejs', {
        restaurante: restaurante,
        hamburguesas: hamburguesasConPuntaje,
        usuario
    });
}

exports.detalleHamburguesa = async function(req, res) {
    const { idHamburguesa } = req.params;
    const hamburguesa = await db.hamburguesas.findByPk(idHamburguesa);

    // Obtener las valoraciones/opiniones de esa hamburguesa
    const valoraciones = await db.valoraciones.findAll({
        where: { ID_hamburguesa: idHamburguesa },
        include: { model: db.usuarios } // Incluir el modelo de usuario para ver el nombre del usuario que realizó la valoración
    });

    const promedioPuntaje = await calcularPromedioPuntaje(idHamburguesa);

    res.render('main/detalleHamburguesa.ejs', {
        hamburguesa: {...hamburguesa.toJSON(), promedioPuntaje},
        valoraciones,
        usuario: req.session.usuario // Usar la sesión para mantener al usuario actual
    });
};


// Enviar una nueva valoración
exports.guardarValoracion = async function(req, res) {
    try {
        const { idRestaurante, idHamburguesa } = req.params;
        const { puntaje, review } = req.body;

        // Verificar que el usuario está autenticado
        if (!req.session.usuario || !req.session.usuario.id) {
            return res.redirect('/usuarios/login');
        }

        // Guardar la nueva valoración en la base de datos
        await db.valoraciones.create({
            ID_hamburguesa: idHamburguesa,
            ID_usuario: req.session.usuario.id, // Asumiendo que el ID del usuario está en la sesión
            puntaje,
            review
        });

        // Redirigir al usuario a la página de detalles de la hamburguesa
        res.redirect(`/reviewsYsabor/${idRestaurante}/${idHamburguesa}`);
    } catch (error) {
        console.error("Error al guardar la valoración:", error);
        res.status(500).send("Error al guardar la valoración.");
    }
};




const calcularPromedioPuntaje = async (hamburguesaId) => {
    const valoraciones = await db.valoraciones.findAll({
        where: { ID_Hamburguesa: hamburguesaId } // Obtener todas las valoraciones para la hamburguesa
    });
    if (valoraciones.length > 0) {
        const totalPuntaje = valoraciones.reduce((sum, valoracion) => sum + valoracion.puntaje, 0);
        return (totalPuntaje / valoraciones.length).toFixed(1); // Redondear a 1 decimal
    }
    return 0;
};

