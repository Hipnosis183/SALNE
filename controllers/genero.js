var { body, validationResult } = require("express-validator");
var async = require('async');

var GeneroModel = require('../models/genero');
var LibroModel = require('../models/libro');

module.exports.index = function (req, res, next) {
    GeneroModel.find({}, function (err, generosLista) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/generos', title: ' - Géneros', generos: generosLista });
    });
}

module.exports.nuevoGeneroGet = function (req, res, next) {
    res.render('layout', { content: 'catalogo/generos/nuevoGenero', title: ' - Nuevo Género' });
}

module.exports.nuevoGeneroPost = [
    body('nombre', '').trim().isLength({ min: 1, max: 20 }).escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Genero = new GeneroModel({
            nombre: req.body.nombre
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'catalogo/generos/nuevoGenero', title: ' - Nuevo Género', genero: Genero, errors: errors.array() });
            return;
        }
        GeneroModel.findOne({ 'nombre': req.body.nombre }, function (err, genero) {
            if (err) { return next(err); }
            if (genero) { res.redirect(genero.url);
            } else {
                Genero.save(function (err) {
                    if (err) return handleError(err);
                    res.redirect('/catalogo/generos');
                });
            }
        });
    }
];

module.exports.editarGeneroGet = function (req, res, next) {
    GeneroModel.findById(req.params.id, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/generos/editarGenero', title: ' - Editar Género', genero: results });
    });
}

module.exports.editarGeneroPost = [
    body('nombre', '').trim().isLength({ min: 1, max: 20 }).escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Genero = new GeneroModel({
            nombre: req.body.nombre,
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'catalogo/generos/nuevoGenero', title: ' - Nuevo Género', genero: Genero, errors: errors.array() });
            return;
        }
        GeneroModel.findOne({ 'nombre': req.body.nombre }, function (err, genero) {
            if (err) { return next(err); }
            if (genero) { res.redirect(genero.url);
            } else {
                GeneroModel.findByIdAndUpdate(req.params.id, Genero, {}, function (err) {
                    if (err) return handleError(err);
                    res.redirect('/catalogo/generos/' + req.params.id);
                });
            }
        });
    }
];

module.exports.verGenero = function (req, res, next) {
    async.parallel({
        genero: function (callback) {
            GeneroModel.findById(req.params.id, callback);
        },
        libros: function (callback) {
            LibroModel.find({ genero: req.params.id }, callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/generos/verGenero', title: ' - ' + results.genero.nombre, genero: results.genero, libros: results.libros });
    });
}

module.exports.borrarGenero = function (req, res, next) {
    async.parallel({
        genero: function (callback) {
            GeneroModel.findById(req.params.id, callback); },
        libros: function (callback) {
            LibroModel.find({ genero: req.params.id }, callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.libros.length > 0) {
            res.render('layout', { content: 'catalogo/generos/borrarGenero', title: ' - Borrar Género', genero: results.genero, libros: results.libros });
            return;
        }
        GeneroModel.findByIdAndRemove(req.params.id, function (err) {
            if (err) return handleError(err);
            res.redirect('/catalogo/generos/');
        });
    });
}