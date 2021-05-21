var { body, validationResult } = require("express-validator");
var async = require('async');
var fs = require('fs');

var AutorModel = require('../models/autor');
var GeneroModel = require('../models/genero');
var LibroModel = require('../models/libro');
var UsuarioModel = require('../models/usuario');

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
    body('imagen', '').trim().escape(),
    function (req, res, next) {
        var errors = validationResult(req);
        var Libro = new LibroModel({
            titulo: req.body.titulo,
            descrip: req.body.descrip,
            autor: req.body.autor,
            edicion: req.body.edicion,
            año: req.body.año,
            genero: req.body.genero,
            isbn: req.body.isbn,
            formato: ''
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
        if (req.files) {
            var extension = req.files.imagen.name.split('.').pop();
            switch (extension) {
                case 'png': case 'jpg': {
                    Libro.formato = extension;
                }
            }
        }
        Libro.save(function (err) {
            if (err) return handleError(err);
            if (req.files) {
                switch (Libro.formato) {
                    case 'png': case 'jpg': {
                        var imagenPath = process.cwd() + '/public/images/';
                        if (!fs.existsSync(imagenPath)) fs.mkdirSync(imagenPath);
                        req.files.imagen.mv(imagenPath + Libro.imagen, function (err) {
                            if (err) return handleError(err);
                        });
                    }
                }
            }
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
    body('imagen', '').trim().escape(),
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
            isbn: req.body.isbn,
            formato: ''
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
        if (req.files) {
            var extension = req.files.imagen.name.split('.').pop();
            switch (extension) {
                case 'png': case 'jpg': {
                    Libro.formato = extension;
                }
            }
        }
        LibroModel.findByIdAndUpdate(req.params.id, Libro, {}, function (err) {
            if (err) return handleError(err);
            if (req.files) {
                switch (Libro.formato) {
                    case 'png': case 'jpg': {
                        var imagenPath = process.cwd() + '/public/images/';
                        if (!fs.existsSync(imagenPath)) fs.mkdirSync(imagenPath);
                        req.files.imagen.mv(imagenPath + Libro.imagen, function (err) {
                            if (err) return handleError(err);
                        });
                    }
                }
            }
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
            var libroAdquirido = false;
            for (libroUsuario of res.locals.UsuarioActual.libros) if (libroUsuario == req.params.id) libroAdquirido = true;
            res.render('layout', { content: 'catalogo/libros/verLibro', title: ' - ' + libroInfo.titulo, libro: libroInfo, libroAdquirido: libroAdquirido });
        });
}

module.exports.borrarLibro = function (req, res, next) {
    async.parallel({
        libro: function (callback) {
            LibroModel.findById(req.params.id, callback); },
        usuarios: function (callback) {
            UsuarioModel.find({ libros: req.params.id }, callback); },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.usuarios.length > 0) {
            res.render('layout', { content: 'catalogo/libros/borrarLibro', title: ' - Borrar Libro', libro: results.libro, usuarios: results.usuarios });
            return;
        }
        LibroModel.findByIdAndRemove(req.params.id, function (err, libroInfo) {
            if (err) return handleError(err);
            var imageFile = process.cwd() + '/public/images/' + libroInfo.imagen;
            if (fs.existsSync(imageFile)) {
                fs.unlink(imageFile, function (err) {
                    if (err) return handleError(err);
                });
            }
            res.redirect('/catalogo/libros/');
        });
    });
}