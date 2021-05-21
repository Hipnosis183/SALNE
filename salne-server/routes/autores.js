var express = require('express');
var router = express.Router();

var AutorController = require('../controllers/autor');
var { reqAutorizacion } = require('../controllers/sesion');

router.get('/', AutorController.index);

router.get('/nuevoAutor', reqAutorizacion, AutorController.nuevoAutorGet);
router.post('/nuevoAutor', reqAutorizacion, AutorController.nuevoAutorPost);

router.get('/:id/editarAutor', reqAutorizacion, AutorController.editarAutorGet);
router.post('/:id/editarAutor', reqAutorizacion, AutorController.editarAutorPost);

router.get('/:id', AutorController.verAutor);
router.get('/:id/borrarAutor', reqAutorizacion, AutorController.borrarAutor);

module.exports = router;