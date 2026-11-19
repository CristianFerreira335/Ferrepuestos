const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const productosRoutes = require("./routes/productos");
const authRoutes = require("./routes/auth");

const app = express();

// Configuración
app.use(cors());
app.use(express.json());
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB conectado correctamente");
    })
    .catch((error) => {
        console.log("Error al conectar MongoDB:", error.message);
    });

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("¡Backend de FerRepuestos funcionando!");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});