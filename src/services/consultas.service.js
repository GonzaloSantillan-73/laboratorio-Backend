import prisma from "../config/prisma.js";

export const consultarConsultasService = async (criterios) => {
    const { terminoBusqueda, filtroAplicado, ordenarPor, direccion, pagina, limite } = criterios;
    
    const where = {};
    if (terminoBusqueda) {
        where.terminoBusqueda = { contains: terminoBusqueda, mode: "insensitive" };
    }
    if (filtroAplicado) {
        where.filtroAplicado = { contains: filtroAplicado, mode: "insensitive" };
    }

    const desplazamiento = (pagina - 1) * limite;

    const [consultas, total] = await prisma.$transaction([
        prisma.consulta.findMany({
            where,
            orderBy: [{ [ordenarPor]: direccion }, { id: "asc" }],
            skip: desplazamiento,
            take: limite,
            include: { usuario: true }
        }),
        prisma.consulta.count({ where })
    ]);

    return {
        consultas,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};

export const obtenerConsultaPorIdService = async (id) => {
    const consulta = await prisma.consulta.findUnique({
        where: { id: Number(id) },
        include: { usuario: true }
    });

    if (!consulta) {
        const error = new Error(`La consulta con el id ${id} no existe.`);
        error.status = 404;
        throw error;
    }

    return consulta;
};

export const crearConsultaService = async (dto) => {
    return await prisma.consulta.create({
        data: dto,
        include: { usuario: true }
    });
};

export const eliminarConsultaService = async (id) => {
    try {
        return await prisma.consulta.delete({
            where: { id: Number(id) }
        });
    } catch (error) {
        if (error.code === "P2025") {
            const err = new Error("La consulta no existe.");
            err.status = 404;
            throw err;
        }
        throw error;
    }
};