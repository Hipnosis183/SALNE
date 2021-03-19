var { body, validationResult } = require("express-validator");
var async = require('async');

var AutorModel = require('../models/autor');
var LibroModel = require('../models/libro');

module.exports.index = function (req, res, next) {
    AutorModel.find({}, function (err, autoresLista) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/autores', title: ' - Autores', autores: autoresLista });
    });
}

module.exports.nuevoAutorGet = function (req, res, next) {
    res.render('layout', { content: 'catalogo/autores/nuevoAutor', title: ' - Nuevo Autor' });
}

module.exports.nuevoAutorPost = [
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Autor = new AutorModel({
            nombre: req.body.nombre
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'catalogo/autores/nuevoAutor', title: ' - Nuevo Autor', autor: Autor, errors: errors.array() });
            return;
        }
        AutorModel.findOne({ 'nombre': req.body.nombre }, function (err, autor) {
            if (err) { return next(err); }
            if (autor) { res.redirect(autor.url);
            } else {
                Autor.save(function (err) {
                    if (err) return handleError(err);
                    res.redirect('/catalogo/autores');
                });
            }
        });
    }
];

module.exports.editarAutorGet = function (req, res, next) {
    AutorModel.findById(req.params.id, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/autores/editarAutor', title: ' - Editar Autor', autor: results });
    });
}

module.exports.editarAutorPost = [
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Autor = new AutorModel({
            nombre: req.body.nombre,
            _id: req.params.id
        });
        if (!errors.isEmpty()) {
            res.render('layout', { content: 'catalogo/autores/nuevoAutor', title: ' - Nuevo Autor', autor: Autor, errors: errors.array() });
            return;
        }
        AutorModel.findOne({ 'nombre': req.body.nombre }, function (err, autor) {
            if (err) { return next(err); }
            if (autor) { res.redirect(autor.url);
            } else {
                console.log(req.params.id);
                AutorModel.findByIdAndUpdate(req.params.id, Autor, {}, function (err) {
                    if (err) return handleError(err);
                    res.redirect('/catalogo/autores/' + req.params.id);
                });
            }
        });
    }
]

module.exports.verAutor = function (req, res, next) {
    async.parallel({
        autor: function (callback) {
            AutorModel.findById(req.params.id, callback); },
        libros: function (callback) {
            LibroModel.find({ autor: req.params.id }, callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/autores/verAutor', title: ' - ' + results.autor.nombre, autor: results.autor, libros: results.libros });
    });
}

module.exports.borrarAutor = function (req, res, next) {
    async.parallel({
        autor: function (callback) {
            AutorModel.findById(req.params.id, callback); },
        libros: function (callback) {
            LibroModel.find({ autor: req.params.id }, callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.libros.length > 0) {
            res.render('layout', { content: 'catalogo/autores/borrarAutor', title: ' - Borrar Autor', autor: results.autor, libros: results.libros });
            return;
        }
        AutorModel.findByIdAndRemove(req.params.id, function (err) {
            if (err) return handleError(err);
            res.redirect('/catalogo/autores/');
        });
    });
}