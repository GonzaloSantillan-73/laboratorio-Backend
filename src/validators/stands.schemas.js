import { z } from "zod";

export const crearStandSchema = z.object({
    pabellon: z.string().trim().min(1, "El pabellón es obligatorio"),
    sector: z.string().trim().min(1, "El sector es obligatorio"),
    coordenadaX: z.number().int("La coordenada X debe ser un número entero"),
    coordenadaY: z.number().int("La coordenada Y debe ser un número entero"),
    estado: z.enum(["DISPONIBLE", "OCUPADO"]).default("DISPONIBLE"),
    artesanoId: z.number().int().positive("El ID del artesano debe ser un número entero positivo").optional(),
});

export const actualizarStandSchema = crearStandSchema.partial();

export const consultarStandsSchema = z.object({
    pabellon: z.string().trim().min(1).optional(),
    sector: z.string().trim().min(1).optional(),
    estado: z.enum(["DISPONIBLE", "OCUPADO", "RESERVADO"]).optional(),
    ordenarPor: z.enum(["pabellon", "sector", "createdAt"]).default("createdAt"),
    direccion: z.enum(["asc", "desc"]).default("asc"),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
});