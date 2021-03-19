var express = require('express');
var router = express.Router();

var LibroController = require('../controllers/libro');

router.get('/', LibroController.index);

router.get('/nuevoLibro', LibroController.nuevoLibroGet);
router.post('/nuevoLibro', LibroController.nuevoLibroPost);

router.get('/:id/editarLibro', LibroController.editarLibroGet);
router.post('/:id/editarLibro', LibroController.editarLibroPost);

router.get('/:id', LibroController.verLibro);
router.get('/:id/borrarLibro', LibroController.borrarLibro);

module.exports = router;
