var UsuarioModel = require('../models/usuario');

module.exports.iniciarSesionGet = function (req, res, next) {
    if (!req.session.usuarioId) {
        res.render('layout', { content: 'iniciarSesion', title: ' - Iniciar Sesión' });
    } else {
        res.redirect('/catalogo');
    }
}

module.exports.iniciarSesionPost = function (req, res, next) {
    UsuarioModel.findOne({ 'usuario': req.body.usuario, 'password': req.body.password }, function (err, usuario) {
        if (err) { return next(err); }
        console.log(req.session);
        if (usuario) {
            req.session.usuarioId = usuario._id;
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
    res.redirect('/catalogo');
}

module.exports.reqAutorizacion = function (req, res, next) {
    if (res.locals.session.usuarioId) { next(); }
    else {
        res.redirect('/iniciarSesion');
        return;
    }
};

module.exports.estaAutorizado = function (req, res, next) {
    return res.locals.session.usuarioId ? true : false;
};