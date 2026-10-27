import { z } from "zod";

export const crearArtesanoSchema = z.object({
    localidadId: z.string().regex(/^\d+$/, "El ID de la localidad debe tener solo números"),
    nombreEmprendimiento: z.string().trim().min(1, "El nombre del emprendimiento es obligatorio"),
    rubrosIds: z.array(z.number().int('El rubro debe ser un número entero').positive('El rubro debe ser un número positivo')).min(1, 'Debe tener al menos un rubro'),
    trayectoria: z.string().trim().min(1, "La trayectoria es obligatoria"),
    usuarioId: z.uuid("El ID de usuario no es válido"),
});

export const actualizarArtesanoSchema = crearArtesanoSchema.partial()

export const consultarArtesanosSchema = z.object({
    localidad: z.string().trim().min(1).optional(),
    rubro: z.string().trim().min(1).optional(),
    estadoSolicitud: z.enum(["PENDIENTE", "APROBADO", "RECHAZADO", "MODIFICACIONES"]).optional(),
    ordenarPor: z.enum(["nombreEmprendimiento", "createdAt", "localidadId"]).default("createdAt"),
    direccion: z.enum(["asc", "desc"]).default("asc"),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
});
export const resolverSolicitudSchema = z
    .object({ estado: z.enum(["APROBADO", "RECHAZADO", "MODIFICACIONES"]) })
    .strict();
