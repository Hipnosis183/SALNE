const { Schema, model } = require('mongoose');

const generoSchema = new Schema({
    nombre: { type: String, required: true, maxlength: 20 }
});

generoSchema.virtual('url').get(function () {
    return '/catalogo/generos/' + this._id;
});

module.exports = model('genero', generoSchema);