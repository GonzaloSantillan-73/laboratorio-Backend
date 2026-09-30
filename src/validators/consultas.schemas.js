import { z } from "zod";

export const crearConsultaSchema = z.object({
    terminoBusqueda: z.string().trim().min(1).optional(),
    filtroAplicado: z.string().trim().min(1).optional(),
    usuarioId: z.number().int().positive().optional(),
}).refine(data => data.terminoBusqueda || data.filtroAplicado, {
    message: "Debe proporcionar al menos un término de búsqueda o un filtro aplicado.",
});

export const consultarConsultasSchema = z.object({
    terminoBusqueda: z.string().trim().min(1).optional(),
    filtroAplicado: z.string().trim().min(1).optional(),
    ordenarPor: z.enum(["createdAt", "terminoBusqueda"]).default("createdAt"),
    direccion: z.enum(["asc", "desc"]).default("desc"),
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().min(1).max(50).default(10),
});