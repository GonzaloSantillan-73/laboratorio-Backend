import { crearError } from '../utils/errores.js'
import * as usuarioServices from '../services/usuario.service.js'
import { generarToken } from '../services/tokens.service.js'
import { asignarArtesano } from "../services/artesanos.service.js"


export const obtenerUsuarios = async (req, res, next) => {
    try {
        const resultado = await usuarioServices.consultarUsuario(req.consultaUsuarios)
        res.json(resultado)
    } catch (error) {
        next(error)
    }
}

export const obtenerUsuarioPorId = async (req, res, next) => {
    try {
        const usuario = await usuarioServices.consultarUsuarioPorId(req.params.id)
        if (!usuario) {
            return next(crearError(`No existe un usuario con ID ${req.params.id}`, 404))
        }
        res.json(usuario)
    } catch (error) {
        next(error)
    }
}

export const obtenerMiUsuario = async (req, res, next) => {
    return res.status(200).json({ usuario: req.contextoUsuario })
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
        const usuario = await usuarioServices.actualizarUsuario(req.params.id, req.body)
        if (!usuario) {
            return next(crearError(`No existe un usuario con ID ${req.params.id}`, 404))
        }
        res.json(usuario)
    } catch (error) {
        next(error)
    }
}

export const eliminarUsuario = async (req, res, next) => {
    try {
        const eliminado = await usuarioServices.eliminarUsuario(req.params.id)
        if (!eliminado) {
            return next(crearError(`No existe el usuario con ID ${req.params.id}`, 404))
        }
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}

export const registrarPostulacion = async (req, res) => {
    const usuario = await usuarioServices.registrarPostulacion(req.bodyValidado);
    return res.status(201).json(usuario);
};


export const iniciarSesion = async (req, res, next) => {
    try {
        const usuario = await usuarioServices.iniciarSesion(req.iniciarSesionDto);
        const token = generarToken(usuario)
        return res.status(200).json({
            mensaje: "Credenciales verificadas correctamente.",
            token: token,
            usuario: usuario
        });
    } catch (error) {
        return next(error);
    }
};


export const crearAdministrador = async (req, res) => {
    const usuario = await usuarioServices.registrarAdministrador(req.bodyValidado);
    return res.status(201).json(usuario);
};

export const asociarArtesano = async (req, res) => {
    const artesano = await asignarArtesano(req.bodyValidado);
    return res.status(201).json(artesano);
};
