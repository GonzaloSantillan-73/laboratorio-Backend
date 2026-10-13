import { crearError, detallarErroresZod } from '../utils/errores.js'
import { ProductoSchema } from '../validators/productos.schemas.js'

export const validarProducto = (req, res, next) => {
    const resultado=ProductoSchema.safeParse(req.body)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError('Datos de producto invalidos',400,detalle))
    }
    req.body=resultado.data
    next()
}
