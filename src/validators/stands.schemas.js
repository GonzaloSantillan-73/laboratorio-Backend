import { z } from "zod";

export const crearStandSchema = z.object({
    pabellonId: z.number().int().positive("El ID del pabellón debe ser un número entero positivo"),
    sector: z.string().trim().min(1, "El sector es obligatorio"),
    coordenadaId: z.number().int().positive("El ID de la coordenada debe ser un número entero positivo"),
    estado: z.enum(["DISPONIBLE", "OCUPADO"]).default("DISPONIBLE"),
    artesanoId: z.number().int().positive("El ID del artesano debe ser un número entero positivo").optional(),
});

export const actualizarStandSchema = crearStandSchema.partial();

export const consultarStandsSchema = z.object({
    pabellon: z.string().trim().min(1).optional(),
    sector: z.string().trim().min(1).optional(),
    estado: z.enum(["DISPONIBLE", "OCUPADO"]).optional(),
    ordenarPor: z.enum(["pabellonId", "sector", "createdAt"]).default("createdAt"),
    direccion: z.enum(["asc", "desc"]).default("asc"),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
});