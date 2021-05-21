const { Schema, model } = require('mongoose');

const autorSchema = new Schema({
    nombre: { type: String, required: true, maxlength: 50 },
    imagen: { type: String, required: true, maxlength: 30 }
});

autorSchema.set('toObject', { virtuals: true });
autorSchema.set('toJSON', { virtuals: true });

module.exports = model('autor', autorSchema);