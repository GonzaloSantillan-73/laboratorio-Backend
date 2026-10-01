import { crearError } from '../utils/errores.js'

export const validarRol = (req, res, next) => {
    const resultado=rolSchema.safeParse(req.body)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError('Datos de rol invalidos',400,detalle))
    }
    req.body=resultado.data
    next()
}