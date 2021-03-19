var { body, validationResult } = require("express-validator");
var async = require('async');

var AutorModel = require('../models/autor');
var GeneroModel = require('../models/genero');
var LibroModel = require('../models/libro');

module.exports.index = function (req, res, next) {
    LibroModel.find()
        .populate('autor')
        .populate('genero')
        .exec(function (err, librosLista) {
            if (err) { return next(err); }
            res.render('layout', { content: 'catalogo/libros', title: ' - Libros', libros: librosLista });
        });
}

module.exports.nuevoLibroGet = function (req, res, next) {
    async.parallel({
        autores: function (callback) {
            AutorModel.find(callback); },
        generos: function (callback) {
            GeneroModel.find(callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/libros/nuevoLibro', title: ' - Nuevo Libro', autores: results.autores, generos: results.generos });
    });
}

module.exports.nuevoLibroPost = [
    body('titulo', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('descrip', '').trim().isLength({ min: 1, max: 300 }).escape(),
    body('autor', '').trim().isLength({ min: 1 }).escape(),
    body('edicion', '').trim().isLength({ min: 1, max: 20 }).escape(),
    body('año', '').trim().isLength({ min: 4, max: 4 }).isNumeric().escape(),
    body('genero', '').trim().isLength({ min: 1 }).escape(),
    body('isbn', '').trim().isLength({ min: 10, max: 13 }).isNumeric().escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Libro = new LibroModel({
            titulo: req.body.titulo,
            descrip: req.body.descrip,
            autor: req.body.autor,
            edicion: req.body.edicion,
            año: req.body.año,
            genero: req.body.genero,
            isbn: req.body.isbn
        });
        if (!errors.isEmpty()) {
            async.parallel({
                autores: function (callback) {
                    AutorModel.find(callback); },
                generos: function (callback) {
                    GeneroModel.find(callback); },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('layout', { content: 'catalogo/libros/nuevoLibro', title: ' - Nuevo Libro', autores: results.autores, generos: results.generos, errors: errors.array() });
            });
            return;
        }
        Libro.save(function (err) {
            if (err) return handleError(err);
            res.redirect('/catalogo/libros');
        });
    }
];

module.exports.editarLibroGet = function (req, res, next) {
    async.parallel({
        autores: function (callback) {
            AutorModel.find(callback); },
        generos: function (callback) {
            GeneroModel.find(callback); },
        libro: function (callback) {
            LibroModel.findById(req.params.id, callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('layout', { content: 'catalogo/libros/editarLibro', title: ' - Editar Libro', autores: results.autores, generos: results.generos, libro: results.libro });
    });
}

module.exports.editarLibroPost = [
    body('titulo', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('descrip', '').trim().isLength({ min: 1, max: 300 }).escape(),
    body('autor', '').trim().isLength({ min: 1 }).escape(),
    body('edicion', '').trim().isLength({ min: 1, max: 20 }).escape(),
    body('año', '').trim().isLength({ min: 4, max: 4 }).isNumeric().escape(),
    body('genero', '').trim().isLength({ min: 1 }).escape(),
    body('isbn', '').trim().isLength({ min: 10, max: 13 }).isNumeric().escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Libro = new LibroModel({
            _id: req.params.id,
            titulo: req.body.titulo,
            descrip: req.body.descrip,
            autor: req.body.autor,
            edicion: req.body.edicion,
            año: req.body.año,
            genero: req.body.genero,
            isbn: req.body.isbn
        });
        if (!errors.isEmpty()) {
            async.parallel({
                autores: function (callback) {
                    AutorModel.find(callback); },
                generos: function (callback) {
                    GeneroModel.find(callback); },
                libro: function (callback) {
                    LibroModel.findById(req.params.id, callback); },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('layout', { content: 'catalogo/libros/editarLibro', title: ' - Editar Libro', autores: results.autores, generos: results.generos, libro: results.libro, errors: errors.array() });
            });
            return;
        }
        LibroModel.findByIdAndUpdate(req.params.id, Libro, {}, function (err) {
            if (err) return handleError(err);
            res.redirect('/catalogo/libros/' + req.params.id);
        });
    }
];

module.exports.verLibro = function (req, res, next) {
    LibroModel.findById(req.params.id)
        .populate('autor')
        .populate('genero')
        .exec(function (err, libroInfo) {
            if (err) { return next(err); }
            res.render('layout', { content: 'catalogo/libros/verLibro', title: ' - ' + libroInfo.titulo, libro: libroInfo });
        });
}

module.exports.borrarLibro = function (req, res, next) {
    LibroModel.findByIdAndRemove(req.params.id, function (err) {
        if (err) return handleError(err);
        res.redirect('/catalogo/libros/');
    });
}