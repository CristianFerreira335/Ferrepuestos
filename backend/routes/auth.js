const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Preparar la contraseña protegida
const contraseñaHash = bcrypt.hashSync(
    process.env.ADMIN_PASSWORD,
    10
);

// Iniciar sesión
router.post("/login", async(req, res) => {

    try {

        const { email, password } = req.body;

        // Comprobar los campos
        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Completa todos los campos"
            });
        }

        // Comprobar el correo
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        // Comprobar la contraseña
        const contraseñaCorrecta = await bcrypt.compare(
            password,
            contraseñaHash
        );

        if (!contraseñaCorrecta) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        // Comprobar que exista la clave JWT
        if (!process.env.JWT_SECRET) {
            throw new Error("Falta configurar JWT_SECRET");
        }

        // Crear token de acceso
        const token = jwt.sign({
                email: email,
                rol: "admin"
            },
            process.env.JWT_SECRET, {
                expiresIn: "2h"
            }
        );

        res.json({
            mensaje: "Inicio de sesión correcto",
            token: token
        });

    } catch (error) {

        console.log("Error de autenticación:", error.message);

        res.status(500).json({
            mensaje: "Error al iniciar sesión"
        });

    }

});

module.exports = router;