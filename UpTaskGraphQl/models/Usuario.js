const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true //para eliminar los espacions
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true //insertara los registros en minusculas

    },
    password:{
        type: String,
        required: true,
        trim: true 
    },
    registro:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('usuario', UsuariosSchema)