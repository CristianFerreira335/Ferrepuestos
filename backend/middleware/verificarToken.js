const jwt = require("jsonwebtoken");

// Verificar el token del administrador
function verificarToken(req, res, next) {

    // Obtener el token enviado
    const encabezado = req.headers.authorization;

    if (!encabezado) {
        return res.status(401).json({
            mensaje: "Acceso no autorizado"
        });
    }

    // Separar la palabra Bearer del token
    const token = encabezado.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensaje: "Token no proporcionado"
        });
    }

    try {

        // Verificar el token
        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Comprobar que sea administrador
        if (usuario.rol !== "admin") {
            return res.status(403).json({
                mensaje: "No tienes permisos"
            });
        }

        req.usuario = usuario;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token inválido o vencido"
        });

    }

}

module.exports = verificarToken;