// Genera la colección de Postman a partir de swagger-output.json.
// Uso: npm run postman   (correr antes "npm run docs" si cambiaron las rutas)
//
// Crea postman/Feria-Artesanos.postman_collection.json con todos los valores escritos
// (sin variables {{ }}). Lo que solo existe después de ejecutar un request
// (tokens e ids) queda como texto PEGAR_... para reemplazar a mano.
//
// Los emails, el nombre del pabellón y las coordenadas llevan un número que cambia
// cada vez que se corre el script: si ya se usaron, volver a correr "npm run postman".

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ruta = (archivo) => fileURLToPath(new URL(archivo, import.meta.url));
const swagger = JSON.parse(readFileSync(ruta("../swagger-output.json"), "utf8"));
const esquemas = swagger.components?.schemas ?? {};

if (existsSync(ruta("../.env"))) process.loadEnvFile(ruta("../.env"));

// ==========================================================
// Valores fijos que se escriben en la colección
// ==========================================================

const BASE_URL = "http://localhost:3000";
const LOCALIDAD_ID = "10049030000"; // San Fernando del Valle de Catamarca
const SUFIJO = Date.now().toString().slice(-6); // para que los datos únicos no se repitan

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@feria.com";
const ADMIN_PASSWORD = "ESCRIBIR_CONTRASEÑA_ADMIN"; // no se escribe la real: la colección se sube a git

const EMAIL_POSTULANTE = `laura.gomez${SUFIJO}@correo.com`;
const PASSWORD_POSTULANTE = "Clave12345";
const NOMBRE_PABELLON = `Pabellón Norte ${SUFIJO}`;
const COORD = { x: 1000 + Number(SUFIJO.slice(0, 3)), y: 1000 + Number(SUFIJO.slice(3)) };
const COORD_LIBRE = { x: COORD.x + 1, y: COORD.y + 1 };

// Textos para reemplazar a mano con lo que devuelve la API
const TOKEN_ADMIN = "PEGAR_TOKEN_ADMIN";
const TOKEN_ARTESANO = "PEGAR_TOKEN_ARTESANO";

// ==========================================================
// Helpers para armar requests de Postman
// ==========================================================

const testEstado = (codigo) => [
    `pm.test("Responde ${codigo}", () => pm.response.to.have.status(${codigo}));`
];

const url = (camino, query = []) => {
    const limpio = camino.replace(/^\//, "");
    const activos = query.filter(q => !q.disabled);
    return {
        raw: `${BASE_URL}/${limpio}` + (activos.length ? "?" + activos.map(q => `${q.key}=${q.value}`).join("&") : ""),
        protocol: "http",
        host: ["localhost"],
        port: "3000",
        path: limpio.split("/").filter(Boolean),
        ...(query.length ? { query } : {})
    };
};

const auth = (token) => token
    ? { type: "bearer", bearer: [{ key: "token", value: token, type: "string" }] }
    : { type: "noauth" };

const request = ({ nombre, metodo, camino, token, body, query, codigo, descripcion }) => ({
    name: nombre,
    event: codigo ? [{ listen: "test", script: { type: "text/javascript", exec: testEstado(codigo) } }] : [],
    request: {
        method: metodo,
        auth: auth(token),
        header: body !== undefined ? [{ key: "Content-Type", value: "application/json" }] : [],
        ...(body !== undefined ? {
            body: {
                mode: "raw",
                raw: typeof body === "string" ? body : JSON.stringify(body, null, 2),
                options: { raw: { language: "json" } }
            }
        } : {}),
        url: url(camino, query),
        ...(descripcion ? { description: descripcion } : {})
    }
});

// ==========================================================
// 1) Colección completa: un request por endpoint de Swagger
// ==========================================================

// Qué va en el {id} de cada recurso
const idPorRecurso = {
    artesanos: "PEGAR_ID_ARTESANO", productos: "PEGAR_ID_PRODUCTO", stands: "PEGAR_ID_STAND",
    usuarios: "PEGAR_ID_USUARIO", pabellones: "PEGAR_ID_PABELLON", coordenadas: "PEGAR_ID_COORDENADA",
    roles: "1", rubros: "1", consultas: "1", localidades: LOCALIDAD_ID
};

// Bodies para los endpoints que no tienen requestBody documentado en Swagger
// (y para los que tienen datos únicos que fallarían la segunda vez)
const bodiesExtra = {
    "POST /api/roles/": { nombre: `ROL_${SUFIJO}` },
    "PUT /api/roles/{id}": { nombre: `ROL_EDITADO_${SUFIJO}` },
    "POST /api/rubros/": { nombre: `Rubro ${SUFIJO}` },
    "PUT /api/rubros/{id}": { nombre: `Rubro editado ${SUFIJO}` },
    "POST /api/pabellones/": { nombre: `Pabellón ${SUFIJO}` },
    "PUT /api/pabellones/{id}": { nombre: `Pabellón editado ${SUFIJO}` },
    "POST /api/coordenadas/": { x: COORD.x + 10, y: COORD.y + 10 },
    "PUT /api/coordenadas/{id}": { x: COORD.x + 20, y: COORD.y + 20 },
    "POST /api/consultas/": { terminoBusqueda: "cerámica", filtroAplicado: "rubro" },
    "POST /api/usuarios/postulacion": {
        nombre: "Laura", apellido: "Gómez", email: `laura${SUFIJO}@correo.com`, password: PASSWORD_POSTULANTE,
        nombreEmprendimiento: "Cerámica del Valle", trayectoria: "10 años trabajando la cerámica",
        localidadId: LOCALIDAD_ID, rubrosIds: [1, 2]
    },
    "POST /api/usuarios/registro-administrador": { nombre: "Ana", apellido: "López", email: `admin${SUFIJO}@feria.com`, password: "Admin1234" },
    "POST /api/usuarios/": { nombre: "Juan", apellido: "Pérez", email: `juan${SUFIJO}@correo.com`, password: "clave123", rolesIds: [1] },
    "PUT /api/usuarios/{id}": { nombre: "Juan", apellido: "Pérez", email: `juan.editado${SUFIJO}@correo.com`, password: "clave123", rolesIds: [1] },
    "POST /api/usuarios/login": { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    "POST /api/usuarios/asignar-artesano": '{\n  "usuarioId": "PEGAR_ID_USUARIO",\n  "nombreEmprendimiento": "Tejidos Norteños",\n  "trayectoria": "Tejedora desde 2015",\n  "localidadId": "' + LOCALIDAD_ID + '",\n  "rubrosIds": [3]\n}',
    "POST /api/artesanos/": '{\n  "usuarioId": "PEGAR_ID_USUARIO",\n  "nombreEmprendimiento": "Cerámica del Valle",\n  "trayectoria": "10 años trabajando la cerámica",\n  "localidadId": "' + LOCALIDAD_ID + '",\n  "rubrosIds": [1, 2]\n}',
    "PUT /api/productos/{id}": { nombre: "Vasija de barro grande", descripcion: "Vasija pintada a mano", precio: 18000, stock: 3 },
    "POST /api/stands/": '{\n  "pabellonId": PEGAR_ID_PABELLON,\n  "sector": "A",\n  "coordenadaId": PEGAR_ID_COORDENADA\n}',
    "PUT /api/stands/{id}": { sector: "B" }
};

// Qué token usa cada endpoint (sale de la descripción / resumen de Swagger)
const tokenPara = (op) => {
    const texto = `${op.summary ?? ""} ${op.description ?? ""}`;
    if (/rol ARTESANO/.test(texto)) return TOKEN_ARTESANO;
    if (/^Público/.test(op.description ?? "")) return null;
    if (/JWT|ADMINISTRADOR/.test(texto)) return TOKEN_ADMIN;
    return null; // GET públicos sin descripción (rubros, roles, pabellones, coordenadas, ubicaciones)
};

const resolverRef = (schema) => schema?.$ref ? esquemas[schema.$ref.split("/").pop()] : schema;

const valorEjemplo = (p) => {
    const s = p?.schema;
    if (!s) return "";
    if (s.example !== undefined) return String(s.example);
    if (s.enum) return String(s.enum[0]);
    if (s.default !== undefined) return String(s.default);
    return "";
};

const carpetas = new Map();
for (const [camino, operaciones] of Object.entries(swagger.paths)) {
    for (const [metodo, op] of Object.entries(operaciones)) {
        const recurso = camino.split("/")[2];
        const carpeta = op.tags?.[0] ?? recurso.charAt(0).toUpperCase() + recurso.slice(1);
        const clave = `${metodo.toUpperCase()} ${camino}`;

        const caminoPostman = camino
            .replace("{id}", idPorRecurso[recurso] ?? "1")
            .replace("{rol}", "ADMINISTRADOR");

        const query = (op.parameters ?? [])
            .filter(p => p.in === "query")
            .map(p => ({ key: p.name, value: valorEjemplo(p), disabled: true, description: p.description }));

        let body = bodiesExtra[clave];
        if (body === undefined && op.requestBody) {
            body = resolverRef(op.requestBody.content?.["application/json"]?.schema)?.example ?? {};
        }

        if (!carpetas.has(carpeta)) carpetas.set(carpeta, []);
        carpetas.get(carpeta).push(request({
            nombre: op.summary ?? clave,
            metodo: metodo.toUpperCase(),
            camino: caminoPostman,
            token: tokenPara(op),
            body,
            query,
            descripcion: op.description
        }));
    }
}

// ==========================================================
// 2) Flujos para la defensa (camino feliz + casos de error)
// ==========================================================

const loginAdmin = () => request({
    nombre: "✅ 200 - Login administrador (copiar el token)",
    metodo: "POST", camino: "/api/usuarios/login",
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    codigo: 200,
    descripcion: "Escribir la contraseña del admin. Copiar el token de la respuesta y pegarlo donde dice PEGAR_TOKEN_ADMIN (pestaña Authorization)."
});

const postulacionValida = {
    nombre: "Laura", apellido: "Gómez", email: EMAIL_POSTULANTE, password: PASSWORD_POSTULANTE,
    nombreEmprendimiento: "Cerámica del Valle", trayectoria: "10 años trabajando la cerámica",
    localidadId: LOCALIDAD_ID, rubrosIds: [1, 2]
};

const producto = { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: 15000, stock: 5 };

const flujoPostulacion = {
    name: "01 - Flujo crítico: Postulación → Aprobación → Producto",
    description: "Una persona se postula como artesano (queda PENDIENTE) y no puede cargar productos hasta que el administrador aprueba la solicitud; al aprobarla recibe el rol ARTESANO. Ejecutar en orden.\n\nReemplazar a mano: PEGAR_TOKEN_ADMIN, PEGAR_TOKEN_ARTESANO, PEGAR_ID_ARTESANO y PEGAR_ID_PRODUCTO con los valores de las respuestas.",
    item: [
        loginAdmin(),
        request({
            nombre: "❌ 400 - Postulación con datos inválidos",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: { nombre: "L", apellido: "Gómez", email: "no-es-un-email", password: "123", nombreEmprendimiento: "", trayectoria: "x", localidadId: "abc", rubrosIds: [] },
            codigo: 400
        }),
        request({
            nombre: "❌ 404 - Postulación con rubro inexistente",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: { ...postulacionValida, email: `rubro.inexistente${SUFIJO}@correo.com`, rubrosIds: [99999] },
            codigo: 404
        }),
        request({
            nombre: "✅ 201 - Postularse como artesano (copiar artesano.id)",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: postulacionValida,
            codigo: 201,
            descripcion: "Queda en estado PENDIENTE. Copiar artesano.id de la respuesta: se usa en lugar de PEGAR_ID_ARTESANO."
        }),
        request({
            nombre: "❌ 409 - Postulación con email repetido",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: postulacionValida,
            codigo: 409
        }),
        request({
            nombre: "❌ 401 - Login con contraseña incorrecta",
            metodo: "POST", camino: "/api/usuarios/login",
            body: { email: EMAIL_POSTULANTE, password: "incorrecta" },
            codigo: 401
        }),
        request({
            nombre: "✅ 200 - Login del postulante (copiar el token)",
            metodo: "POST", camino: "/api/usuarios/login",
            body: { email: EMAIL_POSTULANTE, password: PASSWORD_POSTULANTE },
            codigo: 200,
            descripcion: "Copiar el token de la respuesta y pegarlo donde dice PEGAR_TOKEN_ARTESANO."
        }),
        request({
            nombre: "❌ 403 - Cargar producto con la solicitud PENDIENTE",
            metodo: "POST", camino: "/api/productos", token: TOKEN_ARTESANO,
            body: producto,
            codigo: 403
        }),
        request({
            nombre: "❌ 401 - Ver solicitudes sin token",
            metodo: "GET", camino: "/api/artesanos/solicitudes",
            codigo: 401
        }),
        request({
            nombre: "❌ 403 - Ver solicitudes con token de postulante",
            metodo: "GET", camino: "/api/artesanos/solicitudes", token: TOKEN_ARTESANO,
            codigo: 403
        }),
        request({
            nombre: "✅ 200 - Admin lista solicitudes PENDIENTES",
            metodo: "GET", camino: "/api/artesanos/solicitudes", token: TOKEN_ADMIN,
            query: [{ key: "estadoSolicitud", value: "PENDIENTE" }, { key: "ordenarPor", value: "createdAt" }, { key: "direccion", value: "desc" }],
            codigo: 200
        }),
        request({
            nombre: "❌ 400 - Resolver solicitud con estado inválido",
            metodo: "PATCH", camino: "/api/artesanos/PEGAR_ID_ARTESANO/solicitud", token: TOKEN_ADMIN,
            body: { estado: "ACEPTADO" },
            codigo: 400
        }),
        request({
            nombre: "❌ 404 - Resolver solicitud inexistente",
            metodo: "PATCH", camino: "/api/artesanos/999999/solicitud", token: TOKEN_ADMIN,
            body: { estado: "APROBADO" },
            codigo: 404
        }),
        request({
            nombre: "✅ 200 - Admin aprueba la solicitud (asigna rol ARTESANO)",
            metodo: "PATCH", camino: "/api/artesanos/PEGAR_ID_ARTESANO/solicitud", token: TOKEN_ADMIN,
            body: { estado: "APROBADO" },
            codigo: 200
        }),
        request({
            nombre: "❌ 409 - Aprobar una solicitud ya resuelta",
            metodo: "PATCH", camino: "/api/artesanos/PEGAR_ID_ARTESANO/solicitud", token: TOKEN_ADMIN,
            body: { estado: "APROBADO" },
            codigo: 409
        }),
        request({
            nombre: "❌ 400 - Producto enviando artesanoId en el body",
            metodo: "POST", camino: "/api/productos", token: TOKEN_ARTESANO,
            body: { ...producto, artesanoId: 1 },
            codigo: 400
        }),
        request({
            nombre: "❌ 400 - Producto con precio negativo",
            metodo: "POST", camino: "/api/productos", token: TOKEN_ARTESANO,
            body: { ...producto, precio: -100 },
            codigo: 400
        }),
        request({
            nombre: "✅ 201 - Artesano aprobado carga un producto (copiar id)",
            metodo: "POST", camino: "/api/productos", token: TOKEN_ARTESANO,
            body: producto,
            codigo: 201,
            descripcion: "Copiar el id de la respuesta: se usa en lugar de PEGAR_ID_PRODUCTO."
        }),
        request({
            nombre: "✅ 200 - Mis productos",
            metodo: "GET", camino: "/api/productos/me", token: TOKEN_ARTESANO,
            codigo: 200
        }),
        request({
            nombre: "✅ 200 - El producto se ve en el catálogo público",
            metodo: "GET", camino: "/api/productos/PEGAR_ID_PRODUCTO",
            codigo: 200
        }),
        request({
            nombre: "✅ 204 - Logout del artesano",
            metodo: "POST", camino: "/api/usuarios/logout", token: TOKEN_ARTESANO,
            codigo: 204
        }),
        request({
            nombre: "❌ 401 - Usar el token revocado",
            metodo: "GET", camino: "/api/productos/me", token: TOKEN_ARTESANO,
            codigo: 401
        })
    ]
};

const flujoStands = {
    name: "02 - Flujo alternativo: Asignación de stand",
    description: "El administrador crea un pabellón y una coordenada y asigna un stand al artesano aprobado en el flujo 01. Ejecutar después del flujo 01.\n\nReemplazar a mano: PEGAR_TOKEN_ADMIN, PEGAR_ID_ARTESANO, PEGAR_ID_PABELLON, PEGAR_ID_COORDENADA, PEGAR_ID_OTRA_COORDENADA y PEGAR_ID_STAND.",
    item: [
        loginAdmin(),
        request({
            nombre: "✅ 201 - Crear pabellón (copiar id)",
            metodo: "POST", camino: "/api/pabellones", token: TOKEN_ADMIN,
            body: { nombre: NOMBRE_PABELLON },
            codigo: 201,
            descripcion: "Copiar el id de la respuesta: se usa en lugar de PEGAR_ID_PABELLON."
        }),
        request({
            nombre: "❌ 409 - Pabellón con nombre repetido",
            metodo: "POST", camino: "/api/pabellones", token: TOKEN_ADMIN,
            body: { nombre: NOMBRE_PABELLON },
            codigo: 409
        }),
        request({
            nombre: "✅ 201 - Crear coordenada (copiar id)",
            metodo: "POST", camino: "/api/coordenadas", token: TOKEN_ADMIN,
            body: COORD,
            codigo: 201,
            descripcion: "Copiar el id de la respuesta: se usa en lugar de PEGAR_ID_COORDENADA."
        }),
        request({
            nombre: "❌ 409 - Coordenada repetida",
            metodo: "POST", camino: "/api/coordenadas", token: TOKEN_ADMIN,
            body: COORD,
            codigo: 409
        }),
        request({
            nombre: "❌ 401 - Crear stand sin token",
            metodo: "POST", camino: "/api/stands",
            body: { pabellonId: 1, sector: "A", coordenadaId: 1 },
            codigo: 401
        }),
        request({
            nombre: "❌ 400 - Stand con datos inválidos",
            metodo: "POST", camino: "/api/stands", token: TOKEN_ADMIN,
            body: { pabellonId: -1, sector: "", coordenadaId: "abc", estado: "LIBRE" },
            codigo: 400
        }),
        request({
            nombre: "❌ 400 - Stand enviando el estado (lo calcula la API)",
            metodo: "POST", camino: "/api/stands", token: TOKEN_ADMIN,
            body: '{\n  "pabellonId": PEGAR_ID_PABELLON,\n  "sector": "A",\n  "coordenadaId": PEGAR_ID_COORDENADA,\n  "estado": "DISPONIBLE",\n  "artesanoId": PEGAR_ID_ARTESANO\n}',
            codigo: 400
        }),
        request({
            nombre: "❌ 404 - Stand en pabellón inexistente",
            metodo: "POST", camino: "/api/stands", token: TOKEN_ADMIN,
            body: '{\n  "pabellonId": 999999,\n  "sector": "A",\n  "coordenadaId": PEGAR_ID_COORDENADA\n}',
            codigo: 404
        }),
        request({
            nombre: "✅ 201 - Crear stand asignado al artesano (queda OCUPADO, copiar id)",
            metodo: "POST", camino: "/api/stands", token: TOKEN_ADMIN,
            body: '{\n  "pabellonId": PEGAR_ID_PABELLON,\n  "sector": "A",\n  "coordenadaId": PEGAR_ID_COORDENADA,\n  "artesanoId": PEGAR_ID_ARTESANO\n}',
            codigo: 201,
            descripcion: "Copiar el id de la respuesta: se usa en lugar de PEGAR_ID_STAND."
        }),
        request({
            nombre: "❌ 409 - Otro stand en la misma coordenada",
            metodo: "POST", camino: "/api/stands", token: TOKEN_ADMIN,
            body: '{\n  "pabellonId": PEGAR_ID_PABELLON,\n  "sector": "B",\n  "coordenadaId": PEGAR_ID_COORDENADA\n}',
            codigo: 409
        }),
        request({
            nombre: "✅ 201 - Crear otra coordenada libre (copiar id)",
            metodo: "POST", camino: "/api/coordenadas", token: TOKEN_ADMIN,
            body: COORD_LIBRE,
            codigo: 201,
            descripcion: "Copiar el id de la respuesta: se usa en lugar de PEGAR_ID_OTRA_COORDENADA."
        }),
        request({
            nombre: "❌ 409 - El artesano ya tiene un stand",
            metodo: "POST", camino: "/api/stands", token: TOKEN_ADMIN,
            body: '{\n  "pabellonId": PEGAR_ID_PABELLON,\n  "sector": "B",\n  "coordenadaId": PEGAR_ID_OTRA_COORDENADA,\n  "artesanoId": PEGAR_ID_ARTESANO\n}',
            codigo: 409
        }),
        request({
            nombre: "✅ 200 - Consultar el stand",
            metodo: "GET", camino: "/api/stands/PEGAR_ID_STAND",
            codigo: 200
        }),
        request({
            nombre: "✅ 200 - Perfil público del artesano (con stand y productos)",
            metodo: "GET", camino: "/api/artesanos/PEGAR_ID_ARTESANO",
            codigo: 200
        })
    ]
};

// ==========================================================
// 3) Armado y escritura del archivo
// ==========================================================

const coleccion = {
    info: {
        name: swagger.info?.title ?? "API Feria de Artesanos",
        description: "Colección generada desde swagger-output.json con `npm run postman`. Todos los valores están escritos, sin variables.\n\n- Los textos PEGAR_... se reemplazan a mano con el token o el id que devuelve el request anterior.\n- ESCRIBIR_CONTRASEÑA_ADMIN se reemplaza por la contraseña del administrador.\n- Las carpetas 01 y 02 son los flujos de la defensa: ejecutarlas en orden.\n- Si los emails o nombres ya se usaron, volver a correr `npm run postman` y reimportar.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
        flujoPostulacion,
        flujoStands,
        ...[...carpetas].map(([name, item]) => ({ name, item }))
    ]
};

const carpetaSalida = ruta("../postman/");
mkdirSync(carpetaSalida, { recursive: true });
const salida = JSON.stringify(coleccion, null, 2);
if (salida.includes("{{")) throw new Error("La colección quedó con variables {{ }}.");
writeFileSync(carpetaSalida + "Feria-Artesanos.postman_collection.json", salida);

const total = coleccion.item.reduce((n, c) => n + c.item.length, 0);
console.log(`Colección generada: postman/Feria-Artesanos.postman_collection.json (${total} requests)`);
console.log(`Email del postulante para la defensa: ${EMAIL_POSTULANTE}`);
