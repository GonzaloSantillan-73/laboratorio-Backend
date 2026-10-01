import { consultarRolSchema } from "../validators/roles.schemas.js"
import { consultarProductoSchema } from "../validators/productos.schemas.js"
import { consultarUsuarioSchema } from "../validators/usuarios.schemas.js"
import { crearError, detallarErroresZod } from "../utils/errores.js"

export const validarConsultarUsuario = (req, res, next) => {
    const resultado = consultarUsuarioSchema.safeParse(req.query)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError(`Los parametros de consulta son incorrectos ${detalle}`, 400))
    }
    req.consultarUsuario = resultado.data
    next()
}

export const validarConsultarRol = (req, res, next) => {
    const resultado = consultarRolSchema.safeParse(req.query)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError(`Los parametros de consulta son incorrectos ${detalle}`, 400))
    }
    req.consultarRol = resultado.data
    next()
}

export const validarConsultarProducto = (req, res, next) => {
    const resultado = consultarProductoSchema.safeParse(req.query)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError(`Los parametros de consulta son incorrectos ${detalle}`, 400))
    }
    req.consultarProducto = resultado.data
    next()
}