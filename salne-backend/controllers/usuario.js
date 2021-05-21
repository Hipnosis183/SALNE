var { body, validationResult } = require("express-validator");
var fs = require('fs');

var UsuarioModel = require('../models/usuario');

// Buscar y devolver la información del usuario en la sesión abierta en el cliente.
module.exports.apiUsuarioGet = function (req, res, next) {
    if (req.query.id) {
        // Buscar el usuario y sus libros.
        UsuarioModel.findById(req.query.id)
            .populate({
                path: 'libros',
                populate: {
                    path: 'autor',
                    model: 'autor'
                }})
            .populate({
                path: 'libros',
                populate: {
                    path: 'genero',
                    model: 'genero'
                }})
            .exec(function (err, usuarioInfo) {
                if (err) { return handleError(err); }
                res.json(usuarioInfo);
            });
    } else { res.sendStatus(500); return; }
}

// Crear un usuario nuevo en la base de datos.
module.exports.apiUsuarioNuevo = [
    // Funciones de validación.
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('password', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email', '').trim().isLength({ min: 1, max: 100 }).isEmail().escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(500); return; }
        // Crear modelo con la información recibida.
        var Usuario = new UsuarioModel({
            nombre: req.body.nombre,
            password: req.body.password,
            email: req.body.email,
            imagen: 'no-image.png',
            admin: false
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/usuarios/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Usuario._id + '.' + imagenExt;
            Usuario.imagen = imagenFile;
        }
        // Buscar el usuario en la base de datos.
        UsuarioModel.findOne({
            'nombre': req.body.nombre,
            'email': req.body.email
        }, function (err, usuario) {
            if (err) { return handleError(err); }
            // El usuario ya existe.
            if (usuario) { res.sendStatus(500); return; } else {
                // Guardar el modelo en la base de datos.
                Usuario.save(function (err) {
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
        });
    }
];

// Editar el usuario perteneciente a la sesión abierta en el cliente.
module.exports.apiUsuarioEditar = [
    // Funciones de validación.
    body('nombre', '').trim().isLength({ min: 1, max: 50 }).escape(),
    body('password', '').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email', '').trim().isLength({ min: 1, max: 100 }).isEmail().escape(),
    body('imagen', '').trim().escape(),
    // Función principal.
    function (req, res, next) {
        var errors = validationResult(req);
        // Hay errores en la validación.
        if (!errors.isEmpty()) { res.sendStatus(202); return; }
        // Crear modelo con la información recibida.
        var Usuario = new UsuarioModel({
            _id: req.body.id,
            __v: req.body.version,
            nombre: req.body.nombre,
            password: req.body.password,
            email: req.body.email,
            imagen: req.body.imagen,
            admin: req.body.admin
        });
        // Configurar el archivo de imagen recibido.
        if (req.files) {
            var imagenPath = process.cwd() + '/public/images/usuarios/';
            var imagenExt = req.files.imagen.name.split('.').pop();
            var imagenFile = Usuario._id + '.' + imagenExt;
            Usuario.imagen = imagenFile;
        }
        // Actualizar el modelo en la base de datos.
        UsuarioModel.findByIdAndUpdate(req.body.id, Usuario, {}, function (err) {
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

// Eliminar el usuario perteneciente a la sesión abierta en el cliente.
module.exports.apiUsuarioBorrar = function (req, res, next) {
    // Eliminar el elemento de la base de datos.
    UsuarioModel.findByIdAndRemove(req.body.id, function (err, usuarioInfo) {
        if (err) { return handleError(err); }
        var imagenPath = process.cwd() + '/public/images/usuarios/';
        if (usuarioInfo.imagen != 'no-image.png') {
            // Eliminar el archivo de imagen actual en el servidor.
            if (fs.existsSync(imagenPath + usuarioInfo.imagen)) {
                fs.unlink(imagenPath + usuarioInfo.imagen, function (err) {
                    if (err) { return handleError(err); }
                });
            }
        } res.sendStatus(200);
    });
}

// Añadir los libros en el carro de compras del cliente al usuario perteneciente a la sesión abierta.
module.exports.apiRealizarCompra = function (req, res, next) {
    // Transformar las cookies del cliente a un objeto.
    librosCarrito = JSON.parse(req.cookies.carrito);
    // El carro de compras contiene elementos.
    if (librosCarrito) {
        // Existe una sesión valida en el cliente.
        if (req.session.id_usuario) {
            UsuarioModel.findById(req.session.id_usuario, function (err, usuario) {
                if (err) { return handleError(err); }
                // El usuario es válido.
                if (usuario) { usuario.__v++;
                    // Añadir los libros del carro a la biblioteca del usuario.
                    for (libroCarrito of librosCarrito) { usuario.libros.push(libroCarrito); }
                    // Actualizar el usuario en la base de datos.
                    UsuarioModel.findByIdAndUpdate(req.session.id_usuario, usuario, {}, function (err) {
                        if (err) { return handleError(err); }
                        // Eliminar las cookies en el cliente.
                        res.clearCookie('carrito');
                        res.sendStatus(200); return;
                    });
                } else { res.sendStatus(500); return; }
            });
        } else { res.sendStatus(500); return; }
    }
}

// Imprimir errores en la consola del servidor.
function handleError(err) {
    console.log(err);
}