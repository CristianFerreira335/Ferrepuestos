const mongoose = require("mongoose");

// Estructura de los productos
const productoSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    categoria: {
        type: String,
        required: true
    },

    imagen: {
        type: String,
        default: ""
    },

    stock: {
        type: Number,
        default: 0
    }

});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;