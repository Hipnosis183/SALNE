var { body, validationResult } = require("express-validator");
var async = require('async');
var fs = require('fs');

var GeneroModel = require('../models/genero');
var LibroModel = require('../models/libro');

// Buscar y devolver la información de uno o varios géneros.
module.exports.apiGeneroGet = function (req, res, next) {
    if (req.query.id) {
        async.parallel({
            // Buscar el género y sus libros.
            genero: function (callback) {
                GeneroModel.findById(req.query.id, callback); },
            libros: function (callback) {
                LibroModel.find({ genero: req.query.id }, callback); },
        }, function (err, generoInfo) {
            if (err) { return handleError(err); }
            res.json(generoInfo);
        });
    } else {
        GeneroModel.find(function (err, generosLista) {
            if (err) { return handleError(err); }
            res.json(generosLista);
        });
    }
}

// Crear un género nuevo en la base de datos.
module.exports.apiGeneroNuevo = [
    // Funciones de validación.
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(500); return; }
        // Crear modelo con la información recibida.
        var Genero = new GeneroModel({
            nombre: req.body.nombre,
            imagen: 'no-image.png'
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/generos/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Genero._id + '.' + imagenExt;
            Genero.imagen = imagenFile;
        }
        // Guardar el modelo en la base de datos.
        Genero.save(function (err) {
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

// Editar el género especificado por el cliente en la base de datos.
module.exports.apiGeneroEditar = [
    // Funciones de validación.
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(202); return; }
        // Crear modelo con la información recibida.
        var Genero = new GeneroModel({
            _id: req.body.id,
            __v: req.body.version,
            nombre: req.body.nombre,
            imagen: req.body.imagen
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/generos/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Genero._id + '.' + imagenExt;
            Genero.imagen = imagenFile;
        }
        // Actualizar el modelo en la base de datos.
        GeneroModel.findByIdAndUpdate(req.body.id, Genero, {}, function (err) {
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

// Eliminar el género especificado por el cliente de la base de datos.
module.exports.apiGeneroBorrar = function (req, res, next) {
    // Buscar el género y sus libros.
    async.parallel({
        genero: function (callback) {
            GeneroModel.findById(req.body.id, callback); },
        libros: function (callback) {
            LibroModel.find({ genero: req.body.id }, callback); },
    }, function (err, results) {
        if (err) { return handleError(err); }
        // Enviar error si el autor tiene libros a su nombre.
        if (results.libros.length > 0) { res.sendStatus(202); return; }
        // Eliminar el elemento de la base de datos.
        GeneroModel.findByIdAndRemove(req.body.id, function (err, generoInfo) {
            if (err) { return handleError(err); }
            var imagenPath = process.cwd() + '/public/images/generos/';
            if (generoInfo.imagen != 'no-image.png') {
                // Eliminar el archivo de imagen actual en el servidor.
                if (fs.existsSync(imagenPath + generoInfo.imagen)) {
                    fs.unlink(imagenPath + generoInfo.imagen, function (err) {
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