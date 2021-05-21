var { body, validationResult } = require("express-validator");
var async = require('async');
var fs = require('fs');

var AutorModel = require('../models/autor');
var LibroModel = require('../models/libro');

// Buscar y devolver la información de uno o varios autores.
module.exports.apiAutorGet = function (req, res, next) {
    if (req.query.id) {
        // Buscar el autor y sus libros.
        async.parallel({
            autor: function (callback) {
                AutorModel.findById(req.query.id, callback); },
            libros: function (callback) {
                LibroModel.find({ autor: req.query.id }, callback); },
        }, function (err, autorInfo) {
            if (err) { return handleError(err); }
            res.json(autorInfo);
        });
    } else {
        AutorModel.find(function (err, autoresLista) {
            if (err) { return handleError(err); }
            res.json(autoresLista);
        });
    }
}

// Crear un autor nuevo en la base de datos.
module.exports.apiAutorNuevo = [
    // Funciones de validación.
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(500); return; }
        // Crear modelo con la información recibida.
        var Autor = new AutorModel({
            nombre: req.body.nombre,
            imagen: 'no-image.png'
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/autores/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Autor._id + '.' + imagenExt;
            Autor.imagen = imagenFile;
        }
        // Guardar el modelo en la base de datos.
        Autor.save(function (err) {
            if (err) { return handleError(err); }
            if (req.files) {
                // Guardar el archivo de imagen en el servidor.
                if (!fs.existsSync(imagenPath)) { fs.mkdirSync(imagenPath); }
                req.files.imagen.mv(imagenPath + imagenFile, function (err) {
                    if (err) { return handleError(err); }
                });
            } res.sendStatus(200);
        });
    }
];

// Editar el autor especificado por el cliente en la base de datos.
module.exports.apiAutorEditar = [
    // Funciones de validación.
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(202); return; }
        // Crear modelo con la información recibida.
        var Autor = new AutorModel({
            _id: req.body.id,
            __v: req.body.version,
            nombre: req.body.nombre,
            imagen: req.body.imagen
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/autores/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Autor._id + '.' + imagenExt;
            Autor.imagen = imagenFile;
        }
        // Actualizar el modelo en la base de datos.
        AutorModel.findByIdAndUpdate(req.body.id, Autor, {}, function (err) {
            if (err) { return handleError(err); }
            if (req.files) {
                if (req.body.imagen != 'no-image.png') {
                    // Eliminar el archivo de imagen actual en el servidor.
                    if (fs.existsSync(imagenPath + req.body.imagen)) {
                        fs.unlink(imagenPath + req.body.imagen, function (err) {
                            if (err) { return handleError(err); }
                        });
                    }
                }
                // Guardar el archivo de imagen nuevo en el servidor.
                if (!fs.existsSync(imagenPath)) { fs.mkdirSync(imagenPath); }
                req.files.imagen.mv(imagenPath + imagenFile, function (err) {
                    if (err) { return handleError(err); }
                });
            } res.sendStatus(200);
        });
    }
];

// Eliminar el autor especificado por el cliente de la base de datos.
module.exports.apiAutorBorrar = function (req, res, next) {
    // Buscar el autor y sus libros.
    async.parallel({
        autor: function (callback) {
            AutorModel.findById(req.body.id, callback); },
        libros: function (callback) {
            LibroModel.find({ autor: req.body.id }, callback); },
    }, function (err, results) {
        if (err) { return handleError(err); }
        // Enviar error si el autor tiene libros a su nombre.
        if (results.libros.length > 0) { res.sendStatus(202); return; }
        // Eliminar el elemento de la base de datos.
        AutorModel.findByIdAndRemove(req.body.id, function (err, autorInfo) {
            if (err) { return handleError(err); }
            var imagenPath = process.cwd() + '/public/images/autores/';
            if (autorInfo.imagen != 'no-image.png') {
                // Eliminar el archivo de imagen actual en el servidor.
                if (fs.existsSync(imagenPath + autorInfo.imagen)) {
                    fs.unlink(imagenPath + autorInfo.imagen, function (err) {
                        if (err) { return handleError(err); }
                    });
                }
            } res.sendStatus(200);
        });
    });
}

// Imprimir errores en la consola del servidor.
function handleError(err) {
    console.log(err);
}