var LibroModel = require('../models/libro');
var UsuarioModel = require('../models/usuario');

module.exports.index = function (req, res, next) {
    LibroModel.find({ '_id': { $in: req.cookies.carrito } })
        .populate('autor')
        .populate('genero')
        .exec(function (err, librosLista) {
            if (err) { return next(err); }
            res.render('layout', { content: 'carrito', title: ' - Carrito', libros: librosLista });
        });
}

module.exports.anadirLibro = function (req, res, next) {
    var carritoUsuario = [];
    if (req.cookies.carrito) carritoUsuario = req.cookies.carrito;
    if (!carritoUsuario.includes(req.params.id)) {
        carritoUsuario.push(req.params.id);
        res.cookie('carrito', carritoUsuario).send();
    }
    res.redirect('/usuarios/' + res.locals.UsuarioActual._id + '/carrito');
}

module.exports.quitarLibro = function (req, res, next) {
    var carritoUsuario = [];
    if (req.cookies.carrito) carritoUsuario = req.cookies.carrito;
    if (carritoUsuario.includes(req.params.id)) {
        carritoUsuario.splice(carritoUsuario.indexOf(req.params.id), 1);
        res.cookie('carrito', carritoUsuario).send();
    }
    res.redirect('/usuarios/' + res.locals.UsuarioActual._id + '/carrito');
}

module.exports.realizarCompra = function (req, res, next) {
    var Usuario = res.locals.UsuarioActual;
    for (libroCarrito of req.cookies.carrito) {
        Usuario.libros.push(libroCarrito);
    }
    UsuarioModel.findByIdAndUpdate(res.locals.UsuarioActual._id, Usuario, {}, function (err) {
        if (err) return handleError(err);
        res.clearCookie('carrito');
        res.redirect('/catalogo');
    });
}