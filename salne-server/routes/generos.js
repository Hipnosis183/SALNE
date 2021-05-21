var express = require('express');
var router = express.Router();

var GeneroController = require('../controllers/genero');
var { reqAutorizacion } = require('../controllers/sesion');

router.get('/', GeneroController.index);

router.get('/nuevoGenero', reqAutorizacion, GeneroController.nuevoGeneroGet);
router.post('/nuevoGenero', reqAutorizacion, GeneroController.nuevoGeneroPost);

router.get('/:id/editarGenero', reqAutorizacion, GeneroController.editarGeneroGet);
router.post('/:id/editarGenero', reqAutorizacion, GeneroController.editarGeneroPost);

router.get('/:id', GeneroController.verGenero);
router.get('/:id/borrarGenero', reqAutorizacion, GeneroController.borrarGenero);

module.exports = router;