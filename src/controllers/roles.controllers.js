import { crearError } from '../utils/errores.js'
import * as rolServices from '../services/rol.service.js'

export const obtenerRoles = async (req, res, next) => {
    try {
        const resultado = await rolServices.consultarRoles(req.consultaRoles)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerRolPorId = async (req, res, next) => {
    try {
        const rol = await rolServices.consultarRolPorId(req.params.id)
        if (!rol) {
            return next(crearError(`No existe un rol con ID ${req.params.id}`, 404))
        }
        res.json(rol)
    } catch (error) {
        next(error)
    }
}

export const crearRol = async (req, res, next) => {
    try {
        const nuevoRol = await rolServices.crearRol(req.body)
        res.status(201).json(nuevoRol)
    } catch (error) {
        next(error)
    }
}

export const actualizarRol = async (req, res, next) => {
    try {
        const rol = await rolServices.actualizarRol(req.params.id, req.body)
        if (!rol) {
            return next(crearError(`No existe un rol con ID ${req.params.id}`, 404))
        }
        res.json(rol)
    } catch (error) {
        next(error)
    }
}

export const eliminarRol = async (req, res, next) => {
    try {
        const eliminado = await rolServices.eliminarRol(req.params.id)
        if (!eliminado) {
            return next(crearError(`No existe el rol con ID ${req.params.id}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const agregarRol = async (req, res) => {
    await rolServices.asignarAdministrador(req.parametrosValidados.id);
    return res.json({
        mensaje: "Rol ADMINISTRADOR asignado."
    });
};
