import { crearError, detallarErroresZod } from '../utils/errores.js'
import { pabellonSchema } from '../validators/pabellones.schemas.js'

export const validarPabellon = (req, res, next) => {
    const resultado = pabellonSchema.safeParse(req.body)
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error)
        return next(crearError('Datos de pabellón invalidos', 400, detalle))
    }
    req.body = resultado.data
    next()
}
