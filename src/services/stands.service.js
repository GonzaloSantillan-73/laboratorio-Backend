import prisma from "../config/prisma.js";

const verificarPabellon = async (pabellonId) => {
    const pabellon = await prisma.pabellon.findUnique({
        where: { id: pabellonId }
    })
    if (!pabellon) {
        const error = new Error(`No existe un pabellón con ID ${pabellonId}`);
        error.status = 404;
        throw error;
    }
}

const verificarCoordenada = async (coordenadaId, standId) => {
    const coordenada = await prisma.coordenada.findUnique({
        where: { id: coordenadaId },
        include: { stand: true }
    })
    if (!coordenada) {
        const error = new Error(`No existe una coordenada con ID ${coordenadaId}`);
        error.status = 404;
        throw error;
    }
    if (coordenada.stand && coordenada.stand.id !== standId) {
        const error = new Error("La coordenada ya está ocupada por otro stand.");
        error.status = 409;
        throw error;
    }
}

export const obtenerStandsService = async () => {
    return await prisma.stand.findMany({
        include: { artesano: true, pabellon: true, coordenada: true },
    });
};

export const obtenerStandPorIdService = async (id) => {
    const stand = await prisma.stand.findUnique({
        where: { id: Number(id) },
        include: { artesano: true, pabellon: true, coordenada: true },
    });

    if (!stand) {
        const error = new Error(`El stand con el id ${id} no existe.`);
        error.status = 404;
        throw error;
    }

    return stand;
};

export const crearStandService = async (crearStandDto) => {
    await verificarPabellon(crearStandDto.pabellonId)
    await verificarCoordenada(crearStandDto.coordenadaId)
    // Si se envía un artesanoId, verificamos que exista y no tenga ya un stand asignado
    if (crearStandDto.artesanoId) {
        const artesano = await prisma.artesano.findUnique({
            where: { id: crearStandDto.artesanoId },
            include: { stand: true }
        });

        if (!artesano) {
            const error = new Error("El artesano especificado no existe.");
            error.status = 404;
            throw error;
        }

        if (artesano.stand) {
            const error = new Error("El artesano ya tiene un stand asignado.");
            error.status = 409;
            throw error;
        }
    }

    return await prisma.stand.create({
        data: crearStandDto,
        include: { artesano: true, pabellon: true, coordenada: true },
    });
};

export const actualizarStandService = async (id, actualizarStandDto) => {
    if (actualizarStandDto.pabellonId) {
        await verificarPabellon(actualizarStandDto.pabellonId)
    }
    if (actualizarStandDto.coordenadaId) {
        await verificarCoordenada(actualizarStandDto.coordenadaId, Number(id))
    }
    try {
        return await prisma.stand.update({
            where: { id: Number(id) },
            data: actualizarStandDto,
            include: { artesano: true, pabellon: true, coordenada: true },
        });
    } catch (error) {
        if (error.code === "P2025") {
            const err = new Error("El stand no existe.");
            err.status = 404;
            throw err;
        }
        throw error;
    }
};

export const eliminarStandService = async (id) => {
    try {
        return await prisma.stand.delete({
            where: { id: Number(id) },
        });
    } catch (error) {
        if (error.code === "P2025") {
            const err = new Error("El stand no existe.");
            err.status = 404;
            throw err;
        }
        throw error;
    }
};

export const consultarStandsService = async (criteriosConsulta) => {
    const { pabellon, sector, estado, ordenarPor, direccion, pagina, limite } = criteriosConsulta;
    
    const where = {};
    if (pabellon) {
        where.pabellon = { nombre: { contains: pabellon, mode: "insensitive" } };
    }
    if (sector) {
        where.sector = { contains: sector, mode: "insensitive" };
    }
    if (estado) {
        where.estado = estado;
    }

    const desplazamiento = (pagina - 1) * limite;

    const [stands, total] = await prisma.$transaction([
        prisma.stand.findMany({
            where,
            orderBy: [{ [ordenarPor]: direccion }, { id: "asc" }],
            skip: desplazamiento,
            take: limite,
            include: { artesano: true, pabellon: true, coordenada: true }
        }),
        prisma.stand.count({ where })
    ]);

    return {
        stands,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};