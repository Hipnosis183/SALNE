var express = require('express');
var router = express.Router();

var GeneroController = require('../controllers/genero');

router.get('/', GeneroController.index);

router.get('/nuevoGenero', GeneroController.nuevoGeneroGet);
router.post('/nuevoGenero', GeneroController.nuevoGeneroPost);

router.get('/:id/editarGenero', GeneroController.editarGeneroGet);
router.post('/:id/editarGenero', GeneroController.editarGeneroPost);

router.get('/:id', GeneroController.verGenero);
router.get('/:id/borrarGenero', GeneroController.borrarGenero);

module.exports = router;