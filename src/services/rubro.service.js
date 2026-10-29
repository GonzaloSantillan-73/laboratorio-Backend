import prisma from '../config/prisma.js'
import { obtenerDeCache, guardarEnCache, limpiarCache } from '../utils/cache.js'


export const consultarRubros = async (criterios) => {
    // la clave depende de los filtros, asi cada busqueda distinta se guarda aparte
    const clave = 'rubros:' + JSON.stringify(criterios)

    const enCache = obtenerDeCache(clave)
    if (enCache) {
        console.log(`[CACHE] Respuesta desde la cache: ${clave}`)
        return enCache
    }

    console.log(`[CACHE] No estaba en cache, consultando la base de datos: ${clave}`)
    
    const { nombre, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    const desplazamiento = (pagina - 1) * limite
    const [rubros, total] = await prisma.$transaction([
        prisma.rubro.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite,
        }),
        prisma.rubro.count({ where })
    ])
    
    const resultado = { rubros, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
    guardarEnCache(clave, resultado)
    return resultado
}

export const consultarRubroPorId = async (id) => {
    return prisma.rubro.findUnique({ where: { id } })
}

export const crearRubro = async (datos) => {
    const { nombre } = datos
    const nuevo = await prisma.rubro.create({
        data: { nombre }
    })
    // cambiaron los datos, la cache ya no sirve
    limpiarCache('rubros')
    return nuevo
}

export const actualizarRubro = async (id, datos) => {
    const existe = await prisma.rubro.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { nombre } = datos
    const actualizado = await prisma.rubro.update({
        where: { id },
        data: { nombre }
    })
    limpiarCache('rubros')
    return actualizado
}

export const eliminarRubro = async (id) => {
    const existe = await prisma.rubro.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const eliminado = await prisma.rubro.delete({ where: { id } })
    limpiarCache('rubros')
    return eliminado
}
