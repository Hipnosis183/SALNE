var UsuarioModel = require('../models/usuario');

module.exports.iniciarSesionGet = function (req, res, next) {
    if (!req.session.id_usuario) {
        res.render('layout', { content: 'iniciarSesion', title: ' - Iniciar Sesión' });
    } else {
        res.redirect('/catalogo');
    }
}

module.exports.iniciarSesionPost = function (req, res, next) {
    UsuarioModel.findOne({ 'nombre': req.body.nombre, 'password': req.body.password }, function (err, usuario) {
        if (err) { return next(err); }
        if (usuario) {
            req.session.id_usuario = usuario._id;
            res.redirect('/catalogo');
            return;
        } else {
            res.render('layout', { content: 'iniciarSesion', title: ' - Iniciar Sesión', invalid: 1 });
            return;
        }
    });
};

module.exports.cerrarSesion = function (req, res, next) {
    req.session.destroy();
    res.clearCookie('carrito');
    res.redirect('/catalogo');
}

module.exports.reqAutorizacion = function (req, res, next) {
    if (res.locals.UsuarioActual.admin) { next(); }
    else {
        res.redirect('/iniciarSesion');
        return;
    }
};

module.exports.estaAutorizado = function (req, res, next) {
    return res.locals.UsuarioActual.admin ? true : false;
};