import prisma from "../config/prisma.js";

const verificarRubros = async (rubrosIds) => {
    for (const rubroId of rubrosIds) {
        const rubro = await prisma.rubro.findUnique({
            where: { id: rubroId }
        })
        if (!rubro) {
            const error = new Error(`No existe un rubro con ID ${rubroId}`);
            error.status = 404;
            throw error;
        }
    }
}

const verificarLocalidad = async (localidadId) => {
    const localidad = await prisma.localidad.findUnique({
        where: { id: localidadId }
    })
    if (!localidad) {
        const error = new Error(`No existe una localidad con ID ${localidadId}`);
        error.status = 404;
        throw error;
    }
}

export const obtenerArtesanosService = async () => {
    return await prisma.artesano.findMany({
        include: {
            usuario: true,
            productos: true,
            stand: true,
            rubros: { include: { rubro: true } },
            localidad: { include: { provincia: true } },
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
            rubros: { include: { rubro: true } },
            localidad: { include: { provincia: true } },
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
    const { nombreEmprendimiento, trayectoria, localidadId, rubrosIds, usuarioId } = crearArtesanoDto;
    await verificarRubros(rubrosIds)
    await verificarLocalidad(localidadId)
    return await prisma.artesano.create({
        data: {
            nombreEmprendimiento,
            trayectoria,
            localidadId,
            usuarioId,
            rubros: {
                create: rubrosIds.map(rubroId => ({ rubro: { connect: { id: rubroId } } }))
            }
        },
        include: { usuario: true, rubros: { include: { rubro: true } } },
    });
};

export const actualizarArtesanoService = async (id, actualizarArtesanoDto) => {
    const { rubrosIds, ...datos } = actualizarArtesanoDto;
    const data = { ...datos };
    // si mandan rubros, se borran los que tenia y se ponen los nuevos
    if (rubrosIds) {
        await verificarRubros(rubrosIds)
        data.rubros = {
            deleteMany: {},
            create: rubrosIds.map(rubroId => ({ rubro: { connect: { id: rubroId } } }))
        }
    }
    if (datos.localidadId) {
        await verificarLocalidad(datos.localidadId)
    }
    try {
        return await prisma.artesano.update({
            where: { id: Number(id) },
            data: data,
            include: { rubros: { include: { rubro: true } } },
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

export const consultarArtesanosService = async (criteriosConsulta) => {
    const { localidad, rubro, estadoSolicitud, ordenarPor, direccion, pagina, limite } = criteriosConsulta;
    
    const where = {};
    if (localidad) {
        where.localidad = { nombre: { contains: localidad, mode: "insensitive" } };
    }
    if (rubro) {
        where.rubros = { some: { rubro: { nombre: { contains: rubro, mode: "insensitive" } } } };
    }
    if (estadoSolicitud) {
        where.estadoSolicitud = estadoSolicitud;
    }

    const desplazamiento = (pagina - 1) * limite;

    const [artesanos, total] = await prisma.$transaction([
        prisma.artesano.findMany({
            where,
            orderBy: [{ [ordenarPor]: direccion }, { id: "asc" }],
            skip: desplazamiento,
            take: limite,
            include: { usuario: true, rubros: { include: { rubro: true } } }
        }),
        prisma.artesano.count({ where })
    ]);
    return {
        artesanos,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};
export const obtenerMiArtesano = async (usuarioId) => {
    return prisma.artesano.findUniqueOrThrow({
        where: { usuarioId },
        select: { id: true, nombreEmprendimiento: true, trayectoria: true,
            localidad: { select: { nombre: true, provincia: { select: { nombre: true } } } },
            estadoSolicitud: true,
            rubros: { select: { rubro: { select: { nombre: true } } } } }
    });
};

export const asignarArtesano = async (dto) => {
    await verificarLocalidad(dto.localidadId)
    return prisma.$transaction(async tx => {
        const usuario = await tx.usuario.findUniqueOrThrow({
            where: { id: dto.usuarioId },
            include: { roles: { include: { rol: true } },
                artesano: true }
        });
        const esAdmin = usuario.roles.some(
            a => a.rol.nombre === "ADMINISTRADOR");
        if (!usuario.activo || !esAdmin || usuario.artesano) {
            const error = new Error("Requiere administrador activo sin Artesano.");
            error.status = 409; throw error;
        }
        const actualizado = await tx.usuario.update({
            where: { id: usuario.id },
            data: {
                artesano: { create: {
                    nombreEmprendimiento: dto.nombreEmprendimiento,
                    trayectoria: dto.trayectoria,
                    localidadId: dto.localidadId,
                    rubros: { create: dto.rubrosIds.map(rubroId => ({ rubro: { connect: { id: rubroId } } })) },
                    estadoSolicitud: "APROBADO"
                } },
                roles: { create: {
                    rol: { connect: { nombre: "ARTESANO" } }
                } }
            },
            select: { artesano: true }
        });
        return actualizado.artesano;
    });
};
