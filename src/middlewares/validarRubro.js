import { crearError, detallarErroresZod } from '../utils/errores.js'
import { rubroSchema } from '../validators/rubros.schemas.js'

export const validarRubro = (req, res, next) => {
    const resultado = rubroSchema.safeParse(req.body)
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error)
        return next(crearError('Datos de rubro invalidos', 400, detalle))
    }
    req.body = resultado.data
    next()
}
