var express = require('express');
var router = express.Router();

var IndexController = require('../controllers/index');

router.get('/', IndexController.index);
router.get('/catalogo', IndexController.catalogo);

module.exports = router;
