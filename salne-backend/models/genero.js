const { Schema, model } = require('mongoose');

const generoSchema = new Schema({
    nombre: { type: String, required: true, maxlength: 50 },
    imagen: { type: String, required: true, maxlength: 30 }
});

generoSchema.set('toObject', { virtuals: true });
generoSchema.set('toJSON', { virtuals: true });

module.exports = model('genero', generoSchema);