var { body, validationResult } = require("express-validator");

var UsuarioModel = require('../models/usuario');

module.exports.index = function (req, res, next) {
    UsuarioModel.find({}, function (err, usuariosLista) {
        if (err) { return next(err); }
        res.render('layout', { content: 'administrar/usuarios', title: ' - Usuarios', usuarios: usuariosLista });
    });
}

module.exports.nuevoUsuarioGet = function (req, res, next) {
    if (!req.session.id_usuario || res.locals.UsuarioActual.admin) {
        res.render('layout', { content: 'administrar/usuarios/nuevoUsuario', title: ' - Registro' });
    } else {
        res.redirect('/catalogo');
    }
}

module.exports.nuevoUsuarioPost = [
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('password', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email', '').trim().isLength({ min: 1, max: 100 }).isEmail().escape(),
    body('admin', '').trim().isIn(['on', '']).escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Usuario = new UsuarioModel({
            nombre: req.body.nombre,
            password: req.body.password,
            email: req.body.email,
            admin: false
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'administrar/usuarios/nuevoUsuario', title: ' - Registro', errors: errors.array() });
            return;
        }
        if (req.body.admin === 'on') Usuario.admin = true;
        UsuarioModel.findOne({ 'nombre': req.body.nombre }, function (err, usuario) {
            if (err) { return next(err); }
            if (usuario) {
                res.render('layout', { content: 'administrar/usuarios/nuevoUsuario', title: ' - Registro', errors: errors.array() });
                return;
            } else {
                Usuario.save(function (err) {
                    if (err) return handleError(err);
                    res.redirect('/catalogo');
                });
            }
        });
    }
];

module.exports.editarUsuarioGet = function (req, res, next) {
    UsuarioModel.findById(req.params.id, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'administrar/usuarios/editarUsuario', title: ' - Editar Cuenta', usuario: results });
    });
}

module.exports.editarUsuarioPost = [
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('password', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email', '').trim().isLength({ min: 1, max: 100 }).isEmail().escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Usuario = new UsuarioModel({
            nombre: req.body.nombre,
            password: req.body.password,
            email: req.body.email,
            admin: false,
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'administrar/usuarios/editarUsuario', title: ' - Editar Cuenta', errors: errors.array() });
            return;
        }
        UsuarioModel.findOne({ 'nombre': req.body.nombre }, function (err, usuario) {
            if (err) { return next(err); }
            if (usuario) {
                res.render('layout', { content: 'administrar/usuarios/editarUsuario', title: ' - Editar Cuenta', errors: errors.array() });
                return;
            } else {
                UsuarioModel.findById(req.params.id, function (err, usuario) {
                    if (err) { return next(err); }
                    Usuario.admin = usuario.admin;
                    UsuarioModel.findByIdAndUpdate(req.params.id, Usuario, {}, function (err) {
                        if (err) return handleError(err);
                        res.redirect('/usuarios/' + req.params.id);
                    });
                });
            }
        });
    }
];

module.exports.verUsuario = function (req, res, next) {
    UsuarioModel.findById(req.params.id)
        .populate({
            path: 'libros',
            populate: {
                path: 'autor',
                model: 'autor'
            }
        }).populate({
            path: 'libros',
            populate: {
                path: 'genero',
                model: 'genero'
            }})
        .exec(function (err, usuarioInfo) {
            if (err) { return next(err); }
            res.render('layout', { content: 'administrar/usuarios/verUsuario', title: ' - ' + usuarioInfo.nombre, usuario: usuarioInfo });
        });
}

module.exports.borrarUsuarioGet = function (req, res, next) {
    res.render('layout', { content: 'administrar/usuarios/borrarUsuario', title: ' - Eliminar Cuenta' });
}

module.exports.borrarUsuarioPost = function (req, res, next) {
    UsuarioModel.findByIdAndRemove(req.params.id, function (err) {
        if (err) return handleError(err);
        if (!res.locals.UsuarioActual.admin) {
            req.session.destroy();
            res.clearCookie('carrito');
        }
        res.redirect('/catalogo');
    });
}