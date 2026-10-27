import bcrypt from "bcrypt";
import prisma from '../config/prisma.js'
import { crearError } from '../utils/errores.js'

const FACTOR_COSTO = 10;


const verificarRol = async (rolId) => {
    if (rolId === undefined || rolId === null) {
        return
    }
    const rol = await prisma.rol.findUnique({
        where: { id: rolId }
    })
    if (!rol) {
        throw crearError(`No existe un rol con ID ${rolId}`, 400)
    }
}

const verificarRoles = async (rolesIds) => {
    for (const rolId of rolesIds) {
        const rol = await prisma.rol.findUnique({
            where: { id: rolId }
        })
        if (!rol) {
            throw crearError(`No existe un rol con ID ${rolId}`, 400)
        }
    }
}

export const consultarUsuario = async (criterios) => {
    const { nombre, apellido, email, rolId, ordenPor, direccion, pagina, limite } = criterios

    const where = {}

    if (nombre !== undefined) {
        where.nombre = { contains: nombre, mode: 'insensitive' }
    }

    if (apellido !== undefined) {
        where.apellido = { contains: apellido, mode: 'insensitive' }
    }

    if (email !== undefined) {
        where.email = {
            contains: email, mode: 'insensitive'
        }
    }
    if (rolId !== undefined) {
        where.roles = { some: { rolId: rolId } }
    }

    const desplazamiento = (pagina - 1) * limite
    const [usuarios, total] = await prisma.$transaction([
        prisma.usuario.findMany({
            where,
            orderBy: [{ [ordenPor]: direccion }, { id: 'asc' }],
            skip: desplazamiento,
            take: limite,
            select: {
                id: true, nombre: true, apellido: true, email: true, activo: true,
                roles: {
                    select: { rol: { select: { nombre: true } } }
                }
            }
        }),
        prisma.usuario.count({ where })
    ])
    const usuariosConRoles = usuarios.map(usuario => ({
        ...usuario,
        roles: usuario.roles.map(asignacion => asignacion.rol.nombre)
    }))
    return { usuarios: usuariosConRoles, paginacion: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) } }
}


export const consultarUsuarioPorId = async (id) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
            id: true, nombre: true, apellido: true, email: true, activo: true,
            roles: {
                select: { rol: { select: { nombre: true } } }
            }
        }
    });
    if (!usuario) return null;
    return {
        ...usuario,
        roles: usuario.roles.map(asignacion =>
            asignacion.rol.nombre)
    };
}

export const crearUsuario = async (datos) => {
    const { nombre, apellido, email, password, rolesIds } = datos
    await verificarRoles(rolesIds)
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
    return prisma.usuario.create({
        data: {
            nombre,
            apellido,
            email,
            passwordHash,
            roles: {
                create: rolesIds.map(rolId => ({ rol: { connect: { id: rolId } } }))
            }
        },
        select: {
            id: true, nombre: true, apellido: true, email: true, activo: true,
            roles: { select: { rol: { select: { nombre: true } } } }
        }
    })
}

export const actualizarUsuario = async (id, datos) => {
    const existe = await prisma.usuario.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    const { nombre, apellido, email, password, rolesIds } = datos
    await verificarRoles(rolesIds)
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
    return prisma.usuario.update({
        where: { id },
        data: {
            nombre,
            apellido,
            email,
            passwordHash,
            // borra los roles que tenia y le asigna los nuevos
            roles: {
                deleteMany: {},
                create: rolesIds.map(rolId => ({ rol: { connect: { id: rolId } } }))
            }
        },
        select: {
            id: true, nombre: true, apellido: true, email: true, activo: true,
            roles: { select: { rol: { select: { nombre: true } } } }
        }
    })
}

export const eliminarUsuario = async (id) => {
    const existe = await prisma.usuario.findUnique({ where: { id } })
    if (!existe) {
        return null
    }
    return prisma.usuario.delete({ where: { id } })
}

export const registrarPostulacion = async (dto) => {
    const { nombre, apellido, email, password, nombreEmprendimiento, trayectoria, localidadId, rubrosIds } = dto;
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);

    // se crea la cuenta y el artesano juntos, pero sin el rol ARTESANO
    // el rol se lo da el admin cuando aprueba la solicitud
    return prisma.usuario.create({
        data: {
            nombre, apellido, email, passwordHash, activo: true,
            artesano: { create: {
                nombreEmprendimiento, trayectoria,
                estadoSolicitud: "PENDIENTE",
                localidad: { connect: { id: localidadId } },
                rubros: { create: rubrosIds.map(rubroId => ({ rubro: { connect: { id: rubroId } } })) }
            } }
        },
        select: {
            id: true, nombre: true, apellido: true, email: true, activo: true,
            artesano: { select: { id: true, estadoSolicitud: true } }
        }
    });
};


export const iniciarSesion = async (iniciarSesionDto) => {
    const { email, password } = iniciarSesionDto;
    const usuario = await prisma.usuario.findUnique({
        where: { email: email }
    });
    if (!usuario) {
        const error = new Error("Las credenciales son inválidas.");
        error.status = 401;
        throw error;
    }
    // Compara la contraseña con el hash almacenado.
    const passwordValida = await bcrypt.compare(
        password,
        usuario.passwordHash
    );

    if (!passwordValida || !usuario.activo) {
        const error = new Error("Las credenciales son inválidas.");
        error.status = 401;
        throw error;
    }

    // respuesta del servicio.
    return {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
    };
};



export const registrarAdministrador = async (dto) => {
    const { nombre, apellido, email, password } = dto;
    const passwordHash = await bcrypt.hash(password, FACTOR_COSTO);
    return prisma.usuario.create({
        data: {
            nombre, apellido, email, passwordHash, activo: true,
            roles: { create: {
                rol: { connect: { nombre: "ADMINISTRADOR" } }
            } }
        },
        select: {
            id: true, nombre: true, apellido: true, email: true, activo: true
        }
    });
};
