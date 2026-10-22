import { consultarUsuarioPorId } from "../services/usuario.service.js"

export const cargarContextoUsuario = async (req, res, next) => {
    const usuario = await consultarUsuarioPorId(req.usuario.id)
    if (!usuario) {
        res.set("WWW-Authenticate", "Bearer");
        return res.status(401).json({ mensaje: "Cuenta inexistente." })
    }
    if (!usuario.activo) {
        return res.status(403).json({ mensaje: "Cuenta inactiva." })
    }
    req.contextoUsuario = usuario
    return next()
}