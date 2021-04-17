var express = require('express');
var router = express.Router();

var UsuarioController = require('../controllers/usuario');
var { reqAutorizacion } = require('../controllers/sesion');

router.get('/', reqAutorizacion, UsuarioController.index);

router.get('/nuevoUsuario', UsuarioController.nuevoUsuarioGet);
router.post('/nuevoUsuario', UsuarioController.nuevoUsuarioPost);

router.get('/:id', UsuarioController.verUsuario);

module.exports = router;
