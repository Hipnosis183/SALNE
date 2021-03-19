var express = require('express');
var router = express.Router();

var AutorController = require('../controllers/autor');

router.get('/', AutorController.index);

router.get('/nuevoAutor', AutorController.nuevoAutorGet);
router.post('/nuevoAutor', AutorController.nuevoAutorPost);

router.get('/:id/editarAutor', AutorController.editarAutorGet);
router.post('/:id/editarAutor', AutorController.editarAutorPost);

router.get('/:id', AutorController.verAutor);
router.get('/:id/borrarAutor', AutorController.borrarAutor);

module.exports = router;