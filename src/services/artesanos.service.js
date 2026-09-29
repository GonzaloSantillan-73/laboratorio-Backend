import prisma from "../config/prisma.js";

export const obtenerArtesanosService = async () => {
    return await prisma.artesano.findMany({
        include: {
            usuario: true,
            productos: true,
            stand: true,
        },
    });
};

export const obtenerArtesanoPorIdService = async (id) => {
    const artesano = await prisma.artesano.findUnique({
        where: { id: Number(id) },
        include: {
            usuario: true,
            productos: true,
            stand: true,
        },
    });

    if (!artesano) {
        const error = new Error(`El artesano con el id ${id} no existe`);
        error.status = 404;
        throw error;
    }

    return artesano;
};

export const crearArtesanoService = async (crearArtesanoDto) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id: crearArtesanoDto.usuarioId },
    });

    if (!usuario) {
        const error = new Error("El usuario especificado no existe.");
        error.status = 404;
        throw error;
    }
    const { nombreEmprendimiento, trayectoria, localidad, rubro, usuarioId } = crearArtesanoDto;
    return await prisma.artesano.create({
        data: {
            nombreEmprendimiento,
            trayectoria,
            localidad,
            rubro,
            usuarioId
        },
        include: { usuario: true },
    });
};

export const actualizarArtesanoService = async (id, actualizarArtesanoDto) => {
    try {
        return await prisma.artesano.update({
            where: { id: Number(id) },
            data: actualizarArtesanoDto,
        });
    } catch (error) {
        if (error.code === "P2025") {
            const err = new Error("El artesano no existe.");
            err.status = 404;
            throw err;
        }
        throw error;
    }
};

export const eliminarArtesanoService = async (id) => {
    try {
        return await prisma.artesano.delete({
            where: { id: Number(id) },
        });
    } catch (error) {
        if (error.code === "P2025") {
            const err = new Error("El artesano no existe.");
            err.status = 404;
            throw err;
        }
        throw error;
    }
};