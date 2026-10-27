import { crearError } from '../utils/errores.js'
import * as localidadServices from '../services/localidad.service.js'

export const obtenerProvincias = async (req, res, next) => {
    try {
        const provincias = await localidadServices.consultarProvincias()
        res.json(provincias)
    } catch (error) {
        next(error)
    }
}

export const obtenerDepartamentos = async (req, res, next) => {
    try {
        const departamentos = await localidadServices.consultarDepartamentos(req.consultaValidada)
        res.json(departamentos)
    } catch (error) {
        next(error)
    }
}

export const obtenerLocalidades = async (req, res, next) => {
    try {
        const resultado = await localidadServices.consultarLocalidades(req.consultaValidada)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerLocalidadPorId = async (req, res, next) => {
    try {
        const localidad = await localidadServices.consultarLocalidadPorId(req.parametrosValidados.id)
        if (!localidad) {
            return next(crearError(`No existe una localidad con ID ${req.parametrosValidados.id}`, 404))
        }
        res.json(localidad)
    } catch (error) {
        next(error)
    }
}
