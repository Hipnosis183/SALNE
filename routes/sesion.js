var express = require('express');
var router = express.Router();

var SesionController = require('../controllers/sesion');

router.get('/iniciarSesion', SesionController.iniciarSesionGet);
router.post('/iniciarSesion', SesionController.iniciarSesionPost);
router.get('/cerrarSesion', SesionController.cerrarSesion);

module.exports = router;
