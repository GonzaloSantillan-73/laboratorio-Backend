// Genera la colección de Postman a partir de swagger-output.json.
// Uso: npm run postman   (correr antes "npm run docs" si cambiaron las rutas)
//
// Crea:
//   postman/Feria-Artesanos.postman_collection.json  -> colección completa + flujos de la defensa
//   postman/Local.postman_environment.json           -> credenciales del admin tomadas del .env (no se sube a git)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ruta = (archivo) => fileURLToPath(new URL(archivo, import.meta.url));
const swagger = JSON.parse(readFileSync(ruta("../swagger-output.json"), "utf8"));
const esquemas = swagger.components?.schemas ?? {};

// ==========================================================
// Helpers para armar requests de Postman
// ==========================================================

const script = (lineas) => [{ listen: "test", script: { type: "text/javascript", exec: lineas } }];
const preRequest = (lineas) => ({ listen: "prerequest", script: { type: "text/javascript", exec: lineas } });

const testEstado = (codigo) => [
    `pm.test("Responde ${codigo}", () => pm.response.to.have.status(${codigo}));`
];

// Guarda una variable de la colección a partir del JSON de la respuesta
const guardar = (variable, expresion) => [
    `if (pm.response.code < 300) {`,
    `    const json = pm.response.json();`,
    `    pm.collectionVariables.set("${variable}", ${expresion});`,
    `}`
];

const url = (camino, query = []) => {
    const limpio = camino.replace(/^\//, "");
    return {
        raw: "{{baseUrl}}/" + limpio + (query.length ? "?" + query.filter(q => !q.disabled).map(q => `${q.key}=${q.value}`).join("&") : ""),
        host: ["{{baseUrl}}"],
        path: limpio.split("/").filter(Boolean),
        ...(query.length ? { query } : {})
    };
};

const auth = (token) => token
    ? { type: "bearer", bearer: [{ key: "token", value: `{{${token}}}`, type: "string" }] }
    : { type: "noauth" };

const request = ({ nombre, metodo, camino, token, body, query, tests = [], pre, descripcion }) => ({
    name: nombre,
    event: [...script(tests), ...(pre ? [preRequest(pre)] : [])],
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

// Variable que se usa para el {id} de cada recurso
const variablePorRecurso = {
    artesanos: "artesanoId", productos: "productoId", stands: "standId", usuarios: "usuarioId",
    roles: "rolId", rubros: "rubroId", pabellones: "pabellonId", coordenadas: "coordenadaId",
    consultas: "consultaId", localidades: "localidadId"
};

// Bodies para los endpoints que no tienen requestBody documentado en Swagger
// (y para los que tienen un nombre único que fallaría la segunda vez)
const bodiesExtra = {
    "POST /api/roles/": '{\n  "nombre": "ROL_{{$timestamp}}"\n}',
    "PUT /api/roles/{id}": '{\n  "nombre": "ROL_EDITADO_{{$timestamp}}"\n}',
    "POST /api/rubros/": '{\n  "nombre": "Rubro {{$timestamp}}"\n}',
    "PUT /api/rubros/{id}": '{\n  "nombre": "Rubro editado {{$timestamp}}"\n}',
    "POST /api/pabellones/": '{\n  "nombre": "Pabellón {{$timestamp}}"\n}',
    "PUT /api/pabellones/{id}": '{\n  "nombre": "Pabellón editado {{$timestamp}}"\n}',
    "POST /api/coordenadas/": '{\n  "x": {{$randomInt}},\n  "y": {{$randomInt}}\n}',
    "PUT /api/coordenadas/{id}": '{\n  "x": {{$randomInt}},\n  "y": {{$randomInt}}\n}',
    "POST /api/consultas/": { terminoBusqueda: "cerámica", filtroAplicado: "rubro" },
    "POST /api/usuarios/postulacion": '{\n  "nombre": "Laura",\n  "apellido": "Gómez",\n  "email": "laura{{$timestamp}}@correo.com",\n  "password": "Clave12345",\n  "nombreEmprendimiento": "Cerámica del Valle",\n  "trayectoria": "10 años trabajando la cerámica",\n  "localidadId": "{{localidadId}}",\n  "rubrosIds": [1, 2]\n}',
    "POST /api/usuarios/registro-administrador": '{\n  "nombre": "Ana",\n  "apellido": "López",\n  "email": "admin{{$timestamp}}@feria.com",\n  "password": "Admin1234"\n}',
    "POST /api/usuarios/": '{\n  "nombre": "Juan",\n  "apellido": "Pérez",\n  "email": "juan{{$timestamp}}@correo.com",\n  "password": "clave123",\n  "rolesIds": [1]\n}',
    "POST /api/usuarios/login": '{\n  "email": "{{adminEmail}}",\n  "password": "{{adminPassword}}"\n}',
    "PUT /api/productos/{id}": { nombre: "Vasija de barro grande", descripcion: "Vasija pintada a mano", precio: 18000, stock: 3 },
    "PUT /api/stands/{id}": { estado: "OCUPADO" }
};

// Qué token usa cada endpoint (sale de la descripción / resumen de Swagger)
const tokenPara = (op) => {
    const texto = `${op.summary ?? ""} ${op.description ?? ""}`;
    if (/rol ARTESANO/.test(texto)) return "tokenArtesano";
    if (/^Público/.test(op.description ?? "")) return null;
    if (/JWT|ADMINISTRADOR/.test(texto)) return "tokenAdmin";
    return null; // GET públicos sin descripción (rubros, roles, pabellones, coordenadas, ubicaciones)
};

const resolverRef = (schema) => {
    if (schema?.$ref) return esquemas[schema.$ref.split("/").pop()];
    return schema;
};

const valorEjemplo = (p) => {
    if (!p?.schema) return "";
    const s = p.schema;
    if (s.example !== undefined) return String(s.example);
    if (s.enum) return String(s.enum[0]);
    if (s.default !== undefined) return String(s.default);
    return "";
};

const recursoDe = (camino) => camino.split("/")[2];

const carpetas = new Map();
for (const [camino, operaciones] of Object.entries(swagger.paths)) {
    for (const [metodo, op] of Object.entries(operaciones)) {
        const recurso = recursoDe(camino);
        const carpeta = op.tags?.[0] ?? recurso.charAt(0).toUpperCase() + recurso.slice(1);
        const clave = `${metodo.toUpperCase()} ${camino}`;

        // {id} -> {{artesanoId}}, {rol} -> ADMINISTRADOR
        const caminoPostman = camino
            .replace("{id}", `{{${variablePorRecurso[recurso] ?? "id"}}}`)
            .replace("{rol}", "ADMINISTRADOR");

        const query = (op.parameters ?? [])
            .filter(p => p.in === "query")
            .map(p => ({ key: p.name, value: valorEjemplo(p), disabled: true, description: p.description }));

        let body = bodiesExtra[clave];
        if (body === undefined && op.requestBody) {
            const schema = resolverRef(op.requestBody.content?.["application/json"]?.schema);
            body = schema?.example ?? {};
        }

        const tests = [];
        if (clave === "POST /api/usuarios/login") tests.push(...guardar("tokenAdmin", "json.token"));
        if (metodo === "post" && variablePorRecurso[recurso] && camino.endsWith("/")) {
            tests.push(...guardar(variablePorRecurso[recurso], "json.id ?? pm.collectionVariables.get(\"" + variablePorRecurso[recurso] + "\")"));
        }

        const item = request({
            nombre: op.summary ?? clave,
            metodo: metodo.toUpperCase(),
            camino: caminoPostman,
            token: tokenPara(op),
            body,
            query,
            tests,
            descripcion: op.description
        });

        if (!carpetas.has(carpeta)) carpetas.set(carpeta, []);
        carpetas.get(carpeta).push(item);
    }
}

// ==========================================================
// 2) Flujos para la defensa (camino feliz + casos de error)
// ==========================================================

const loginAdmin = (nombre = "✅ Login administrador") => request({
    nombre, metodo: "POST", camino: "/api/usuarios/login",
    body: '{\n  "email": "{{adminEmail}}",\n  "password": "{{adminPassword}}"\n}',
    tests: [...testEstado(200), ...guardar("tokenAdmin", "json.token")]
});

const postulacionValida = {
    nombre: "Laura", apellido: "Gómez", email: "{{emailPostulante}}", password: "Clave12345",
    nombreEmprendimiento: "Cerámica del Valle", trayectoria: "10 años trabajando la cerámica",
    localidadId: "{{localidadId}}", rubrosIds: [1, 2]
};

const flujoPostulacion = {
    name: "01 - Flujo crítico: Postulación → Aprobación → Producto",
    description: "Una persona se postula como artesano (queda PENDIENTE), no puede cargar productos hasta que el administrador aprueba la solicitud; al aprobarla recibe el rol ARTESANO y puede cargar productos. Ejecutar en orden.",
    item: [
        loginAdmin(),
        request({
            nombre: "❌ 400 - Postulación con datos inválidos",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: { nombre: "L", apellido: "Gómez", email: "no-es-un-email", password: "123", nombreEmprendimiento: "", trayectoria: "x", localidadId: "abc", rubrosIds: [] },
            tests: testEstado(400)
        }),
        request({
            nombre: "❌ 404 - Postulación con rubro inexistente",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: { ...postulacionValida, email: "rubro{{$timestamp}}@correo.com", rubrosIds: [99999] },
            tests: testEstado(404)
        }),
        request({
            nombre: "✅ 201 - Postularse como artesano (queda PENDIENTE)",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            pre: ['pm.collectionVariables.set("emailPostulante", `artesano${Date.now()}@correo.com`);'],
            body: postulacionValida,
            tests: [
                ...testEstado(201),
                'pm.test("La solicitud queda PENDIENTE", () => pm.expect(pm.response.json().artesano.estadoSolicitud).to.eql("PENDIENTE"));',
                ...guardar("artesanoId", "json.artesano.id"),
                ...guardar("postulanteId", "json.id")
            ]
        }),
        request({
            nombre: "❌ 409 - Postulación con email repetido",
            metodo: "POST", camino: "/api/usuarios/postulacion",
            body: postulacionValida,
            tests: testEstado(409)
        }),
        request({
            nombre: "❌ 401 - Login con contraseña incorrecta",
            metodo: "POST", camino: "/api/usuarios/login",
            body: { email: "{{emailPostulante}}", password: "incorrecta" },
            tests: testEstado(401)
        }),
        request({
            nombre: "✅ 200 - Login del postulante",
            metodo: "POST", camino: "/api/usuarios/login",
            body: { email: "{{emailPostulante}}", password: "Clave12345" },
            tests: [...testEstado(200), ...guardar("tokenArtesano", "json.token")]
        }),
        request({
            nombre: "❌ 403 - Cargar producto con la solicitud PENDIENTE",
            metodo: "POST", camino: "/api/productos", token: "tokenArtesano",
            body: { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: 15000, stock: 5 },
            tests: testEstado(403)
        }),
        request({
            nombre: "❌ 401 - Ver solicitudes sin token",
            metodo: "GET", camino: "/api/artesanos/solicitudes",
            tests: testEstado(401)
        }),
        request({
            nombre: "❌ 403 - Ver solicitudes con token de postulante",
            metodo: "GET", camino: "/api/artesanos/solicitudes", token: "tokenArtesano",
            tests: testEstado(403)
        }),
        request({
            nombre: "✅ 200 - Admin lista solicitudes PENDIENTES",
            metodo: "GET", camino: "/api/artesanos/solicitudes", token: "tokenAdmin",
            query: [{ key: "estadoSolicitud", value: "PENDIENTE" }, { key: "ordenarPor", value: "createdAt" }, { key: "direccion", value: "desc" }],
            tests: testEstado(200)
        }),
        request({
            nombre: "❌ 400 - Resolver solicitud con estado inválido",
            metodo: "PATCH", camino: "/api/artesanos/{{artesanoId}}/solicitud", token: "tokenAdmin",
            body: { estado: "ACEPTADO" },
            tests: testEstado(400)
        }),
        request({
            nombre: "❌ 404 - Resolver solicitud inexistente",
            metodo: "PATCH", camino: "/api/artesanos/999999/solicitud", token: "tokenAdmin",
            body: { estado: "APROBADO" },
            tests: testEstado(404)
        }),
        request({
            nombre: "✅ 200 - Admin aprueba la solicitud (asigna rol ARTESANO)",
            metodo: "PATCH", camino: "/api/artesanos/{{artesanoId}}/solicitud", token: "tokenAdmin",
            body: { estado: "APROBADO" },
            tests: [
                ...testEstado(200),
                'pm.test("Queda APROBADO", () => pm.expect(pm.response.json().estadoSolicitud).to.eql("APROBADO"));'
            ]
        }),
        request({
            nombre: "❌ 409 - Aprobar una solicitud ya resuelta",
            metodo: "PATCH", camino: "/api/artesanos/{{artesanoId}}/solicitud", token: "tokenAdmin",
            body: { estado: "APROBADO" },
            tests: testEstado(409)
        }),
        request({
            nombre: "❌ 400 - Producto enviando artesanoId en el body",
            metodo: "POST", camino: "/api/productos", token: "tokenArtesano",
            body: { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: 15000, stock: 5, artesanoId: 1 },
            tests: testEstado(400)
        }),
        request({
            nombre: "❌ 400 - Producto con precio negativo",
            metodo: "POST", camino: "/api/productos", token: "tokenArtesano",
            body: { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: -100, stock: 5 },
            tests: testEstado(400)
        }),
        request({
            nombre: "✅ 201 - Artesano aprobado carga un producto",
            metodo: "POST", camino: "/api/productos", token: "tokenArtesano",
            body: { nombre: "Vasija de barro", descripcion: "Vasija pintada a mano", precio: 15000, stock: 5 },
            tests: [...testEstado(201), ...guardar("productoId", "json.id")]
        }),
        request({
            nombre: "✅ 200 - Mis productos",
            metodo: "GET", camino: "/api/productos/me", token: "tokenArtesano",
            tests: testEstado(200)
        }),
        request({
            nombre: "✅ 200 - El producto se ve en el catálogo público",
            metodo: "GET", camino: "/api/productos/{{productoId}}",
            tests: testEstado(200)
        }),
        request({
            nombre: "✅ 204 - Logout del artesano",
            metodo: "POST", camino: "/api/usuarios/logout", token: "tokenArtesano",
            tests: testEstado(204)
        }),
        request({
            nombre: "❌ 401 - Usar el token revocado",
            metodo: "GET", camino: "/api/productos/me", token: "tokenArtesano",
            tests: testEstado(401)
        })
    ]
};

const flujoStands = {
    name: "02 - Flujo alternativo: Asignación de stand",
    description: "El administrador crea un pabellón y una coordenada y asigna un stand al artesano aprobado en el flujo 01. Ejecutar después del flujo 01.",
    item: [
        loginAdmin(),
        request({
            nombre: "✅ 201 - Crear pabellón",
            metodo: "POST", camino: "/api/pabellones", token: "tokenAdmin",
            pre: ['pm.collectionVariables.set("nombrePabellon", `Pabellón ${Date.now()}`);'],
            body: { nombre: "{{nombrePabellon}}" },
            tests: [...testEstado(201), ...guardar("pabellonId", "json.id")]
        }),
        request({
            nombre: "❌ 409 - Pabellón con nombre repetido",
            metodo: "POST", camino: "/api/pabellones", token: "tokenAdmin",
            body: { nombre: "{{nombrePabellon}}" },
            tests: testEstado(409)
        }),
        request({
            nombre: "✅ 201 - Crear coordenada",
            metodo: "POST", camino: "/api/coordenadas", token: "tokenAdmin",
            pre: [
                'pm.collectionVariables.set("coordX", 1000 + Math.floor(Math.random() * 100000));',
                'pm.collectionVariables.set("coordY", 1000 + Math.floor(Math.random() * 100000));'
            ],
            body: '{\n  "x": {{coordX}},\n  "y": {{coordY}}\n}',
            tests: [...testEstado(201), ...guardar("coordenadaId", "json.id")]
        }),
        request({
            nombre: "❌ 409 - Coordenada repetida",
            metodo: "POST", camino: "/api/coordenadas", token: "tokenAdmin",
            body: '{\n  "x": {{coordX}},\n  "y": {{coordY}}\n}',
            tests: testEstado(409)
        }),
        request({
            nombre: "❌ 401 - Crear stand sin token",
            metodo: "POST", camino: "/api/stands",
            body: { pabellonId: "{{pabellonId}}", sector: "A", coordenadaId: "{{coordenadaId}}" },
            tests: testEstado(401)
        }),
        request({
            nombre: "❌ 400 - Stand con datos inválidos",
            metodo: "POST", camino: "/api/stands", token: "tokenAdmin",
            body: { pabellonId: -1, sector: "", coordenadaId: "abc", estado: "LIBRE" },
            tests: testEstado(400)
        }),
        request({
            nombre: "❌ 404 - Stand en pabellón inexistente",
            metodo: "POST", camino: "/api/stands", token: "tokenAdmin",
            body: '{\n  "pabellonId": 999999,\n  "sector": "A",\n  "coordenadaId": {{coordenadaId}}\n}',
            tests: testEstado(404)
        }),
        request({
            nombre: "✅ 201 - Crear stand asignado al artesano",
            metodo: "POST", camino: "/api/stands", token: "tokenAdmin",
            body: '{\n  "pabellonId": {{pabellonId}},\n  "sector": "A",\n  "coordenadaId": {{coordenadaId}},\n  "estado": "OCUPADO",\n  "artesanoId": {{artesanoId}}\n}',
            tests: [...testEstado(201), ...guardar("standId", "json.id")]
        }),
        request({
            nombre: "❌ 409 - Otro stand en la misma coordenada",
            metodo: "POST", camino: "/api/stands", token: "tokenAdmin",
            body: '{\n  "pabellonId": {{pabellonId}},\n  "sector": "B",\n  "coordenadaId": {{coordenadaId}}\n}',
            tests: testEstado(409)
        }),
        request({
            nombre: "✅ 201 - Crear otra coordenada libre",
            metodo: "POST", camino: "/api/coordenadas", token: "tokenAdmin",
            body: '{\n  "x": {{$randomInt}}{{$randomInt}},\n  "y": {{$randomInt}}{{$randomInt}}\n}',
            tests: [...testEstado(201), ...guardar("coordenadaLibreId", "json.id")]
        }),
        request({
            nombre: "❌ 409 - El artesano ya tiene un stand",
            metodo: "POST", camino: "/api/stands", token: "tokenAdmin",
            body: '{\n  "pabellonId": {{pabellonId}},\n  "sector": "B",\n  "coordenadaId": {{coordenadaLibreId}},\n  "artesanoId": {{artesanoId}}\n}',
            tests: testEstado(409)
        }),
        request({
            nombre: "✅ 200 - Consultar el stand",
            metodo: "GET", camino: "/api/stands/{{standId}}",
            tests: testEstado(200)
        }),
        request({
            nombre: "✅ 200 - Perfil público del artesano (con stand y productos)",
            metodo: "GET", camino: "/api/artesanos/{{artesanoId}}",
            tests: testEstado(200)
        })
    ]
};

// ==========================================================
// 3) Armado y escritura de los archivos
// ==========================================================

const variables = [
    ["baseUrl", "http://localhost:3000"],
    ["localidadId", "10049030000"],
    ["tokenAdmin", ""], ["tokenArtesano", ""], ["emailPostulante", ""],
    ["usuarioId", ""], ["postulanteId", ""], ["artesanoId", ""], ["productoId", ""],
    ["standId", ""], ["pabellonId", ""], ["coordenadaId", ""], ["coordenadaLibreId", ""],
    ["rubroId", "1"], ["rolId", "1"], ["consultaId", "1"],
    ["nombrePabellon", ""], ["coordX", ""], ["coordY", ""]
].map(([key, value]) => ({ key, value, type: "string" }));

const coleccion = {
    info: {
        name: swagger.info?.title ?? "API Feria de Artesanos",
        description: "Colección generada desde swagger-output.json con `npm run postman`.\n\n1. Importar también `Local.postman_environment.json` y seleccionarlo (tiene adminEmail y adminPassword).\n2. Las carpetas `01` y `02` son los flujos de la defensa: ejecutarlas en orden (o con Run folder).\n3. Las demás carpetas tienen todos los endpoints de la API.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [
        flujoPostulacion,
        flujoStands,
        ...[...carpetas].map(([name, item]) => ({ name, item }))
    ],
    variable: variables
};

const carpetaSalida = ruta("../postman/");
mkdirSync(carpetaSalida, { recursive: true });
writeFileSync(carpetaSalida + "Feria-Artesanos.postman_collection.json", JSON.stringify(coleccion, null, 2));

// Environment con las credenciales del admin del .env
if (existsSync(ruta("../.env"))) process.loadEnvFile(ruta("../.env"));
const entorno = {
    name: "Feria Artesanos - Local",
    values: [
        { key: "adminEmail", value: process.env.ADMIN_EMAIL ?? "admin@feria.com", type: "default", enabled: true },
        { key: "adminPassword", value: process.env.ADMIN_PASSWORD ?? "", type: "secret", enabled: true }
    ],
    _postman_variable_scope: "environment"
};
writeFileSync(carpetaSalida + "Local.postman_environment.json", JSON.stringify(entorno, null, 2));

const total = coleccion.item.reduce((n, c) => n + c.item.length, 0);
console.log(`Colección generada: postman/Feria-Artesanos.postman_collection.json (${total} requests)`);
console.log("Environment generado: postman/Local.postman_environment.json");
