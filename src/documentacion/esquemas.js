import { z } from "zod";
import { rubroSchema } from "../validators/rubros.schemas.js";
import {
    iniciarSesionSchema,
    postulacionSchema,
    usuarioSchema,
    registroAdminSchema,
    asignarArtesanoSchema
} from "../validators/usuarios.schemas.js";
import {
    crearArtesanoSchema,
    actualizarArtesanoSchema,
    resolverSolicitudSchema
} from "../validators/artesanos.schemas.js";
import { ProductoSchema } from "../validators/productos.schemas.js";
import { crearStandSchema, actualizarStandSchema } from "../validators/stands.schemas.js";
import { asignarAdministradorSchema } from "../validators/roles.schemas.js";
import { actualizarActivoSchema } from "../validators/estado.schemas.js";

// Opciones para convertir los validadores de Zod a OpenAPI
const opciones = { target: "openapi-3.0", io: "input" };

// ==========================================================
// ESQUEMAS DE ENTRADA (se convierten desde los validadores Zod)
// ==========================================================

export const InicioSesion = {
    ...z.toJSONSchema(iniciarSesionSchema, opciones),
    example: { email: "admin@feria.com", password: "Admin1234" }
};

export const NuevaPostulacion = {
    ...z.toJSONSchema(postulacionSchema, opciones),
    example: {
        nombre: "Laura", apellido: "Gómez", email: "laura@correo.com",
        password: "Clave12345", nombreEmprendimiento: "Cerámica del Valle",
        trayectoria: "10 años trabajando la cerámica", localidadId: "10049010000",
        rubrosIds: [1, 2]
    }
};

export const NuevoUsuario = {
    ...z.toJSONSchema(usuarioSchema, opciones),
    example: {
        nombre: "Juan", apellido: "Pérez", email: "juan@correo.com",
        password: "clave123", rolesIds: [1]
    }
};

export const RegistroAdministrador = {
    ...z.toJSONSchema(registroAdminSchema, opciones),
    example: { nombre: "Ana", apellido: "López", email: "ana@feria.com", password: "Admin1234" }
};

export const AsignarArtesano = {
    ...z.toJSONSchema(asignarArtesanoSchema, opciones),
    example: {
        usuarioId: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b",
        nombreEmprendimiento: "Tejidos Norteños", trayectoria: "Tejedora desde 2015",
        localidadId: "10049010000", rubrosIds: [3]
    }
};

export const AsignarRol = {
    ...z.toJSONSchema(asignarAdministradorSchema, opciones),
    example: { rol: "ADMINISTRADOR" }
};

export const CambiarActivo = {
    ...z.toJSONSchema(actualizarActivoSchema, opciones),
    example: { activo: false }
};

export const NuevoArtesano = {
    ...z.toJSONSchema(crearArtesanoSchema, opciones),
    example: {
        usuarioId: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b",
        nombreEmprendimiento: "Cerámica del Valle", trayectoria: "10 años trabajando la cerámica",
        localidadId: "10049010000", rubrosIds: [1, 2]
    }
};

export const ActualizarArtesano = {
    ...z.toJSONSchema(actualizarArtesanoSchema, opciones),
    example: { trayectoria: "12 años trabajando la cerámica" }
};

export const ResolverSolicitud = {
    ...z.toJSONSchema(resolverSolicitudSchema, opciones),
    example: { estado: "APROBADO" }
};

export const NuevoProducto = {
    ...z.toJSONSchema(ProductoSchema, opciones),
    example: { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: 15000, stock: 5 }
};

export const NuevoStand = {
    ...z.toJSONSchema(crearStandSchema, opciones),
    example: { pabellonId: 1, sector: "A", coordenadaId: 4, estado: "DISPONIBLE" }
};

export const ActualizarStand = {
    ...z.toJSONSchema(actualizarStandSchema, opciones),
    example: { estado: "OCUPADO", artesanoId: 2 }
};

export const NuevoRubro = {
    ...z.toJSONSchema(rubroSchema, opciones),
    example: { nombre: "Artesanías en Cuero" }
};

// ==========================================================
// ESQUEMAS DE RESPUESTA (no tienen validador Zod, se escriben a mano)
// ==========================================================

// Estructura para los errores de la API
export const ErrorApi = {
    type: "object",
    required: ["mensaje"],
    properties: {
        mensaje: { type: "string" },
        errores: {
            type: "array",
            description: "Detalle de Zod. Solo aparece en algunos errores de validación.",
            items: { type: "object" }
        }
    }
};

// Datos de paginación que devuelven los listados
export const Paginacion = {
    type: "object",
    required: ["pagina", "limite", "total", "totalPaginas"],
    properties: {
        pagina: { type: "integer" },
        limite: { type: "integer" },
        total: { type: "integer" },
        totalPaginas: { type: "integer" }
    }
};

// ---------- Usuarios ----------

export const Usuario = {
    type: "object",
    required: ["id", "nombre", "apellido", "email", "activo", "roles"],
    properties: {
        id: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        activo: { type: "boolean" },
        roles: { type: "array", items: { type: "string" } }
    },
    example: {
        id: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b", nombre: "Juan", apellido: "Pérez",
        email: "juan@correo.com", activo: true, roles: ["ADMINISTRADOR"]
    }
};

// Al crear o modificar, los roles vuelven con otra forma: [{ rol: { nombre } }]
export const UsuarioGuardado = {
    type: "object",
    required: ["id", "nombre", "apellido", "email", "activo", "roles"],
    properties: {
        id: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        activo: { type: "boolean" },
        roles: {
            type: "array",
            items: {
                type: "object",
                properties: { rol: { type: "object", properties: { nombre: { type: "string" } } } }
            }
        }
    },
    example: {
        id: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b", nombre: "Juan", apellido: "Pérez",
        email: "juan@correo.com", activo: true, roles: [{ rol: { nombre: "ADMINISTRADOR" } }]
    }
};

export const ListadoUsuarios = {
    type: "object",
    required: ["usuarios", "paginacion"],
    properties: {
        usuarios: { type: "array", items: { $ref: "#/components/schemas/Usuario" } },
        paginacion: { $ref: "#/components/schemas/Paginacion" }
    }
};

export const MiUsuario = {
    type: "object",
    required: ["usuario"],
    properties: {
        usuario: { $ref: "#/components/schemas/Usuario" }
    }
};

export const SesionIniciada = {
    type: "object",
    required: ["mensaje", "token", "usuario"],
    properties: {
        mensaje: { type: "string" },
        token: { type: "string" },
        usuario: {
            type: "object",
            required: ["id", "nombre", "apellido", "email"],
            properties: {
                id: { type: "string", format: "uuid" },
                nombre: { type: "string" },
                apellido: { type: "string" },
                email: { type: "string", format: "email" }
            }
        }
    },
    example: {
        mensaje: "Credenciales verificadas correctamente.",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        usuario: {
            id: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b", nombre: "Ana",
            apellido: "López", email: "admin@feria.com"
        }
    }
};

export const PostulacionCreada = {
    type: "object",
    required: ["id", "nombre", "apellido", "email", "activo", "artesano"],
    properties: {
        id: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        activo: { type: "boolean" },
        artesano: {
            type: "object",
            properties: {
                id: { type: "integer" },
                estadoSolicitud: { type: "string", enum: ["PENDIENTE"] }
            }
        }
    },
    example: {
        id: "8a1c2d3e-4f5a-4b6c-8d7e-9f0a1b2c3d4e", nombre: "Laura", apellido: "Gómez",
        email: "laura@correo.com", activo: true, artesano: { id: 7, estadoSolicitud: "PENDIENTE" }
    }
};

export const AdministradorCreado = {
    type: "object",
    required: ["id", "nombre", "apellido", "email", "activo"],
    properties: {
        id: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        activo: { type: "boolean" }
    }
};

export const UsuarioActivo = {
    type: "object",
    required: ["id", "activo"],
    properties: {
        id: { type: "string", format: "uuid" },
        activo: { type: "boolean" }
    },
    example: { id: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b", activo: false }
};

export const RolAsignado = {
    type: "object",
    required: ["mensaje"],
    properties: { mensaje: { type: "string" } },
    example: { mensaje: "Rol ADMINISTRADOR asignado." }
};

// ---------- Artesanos ----------

export const Artesano = {
    type: "object",
    required: ["id", "usuarioId", "nombreEmprendimiento", "trayectoria", "localidadId", "estadoSolicitud"],
    properties: {
        id: { type: "integer" },
        usuarioId: { type: "string", format: "uuid" },
        nombreEmprendimiento: { type: "string" },
        trayectoria: { type: "string" },
        localidadId: { type: "string" },
        estadoSolicitud: { type: "string", enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "MODIFICACIONES"] },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        usuario: {
            type: "object",
            description: "Se incluye en el detalle, el listado y la creación.",
            properties: {
                id: { type: "string", format: "uuid" },
                nombre: { type: "string" },
                apellido: { type: "string" },
                email: { type: "string" }
            }
        },
        rubros: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    artesanoId: { type: "integer" },
                    rubroId: { type: "integer" },
                    rubro: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" } } }
                }
            }
        }
    },
    example: {
        id: 2, usuarioId: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b",
        nombreEmprendimiento: "Cerámica del Valle", trayectoria: "10 años trabajando la cerámica",
        localidadId: "10049010000", estadoSolicitud: "APROBADO",
        createdAt: "2026-10-20T12:00:00.000Z", updatedAt: "2026-10-20T12:00:00.000Z",
        usuario: { id: "3f2b8c1e-5d4a-4b6e-9a1f-2c3d4e5f6a7b", nombre: "Laura", apellido: "Gómez", email: "laura@correo.com" },
        rubros: [{ artesanoId: 2, rubroId: 1, rubro: { id: 1, nombre: "Cerámica" } }]
    }
};

export const ListadoArtesanos = {
    type: "object",
    required: ["artesanos", "paginacion"],
    properties: {
        artesanos: { type: "array", items: { $ref: "#/components/schemas/Artesano" } },
        paginacion: { $ref: "#/components/schemas/Paginacion" }
    }
};

export const MiArtesano = {
    type: "object",
    required: ["id", "nombreEmprendimiento", "trayectoria", "estadoSolicitud"],
    properties: {
        id: { type: "integer" },
        nombreEmprendimiento: { type: "string" },
        trayectoria: { type: "string" },
        estadoSolicitud: { type: "string" },
        localidad: {
            type: "object",
            properties: {
                nombre: { type: "string" },
                provincia: { type: "object", properties: { nombre: { type: "string" } } }
            }
        },
        rubros: {
            type: "array",
            items: {
                type: "object",
                properties: { rubro: { type: "object", properties: { nombre: { type: "string" } } } }
            }
        }
    }
};

export const SolicitudResuelta = {
    type: "object",
    required: ["id", "nombreEmprendimiento", "estadoSolicitud"],
    properties: {
        id: { type: "integer" },
        nombreEmprendimiento: { type: "string" },
        estadoSolicitud: { type: "string", enum: ["APROBADO", "RECHAZADO", "MODIFICACIONES"] }
    },
    example: { id: 7, nombreEmprendimiento: "Cerámica del Valle", estadoSolicitud: "APROBADO" }
};

export const ArtesanoEliminado = {
    type: "object",
    required: ["message", "artesano"],
    properties: {
        message: { type: "string" },
        artesano: { $ref: "#/components/schemas/Artesano" }
    }
};

// ---------- Productos ----------

export const Producto = {
    type: "object",
    required: ["id", "nombre", "descripcion", "precio", "stock", "activo", "artesanoId"],
    properties: {
        id: { type: "integer" },
        nombre: { type: "string" },
        descripcion: { type: "string" },
        precio: { type: "number" },
        stock: { type: "integer" },
        activo: { type: "boolean" },
        artesanoId: { type: "integer" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        artesano: {
            type: "object",
            description: "Se incluye en el detalle, la creación y la modificación."
        }
    },
    example: {
        id: 5, nombre: "Vasija de barro", descripcion: "Vasija pintada a mano",
        precio: 15000, stock: 5, activo: true, artesanoId: 2,
        createdAt: "2026-10-20T12:00:00.000Z", updatedAt: "2026-10-20T12:00:00.000Z"
    }
};

export const ListadoProductos = {
    type: "object",
    required: ["productos", "paginacion"],
    properties: {
        productos: { type: "array", items: { $ref: "#/components/schemas/Producto" } },
        paginacion: { $ref: "#/components/schemas/Paginacion" }
    }
};

export const ProductoActivo = {
    type: "object",
    required: ["id", "nombre", "activo"],
    properties: {
        id: { type: "integer" },
        nombre: { type: "string" },
        activo: { type: "boolean" }
    },
    example: { id: 5, nombre: "Vasija de barro", activo: false }
};

// ---------- Stands ----------

export const Stand = {
    type: "object",
    required: ["id", "pabellonId", "sector", "coordenadaId", "estado"],
    properties: {
        id: { type: "integer" },
        pabellonId: { type: "integer" },
        sector: { type: "string" },
        coordenadaId: { type: "integer" },
        estado: { type: "string", enum: ["DISPONIBLE", "OCUPADO"] },
        artesanoId: { type: "integer", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        pabellon: { type: "object", properties: { id: { type: "integer" }, nombre: { type: "string" } } },
        coordenada: {
            type: "object",
            properties: { id: { type: "integer" }, x: { type: "integer" }, y: { type: "integer" } }
        },
        artesano: { type: "object", nullable: true }
    },
    example: {
        id: 3, pabellonId: 1, sector: "A", coordenadaId: 4, estado: "DISPONIBLE", artesanoId: null,
        createdAt: "2026-10-20T12:00:00.000Z", updatedAt: "2026-10-20T12:00:00.000Z",
        pabellon: { id: 1, nombre: "Pabellón Norte" }, coordenada: { id: 4, x: 2, y: 3 }, artesano: null
    }
};

export const ListadoStands = {
    type: "object",
    required: ["stands", "paginacion"],
    properties: {
        stands: { type: "array", items: { $ref: "#/components/schemas/Stand" } },
        paginacion: { $ref: "#/components/schemas/Paginacion" }
    }
};

export const StandEliminado = {
    type: "object",
    required: ["mensaje", "stand"],
    properties: {
        mensaje: { type: "string" },
        stand: { $ref: "#/components/schemas/Stand" }
    }
};

// ---------- Rubros ----------

export const RubroCreado = {
    type: "object",
    required: ["id", "nombre"],
    properties: {
        id: { type: "integer" },
        nombre: { type: "string" }
    },
    example: {
        id: 1,
        nombre: "Artesanías en Cuero"
    }
};
