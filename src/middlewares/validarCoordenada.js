import { crearError, detallarErroresZod } from '../utils/errores.js'
import { coordenadaSchema } from '../validators/coordenadas.schemas.js'

export const validarCoordenada = (req, res, next) => {
    const resultado = coordenadaSchema.safeParse(req.body)
    if (!resultado.success) {
        const detalle = detallarErroresZod(resultado.error)
        return next(crearError('Datos de coordenada invalidos', 400, detalle))
    }
    req.body = resultado.data
    next()
}
