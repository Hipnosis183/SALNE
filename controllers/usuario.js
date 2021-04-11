var { body, validationResult } = require("express-validator");
var async = require('async');

var UsuarioModel = require('../models/usuario');

module.exports.nuevoUsuarioGet = function (req, res, next) {
    if (!req.session.usuarioId) {
        res.render('layout', { content: 'usuarios/nuevoUsuario', title: ' - Registro' });
    } else {
        res.redirect('/catalogo');
    }
}

module.exports.nuevoUsuarioPost = [
    body('usuario', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('password', '').trim().isLength({ min: 1, max: 100 }).escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Usuario = new UsuarioModel({
            usuario: req.body.usuario,
            password: req.body.password
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'usuarios/nuevoUsuario', title: ' - Registro', errors: errors.array() });
            return;
        }
        UsuarioModel.findOne({ 'usuario': req.body.usuario }, function (err, usuario) {
            if (err) { return next(err); }
            if (usuario) {
                res.render('layout', { content: 'usuarios/nuevoUsuario', title: ' - Registro', errors: errors.array() });
                return;
            } else {
                Usuario.save(function (err) {
                    if (err) return handleError(err);
                    res.redirect('/');
                });
            }
        });
    }
];