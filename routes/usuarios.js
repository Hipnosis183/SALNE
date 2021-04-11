var express = require('express');
var router = express.Router();

var UsuarioController = require('../controllers/usuario');
var { reqAutorizacion } = require('../controllers/sesion');

router.get('/nuevoUsuario', UsuarioController.nuevoUsuarioGet);
router.post('/nuevoUsuario', UsuarioController.nuevoUsuarioPost);

module.exports = router;
