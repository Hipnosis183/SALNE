var { body, validationResult } = require("express-validator");
var async = require('async');
var fs = require('fs');

var AutorModel = require('../models/autor');
var GeneroModel = require('../models/genero');
var LibroModel = require('../models/libro');
var UsuarioModel = require('../models/usuario');

// Buscar y devolver la información de uno o varios libros.
module.exports.apiLibroGet = function (req, res, next) {
    if (req.query.id) {
        LibroModel.findById(req.query.id)
            .populate('autor')
            .populate('genero')
            .exec(function (err, libroInfo) {
                if (err) { return handleError(err); }
                res.json(libroInfo);
            });
    } else {
        LibroModel.find()
            .populate('autor')
            .populate('genero')
            .exec(function (err, librosLista) {
                if (err) { return handleError(err); }
                res.json(librosLista);
            });
    }
}

// Buscar y devolver listas con todos los autores y géneros.
module.exports.apiLibroNuevoGet = function (req, res, next) {
    async.parallel({
        autores: function (callback) {
            AutorModel.find(callback); },
        generos: function (callback) {
            GeneroModel.find(callback); },
    }, function (err, results) {
        if (err) { return handleError(err); }
        res.json(results);
    });
}

// Crear un libro nuevo en la base de datos.
module.exports.apiLibroNuevoPost = [
    // Funciones de validación.
    body('titulo', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('descrip', '').trim().isLength({ min: 1, max: 300 }).escape(),
    body('autor', '').trim().isLength({ min: 1 }).escape(),
    body('edicion', '').trim().isLength({ min: 1, max: 20 }).escape(),
    body('ano', '').trim().isLength({ min: 4, max: 4 }).isNumeric().escape(),
    body('genero', '').trim().isLength({ min: 1 }).escape(),
    body('isbn', '').trim().isLength({ min: 10, max: 13 }).isNumeric().escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(500); return; }
        // Crear modelo con la información recibida.
        var Libro = new LibroModel({
            titulo: req.body.titulo,
            descrip: req.body.descrip,
            autor: req.body.autor,
            edicion: req.body.edicion,
            ano: req.body.ano,
            genero: req.body.genero,
            isbn: req.body.isbn,
            imagen: 'no-image.png'
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/libros/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Libro._id + '.' + imagenExt;
            Libro.imagen = imagenFile;
        }
        // Guardar el modelo en la base de datos.
        Libro.save(function (err) {
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

// Buscar y devolver la información del libro especificado y listas con todos los autores y géneros.
module.exports.apiLibroEditarGet = function (req, res, next) {
    async.parallel({
        autores: function (callback) {
            AutorModel.find(callback); },
        generos: function (callback) {
            GeneroModel.find(callback); },
        libro: function (callback) {
            LibroModel.findById(req.query.id, callback); },
    }, function (err, results) {
        if (err) { return handleError(err); }
        res.json(results);
    });
}

// Editar el libro especificado por el cliente en la base de datos.
module.exports.apiLibroEditarPost = [
    // Funciones de validación.
    body('titulo', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('descrip', '').trim().isLength({ min: 1, max: 300 }).escape(),
    body('autor', '').trim().isLength({ min: 1 }).escape(),
    body('edicion', '').trim().isLength({ min: 1, max: 20 }).escape(),
    body('ano', '').trim().isLength({ min: 4, max: 4 }).isNumeric().escape(),
    body('genero', '').trim().isLength({ min: 1 }).escape(),
    body('isbn', '').trim().isLength({ min: 10, max: 13 }).isNumeric().escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(202); return; }
        // Crear modelo con la información recibida.
        var Libro = new LibroModel({
            _id: req.body.id,
            __v: req.body.version,
            titulo: req.body.titulo,
            descrip: req.body.descrip,
            autor: req.body.autor,
            edicion: req.body.edicion,
            ano: req.body.ano,
            genero: req.body.genero,
            isbn: req.body.isbn,
            imagen: req.body.imagen
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/libros/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Libro._id + '.' + imagenExt;
            Libro.imagen = imagenFile;
        }
        // Actualizar el modelo en la base de datos.
        LibroModel.findByIdAndUpdate(req.body.id, Libro, {}, function (err) {
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

// Eliminar el libro especificado por el cliente de la base de datos.
module.exports.apiLibroBorrar = function (req, res, next) {
    // Buscar el libro y los usuarios que lo adquirieron.
    async.parallel({
        libro: function (callback) {
            LibroModel.findById(req.body.id, callback); },
        usuarios: function (callback) {
            UsuarioModel.find({ libros: req.body.id }, callback); },
    }, function (err, results) {
        if (err) { return handleError(err); }
        // Enviar error si el libro pertenece a la biblioteca de algún usuario.
        if (results.usuarios.length > 0) { res.sendStatus(202); return; }
        // Eliminar el elemento de la base de datos.
        LibroModel.findByIdAndRemove(req.body.id, function (err, libroInfo) {
            if (err) { return handleError(err); }
            var imagenPath = process.cwd() + '/public/images/libros/';
            if (libroInfo.imagen != 'no-image.png') {
                // Eliminar el archivo de imagen actual en el servidor.
                if (fs.existsSync(imagenPath + libroInfo.imagen)) {
                    fs.unlink(imagenPath + libroInfo.imagen, function (err) {
                        if (err) { return handleError(err); }
                    });
                }
            } res.sendStatus(200);
        });
    });
}

// Buscar y devolver los libros en el carro de compras.
module.exports.apiCarritoGet = function (req, res, next) {
    // Se enviaron cookies del carro de compras desde el cliente.
    if (req.cookies.carrito) {
        // Transformar las cookies del cliente a un objeto.
        librosCarrito = JSON.parse(req.cookies.carrito);
        // El carro de compras contiene elementos.
        if (librosCarrito) {
            LibroModel.find({ '_id': { $in: librosCarrito } })
                .populate('autor')
                .populate('genero')
                .exec(function (err, librosLista) {
                    if (err) { return handleError(err); }
                    res.json(librosLista);
                });
        }
    }
}

// Imprimir errores en la consola del servidor.
function handleError(err) {
    console.log(err);
}