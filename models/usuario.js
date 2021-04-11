const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
    usuario: { type: String, required: true, maxlength: 50 },
    password: { type: String, required: true, maxlength: 100 }
});

usuarioSchema.virtual('url').get(function () {
    return '/';
});

module.exports = model('usuario', usuarioSchema);