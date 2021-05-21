var express = require('express');
var router = express.Router();

var UsuarioController = require('../controllers/usuario');
var CarritoController = require('../controllers/carrito');
var { reqAutorizacion } = require('../controllers/sesion');

router.get('/', reqAutorizacion, UsuarioController.index);

router.get('/nuevoUsuario', UsuarioController.nuevoUsuarioGet);
router.post('/nuevoUsuario', UsuarioController.nuevoUsuarioPost);

router.get('/:id/editarUsuario', UsuarioController.editarUsuarioGet);
router.post('/:id/editarUsuario', UsuarioController.editarUsuarioPost);

router.get('/:id', UsuarioController.verUsuario);
router.get('/:id/borrarUsuario', UsuarioController.borrarUsuarioGet);
router.post('/:id/borrarUsuario', UsuarioController.borrarUsuarioPost);

router.get('/:id/carrito', CarritoController.index);
router.get('/:id/carrito/realizarCompra', CarritoController.realizarCompra);

module.exports = router;
