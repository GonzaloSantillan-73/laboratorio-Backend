import prisma from '../config/prisma.js';

export const obtenerArtesanos = async (req, res, next) => {
    try {
        const artesanos = await prisma.artesano.findMany({
            include: {
                usuario: true,
                productos: true,
                stand: true
            }
        });
        return res.json(artesanos);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener los artesanos", error: error.message });
    }
};

export const obtenerArtesanosPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const artesano = await prisma.artesano.findUnique({
            where: { id: parseInt(id) },
            include: {
                usuario: true,
                productos: true,
                stand: true
            }
        });
        if (!artesano) {
            const error = new Error(`El artesano con el id ${id} no existe`);
            error.status = 404;
            return next(error);
        }
        return res.json(artesano);
    } catch (error) {
        return next(error);
    }
};

export const crearArtesano = async (req, res, next) => {
    try {
        const { localidad, nombreEmprendimiento, rubro, trayectoria, usuarioId } = req.body;

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: Number(usuarioId) }
        });
        if (!usuarioExiste) {
            const error = new Error(`El usuario con el id ${usuarioId} no existe`);
            error.status = 400;
            return next(error);
        }

        const nuevoArtesano = await prisma.artesano.create({
            data: {
                estadoSolicitud: 'PENDIENTE',
                localidad: localidad.trim(),
                nombreEmprendimiento: nombreEmprendimiento.trim(),
                rubro: rubro.trim(),
                trayectoria: trayectoria.trim(),
                usuario: {
                    connect: { id: Number(usuarioId) }
                }
            },
            include: {
                usuario: true
            }
        });

        return res.status(201).json({
            mensaje: "Artesano creado exitosamente",
            artesano: nuevoArtesano
        });

    } catch (error) {
        return next(error);
    }
};

export const actualizarArtesanoId = async (req, res, next) => {
    try {
        const idArtesano = Number(req.params.id)
        const { localidad, nombreEmprendimiento, rubro, trayectoria } = req.body;
        const artesanoActualizado = await prisma.artesano.update({
            where: { id: idArtesano },
            data: {
                localidad: localidad.trim(),
                nombreEmprendimiento: nombreEmprendimiento.trim(),
                rubro: rubro.trim(),
                trayectoria: trayectoria.trim()
            }
        })
        return res.json(artesanoActualizado)
    } catch (error) {
        if (error.code === "P2025") {
            const errorNoEncontrado = new Error("El artesano no existe.");
            errorNoEncontrado.status = 404;
            return next(errorNoEncontrado);
        }
        return next(error);
    }
}

export const eliminarArtesanoId = async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const artesanoEliminado = await prisma.artesano.delete({
            where: {id: id}
        })
        return res.json({
            message: 'Artesano eliminado',
            artesano: artesanoEliminado
        })
    } catch (error) {
        if (error.code === "P2025") {
            const errorNoEncontrado = new Error("El artesano no existe.");
            errorNoEncontrado.status = 404;
            return next(errorNoEncontrado);
        }
        return next(error);
    }
}