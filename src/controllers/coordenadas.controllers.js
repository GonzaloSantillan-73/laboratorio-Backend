import { crearError } from '../utils/errores.js'
import * as coordenadaServices from '../services/coordenada.service.js'

export const obtenerCoordenadas = async (req, res, next) => {
    try {
        const resultado = await coordenadaServices.consultarCoordenadas(req.consultaCoordenadas)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerCoordenadaPorId = async (req, res, next) => {
    try {
        const coordenada = await coordenadaServices.consultarCoordenadaPorId(req.params.id)
        if (!coordenada) {
            return next(crearError(`No existe una coordenada con ID ${req.params.id}`, 404))
        }
        res.json(coordenada)
    } catch (error) {
        next(error)
    }
}

export const crearCoordenada = async (req, res, next) => {
    try {
        const nuevaCoordenada = await coordenadaServices.crearCoordenada(req.body)
        res.status(201).json(nuevaCoordenada)
    } catch (error) {
        next(error)
    }
}

export const actualizarCoordenada = async (req, res, next) => {
    try {
        const coordenada = await coordenadaServices.actualizarCoordenada(req.params.id, req.body)
        if (!coordenada) {
            return next(crearError(`No existe una coordenada con ID ${req.params.id}`, 404))
        }
        res.json(coordenada)
    } catch (error) {
        next(error)
    }
}

export const eliminarCoordenada = async (req, res, next) => {
    try {
        const eliminada = await coordenadaServices.eliminarCoordenada(req.params.id)
        if (!eliminada) {
            return next(crearError(`No existe la coordenada con ID ${req.params.id}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
