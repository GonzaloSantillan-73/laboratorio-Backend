import { crearError } from '../utils/errores.js'
import * as rubroServices from '../services/rubro.service.js'

export const obtenerRubros = async (req, res, next) => {
    try {
        const resultado = await rubroServices.consultarRubros(req.consultaRubros)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerRubroPorId = async (req, res, next) => {
    try {
        const rubro = await rubroServices.consultarRubroPorId(req.params.id)
        if (!rubro) {
            return next(crearError(`No existe un rubro con ID ${req.params.id}`, 404))
        }
        res.json(rubro)
    } catch (error) {
        next(error)
    }
}

export const crearRubro = async (req, res, next) => {
    try {
        const nuevoRubro = await rubroServices.crearRubro(req.body)
        res.status(201).json(nuevoRubro)
    } catch (error) {
        next(error)
    }
}

export const actualizarRubro = async (req, res, next) => {
    try {
        const rubro = await rubroServices.actualizarRubro(req.params.id, req.body)
        if (!rubro) {
            return next(crearError(`No existe un rubro con ID ${req.params.id}`, 404))
        }
        res.json(rubro)
    } catch (error) {
        next(error)
    }
}

export const eliminarRubro = async (req, res, next) => {
    try {
        const eliminado = await rubroServices.eliminarRubro(req.params.id)
        if (!eliminado) {
            return next(crearError(`No existe el rubro con ID ${req.params.id}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
