import { crearError } from '../utils/errores.js'
import * as usuarioServices from '../services/usuario.service.js'


export const obtenerUsuarios = async (req, res, next) => {
    try {
        const resultado = await usuarioServices.consultarUsuario(req.query)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const usuario = await usuarioServices.consultarUsuarioPorId(req.recursoId)
        if (!usuario) {
            return next(crearError(`No existe un usuario con ID ${req.recursoId}`, 404))
        }
        res.json(usuario)
    } catch (error) {
        next(error)
    }
}

export const crearUsuario = async (req, res, next) => {
    try {
        const nuevoUsuario = await usuarioServices.crearUsuario(req.body)
        res.status(201).json(nuevoUsuario)
    } catch (error) {
        next(error)
    }
}

export const actualizarUsuario = async (req, res, next) => {
    try {
        const usuario = await usuarioServices.actualizarUsuario(req.recursoId, req.body)
        if (!usuario) {
            return next(crearError(`No existe un usuario con ID ${req.recursoId}`, 404))
        }
        res.json(usuario)
    } catch (error) {
        next(error)
    }
}

export const eliminarUsuario = async (req, res, next) => {
    try {
        const eliminado = await usuarioServices.eliminarUsuario(req.recursoId)
        if (!eliminado) {
            return next(crearError(`No existe el usuario con ID ${req.recursoId}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}