const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema({
    nombre: { type: String, required: true, maxlength: 50 },
    password: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    imagen: { type: String, required: true, maxlength: 30 },
    libros: [{ type: Schema.Types.ObjectId, ref: 'libro' }],
    admin: { type: Boolean, required: true }
});

usuarioSchema.set('toObject', { virtuals: true });
usuarioSchema.set('toJSON', { virtuals: true });

module.exports = model('usuario', usuarioSchema);