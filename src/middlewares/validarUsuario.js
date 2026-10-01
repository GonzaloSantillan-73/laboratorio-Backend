import { crearError, detallarErroresZod } from '../utils/errores.js'
import { usuarioSchema } from '../validators/usuarios.schemas.js'


export const validarUsuario = (req, res, next) => {
    const resultado=usuarioSchema.safeParse(req.body)
    if(!resultado.success){
        const detalle=detallarErroresZod(resultado.error)
        return next(crearError('Datos de usuario invalidos',400,detalle))
    }
    req.body=resultado.data
    next()
}

/*export const validarUsuario = (req, res, next) => {
    const { nombre, apellido, email, password, rolId} = req.body
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        return next(crearError('El Nombre es obligatorio, debe ser una cadena de texto y no vacia', 400))
    }
    if (typeof apellido !== 'string' || apellido.trim() === '') {
        return next(crearError('El Apellido es obligatorio, debe ser una cadena de texto y no vacia', 400))
    }
    if (typeof email !== 'string' || email.trim() === '') {
        return next(crearError('El Email es obligatorio, debe ser una cadena de texto y no vacia', 400))
    }
    if (typeof password !== 'string' || password.trim() === '') {
        return next(crearError('La Contraseña es obligatorio, debe ser una cadena de texto y no vacia', 400))
    }
    if (typeof rolId !== 'number' || rolId <= 0 || rolId === null) {
        return next(crearError('El Rol es obligatorio, debe ser uno de los numeros asignados', 400))
    }
    req.body.nombre=nombre.trim()
    req.body.apellido=apellido.trim()
    req.body.email=email.trim()
    req.body.password=password.trim()
    next()
}*/