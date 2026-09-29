import prisma from '../config/prisma.js';

export const obtenerArtesanos = async (req, res, next) => {
    try {
        // 1. Consultar todos los artesanos en la base de datos
        // 2. Incluir relaciones con usuario, productos y stands asociados
        const artesanos = await prisma.artesano.findMany({
            include: {
                usuario: true,
                productos: true,
                stand: true
            }
        });
        
        // 3. Retornar la lista completa de artesanos en formato JSON
        return res.json(artesanos);
    } catch (error) {
        // 4. Derivar cualquier error imprevisto al middleware centralizado
        return res.status(500).json({ mensaje: "Error al obtener los artesanos", error: error.message });
    }
};


export const obtenerArtesanosPorId = async (req, res, next) => {
    try {
        // 1. Extraer y convertir el ID recibido en los parámetros de la ruta
        const { id } = req.params;
        
        // 2. Buscar el artesano específico incluyendo sus datos relacionados
        const artesano = await prisma.artesano.findUnique({
            where: { id: parseInt(id) },
            include: {
                usuario: true,
                productos: true,
                stand: true
            }
        });

        // 3. Validar si el artesano existe en la base de datos
        if (!artesano) {
            const error = new Error(`El artesano con el id ${id} no existe`);
            error.status = 404;
            return next(error);
        }

        // 4. Retornar los datos del artesano encontrado
        return res.json(artesano);
    } catch (error) {
        return next(error);
    }
};


export const crearArtesano = async (req, res, next) => {
    try {
        // 1. Extraer los datos enviados en el cuerpo de la petición
        const { localidad, nombreEmprendimiento, rubro, trayectoria, usuarioId } = req.body;

        // 2. Verificar que el usuario vinculado realmente exista
        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: Number(usuarioId) }
        });
        if (!usuarioExiste) {
            const error = new Error(`El usuario con el id ${usuarioId} no existe`);
            error.status = 400;
            return next(error);
        }

        // 3. Crear el nuevo artesano asignando el estado inicial PENDIENTE
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

        // 4. Responder con el estado 201 y los datos del artesano creado
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
        // 1. Obtener el ID del artesano y los nuevos datos a actualizar
        const idArtesano = Number(req.params.id)
        const { localidad, nombreEmprendimiento, rubro, trayectoria } = req.body;

        // 2. Ejecutar la actualización de los campos en la base de datos
        const artesanoActualizado = await prisma.artesano.update({
            where: { id: idArtesano },
            data: {
                localidad: localidad.trim(),
                nombreEmprendimiento: nombreEmprendimiento.trim(),
                rubro: rubro.trim(),
                trayectoria: trayectoria.trim()
            }
        })

        // 3. Devolver la información actualizada del artesano
        return res.json(artesanoActualizado)
    } catch (error) {
        // 4. Capturar error de registro no encontrado de Prisma y retornar 404
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
        // 1. Obtener y convertir el ID del artesano a eliminar
        const id = Number(req.params.id)

        // 2. Ejecutar la eliminación del registro en la base de datos
        const artesanoEliminado = await prisma.artesano.delete({
            where: {id: id}
        })

        // 3. Retornar mensaje de éxito junto con los datos del artesano borrado
        return res.json({
            message: 'Artesano eliminado',
            artesano: artesanoEliminado
        })
    } catch (error) {
        // 4. Manejar el error si el artesano a eliminar no se encuentra en la base de datos
        if (error.code === "P2025") {
            const errorNoEncontrado = new Error("El artesano no existe.");
            errorNoEncontrado.status = 404;
            return next(errorNoEncontrado);
        }
        return next(error);
    }
}