var express = require('express');
var router = express.Router();

// Middleware para requerir autorización.
var { reqAdmin } = require('../controllers/sesion');
var { reqSesion } = require('../controllers/sesion');

// Rutas para operaciones de libros.
var LibroController = require('../controllers/libro');
router.get('/libro', LibroController.apiLibroGet);
router.get('/libroNuevo', reqAdmin, LibroController.apiLibroNuevoGet);
router.post('/libroNuevo', reqAdmin, LibroController.apiLibroNuevoPost);
router.get('/libroEditar', reqAdmin, LibroController.apiLibroEditarGet);
router.post('/libroEditar', reqAdmin, LibroController.apiLibroEditarPost);
router.post('/libroBorrar', reqAdmin, LibroController.apiLibroBorrar);
router.get('/carrito', LibroController.apiCarritoGet);

// Rutas para operaciones de autores.
var AutorController = require('../controllers/autor');
router.get('/autor', AutorController.apiAutorGet);
router.post('/autorNuevo', reqAdmin, AutorController.apiAutorNuevo);
router.post('/autorEditar', reqAdmin, AutorController.apiAutorEditar);
router.post('/autorBorrar', reqAdmin, AutorController.apiAutorBorrar);

// Rutas para operaciones de géneros.
var GeneroController = require('../controllers/genero');
router.get('/genero', GeneroController.apiGeneroGet);
router.post('/generoNuevo', reqAdmin, GeneroController.apiGeneroNuevo);
router.post('/generoEditar', reqAdmin, GeneroController.apiGeneroEditar);
router.post('/generoBorrar', reqAdmin, GeneroController.apiGeneroBorrar);

// Rutas para operaciones de usuarios.
var UsuarioController = require('../controllers/usuario');
router.get('/usuario', reqSesion, UsuarioController.apiUsuarioGet);
router.post('/usuarioNuevo', UsuarioController.apiUsuarioNuevo);
router.post('/usuarioEditar', reqSesion, UsuarioController.apiUsuarioEditar);
router.post('/usuarioBorrar', reqSesion, UsuarioController.apiUsuarioBorrar);
router.get('/realizarCompra', reqSesion, UsuarioController.apiRealizarCompra);

// Rutas para operaciones de sesión.
var SesionController = require('../controllers/sesion');
router.post('/iniciarSesion', SesionController.apiSesionIniciar);
router.get('/cerrarSesion', reqSesion, SesionController.apiSesionCerrar);
router.get('/autenticarSesion', SesionController.apiSesionAutenticar);

module.exports = router;
