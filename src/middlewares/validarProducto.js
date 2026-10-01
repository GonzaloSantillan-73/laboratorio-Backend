import { crearError } from '../utils/errores.js'

export const validarProducto = (req, res, next) => {
    const resultado=productoSchema.safeParse(req.body)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError('Datos de producto invalidos',400,detalle))
    }
    req.body=resultado.data
    next()
}
