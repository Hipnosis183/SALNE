var express = require('express');
var router = express.Router();

var LibroController = require('../controllers/libro');
var { reqAutorizacion } = require('../controllers/sesion');

router.get('/', LibroController.index);

router.get('/nuevoLibro', reqAutorizacion, LibroController.nuevoLibroGet);
router.post('/nuevoLibro', reqAutorizacion, LibroController.nuevoLibroPost);

router.get('/:id/editarLibro', reqAutorizacion, LibroController.editarLibroGet);
router.post('/:id/editarLibro', reqAutorizacion, LibroController.editarLibroPost);

router.get('/:id', LibroController.verLibro);
router.get('/:id/borrarLibro', reqAutorizacion, LibroController.borrarLibro);

module.exports = router;
