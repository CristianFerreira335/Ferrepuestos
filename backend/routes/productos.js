const express = require("express");
const router = express.Router();

const Producto = require("../models/producto");
const verificarToken = require("../middleware/verificarToken");
// Obtener todos los productos
router.get("/", async(req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
});

// Agregar un producto
router.post("/", verificarToken, async(req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        const productoGuardado = await nuevoProducto.save();

        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al guardar producto" });
    }
});

// Modificar un producto
router.put("/:id", verificarToken, async(req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al modificar producto" });
    }
});

// Eliminar un producto
router.delete("/:id", verificarToken, async(req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

        if (!productoEliminado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al eliminar producto" });
    }
});

module.exports = router;