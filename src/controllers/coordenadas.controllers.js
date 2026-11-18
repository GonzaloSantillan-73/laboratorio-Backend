import { crearError } from '../utils/errores.js'
import * as coordenadaServices from '../services/coordenada.service.js'

export const obtenerCoordenadas = async (req, res, next) => {
    try {
        const resultado = await coordenadaServices.consultarCoordenadas(req.consultaValidada)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerCoordenadaPorId = async (req, res, next) => {
    try {
        // el service devuelve null si no existe y aca se convierte en 404
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
        const nuevaCoordenada = await coordenadaServices.crearCoordenada(req.bodyValidado)
        res.status(201).json(nuevaCoordenada)
    } catch (error) {
        next(error)
    }
}

export const actualizarCoordenada = async (req, res, next) => {
    try {
        const coordenada = await coordenadaServices.actualizarCoordenada(req.params.id, req.bodyValidado)
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
        // 204: salio bien pero no hay nada para devolver
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
