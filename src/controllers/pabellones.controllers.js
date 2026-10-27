import { crearError } from '../utils/errores.js'
import * as pabellonServices from '../services/pabellon.service.js'

export const obtenerPabellones = async (req, res, next) => {
    try {
        const resultado = await pabellonServices.consultarPabellones(req.consultaPabellones)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerPabellonPorId = async (req, res, next) => {
    try {
        const pabellon = await pabellonServices.consultarPabellonPorId(req.params.id)
        if (!pabellon) {
            return next(crearError(`No existe un pabellón con ID ${req.params.id}`, 404))
        }
        res.json(pabellon)
    } catch (error) {
        next(error)
    }
}

export const crearPabellon = async (req, res, next) => {
    try {
        const nuevoPabellon = await pabellonServices.crearPabellon(req.body)
        res.status(201).json(nuevoPabellon)
    } catch (error) {
        next(error)
    }
}

export const actualizarPabellon = async (req, res, next) => {
    try {
        const pabellon = await pabellonServices.actualizarPabellon(req.params.id, req.body)
        if (!pabellon) {
            return next(crearError(`No existe un pabellón con ID ${req.params.id}`, 404))
        }
        res.json(pabellon)
    } catch (error) {
        next(error)
    }
}

export const eliminarPabellon = async (req, res, next) => {
    try {
        const eliminado = await pabellonServices.eliminarPabellon(req.params.id)
        if (!eliminado) {
            return next(crearError(`No existe el pabellón con ID ${req.params.id}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
