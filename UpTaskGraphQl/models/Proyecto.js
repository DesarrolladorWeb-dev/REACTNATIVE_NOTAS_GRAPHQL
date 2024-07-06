const mongoose = require('mongoose')

const ProyectoSchema = new mongoose.Schema({
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
    }
})
module.exports = mongoose.model('Proyecto' , ProyectoSchema)