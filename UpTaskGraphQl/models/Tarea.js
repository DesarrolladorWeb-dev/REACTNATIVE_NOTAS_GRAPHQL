const mongoose = require('mongoose')

const TareaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, //tomar unicamente lo que tiene el id del Usuario
        ref: 'Usuario'
    },
    creado:{
        type: Date,
        default: Date.now()
    },
    proyecto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    },
    estado: {
        type: Boolean,
        default: false
    }
})
module.exports = mongoose.model('Tarea' , TareaSchema)