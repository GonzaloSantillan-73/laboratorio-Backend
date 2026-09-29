import { z } from "zod";

export const crearArtesanoSchema = z.object({
    localidad: z.string().trim().min(1, "La localidad es obligatoria"),
    nombreEmprendimiento: z.string().trim().min(1, "El nombre del emprendimiento es obligatorio"),
    rubro: z.string().trim().min(1, "El rubro es obligatorio"),
    trayectoria: z.string().trim().min(1, "La trayectoria es obligatoria"),
    usuarioId: z.number().int().positive("El ID de usuario debe ser un número entero positivo"),
});

export const actualizarArtesanoSchema = crearArtesanoSchema.partial()

export const consultarArtesanosSchema = z.object({
    localidad: z.string().trim().min(1).optional(),
    rubro: z.string().trim().min(1).optional(),
    estadoSolicitud: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO"]).optional(),
    ordenarPor: z.enum(["nombreEmprendimiento", "createdAt", "localidad"]).default("createdAt"),
    direccion: z.enum(["asc", "desc"]).default("asc"),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
});