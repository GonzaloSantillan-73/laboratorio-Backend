import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { crearEscenario } from "./helpers/escenario-productos.js";

// Antes de importar la API comprobamos que estamos en modo test
// y conectados a la base de pruebas, porque beforeEach borra datos.
assert.equal(process.env.NODE_ENV, "test");
assert.equal(new URL(process.env.DATABASE_URL).pathname,
    "/backend_laboratorio_test");
const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../app.js");
let datos;

before(async () => { await prisma.$connect(); });
after(async () => { await prisma.$disconnect(); });

beforeEach(async () => {
    // Primero los registros que referencian a otros.
    // Rol y Rubro se conservan: son catálogos que cargaron las migraciones.
    await prisma.$transaction([
        prisma.producto.deleteMany(),
        prisma.stand.deleteMany(),
        prisma.artesanoRubro.deleteMany(),
        prisma.artesano.deleteMany(),
        prisma.consulta.deleteMany(),
        prisma.tokenRevocado.deleteMany(),
        prisma.usuarioRol.deleteMany(),
        prisma.usuario.deleteMany(),
        prisma.localidad.deleteMany(),
        prisma.departamento.deleteMany(),
        prisma.provincia.deleteMany(),
    ]);
    datos = await crearEscenario(app, prisma);
});

const producto = (nombre) => ({
    nombre, descripcion: "Producto de prueba", precio: 15000, stock: 5
});

// Envía el POST y exige 201
const crearProducto = (token, nombre) =>
    request(app).post("/api/productos")
        .set("Authorization", `Bearer ${token}`)
        .send(producto(nombre)).expect(201);

test("Crear un producto correcto lo guarda en PostgreSQL", async () => {
    const { ana, tokenAna } = datos;
    const { body } = await crearProducto(tokenAna, "Poncho de lana");
    const guardado = await prisma.producto.findUniqueOrThrow({ where: { id: body.id } });
    assert.equal(guardado.artesanoId, ana.artesano.id);
    assert.equal(guardado.nombre, "Poncho de lana");
    assert.equal(guardado.precio, 15000);
    assert.equal(guardado.stock, 5);
    assert.equal(guardado.activo, true);
    assert.equal(body.artesanoId, ana.artesano.id);
    assert.equal(await prisma.producto.count({
        where: { artesanoId: ana.artesano.id } }), 1);
});

test("Listar devuelve todos los productos propios y ninguno ajeno", async () => {
    const { tokenAna, tokenBruno } = datos;
    const propio1 = (await crearProducto(tokenAna, "Poncho de lana")).body;
    const propio2 = (await crearProducto(tokenAna, "Faja tejida")).body;
    const ajeno = (await crearProducto(tokenBruno, "Mate de plata")).body;
    const { body } = await request(app).get("/api/productos/me")
        .set("Authorization", `Bearer ${tokenAna}`).expect(200)
        .expect("Content-Type", /json/);
    assert.deepEqual(body.map((p) => p.id).sort((a, b) => a - b),
        [propio1.id, propio2.id].sort((a, b) => a - b));
    assert.equal(body.some((p) => p.id === ajeno.id), false);
});

test("Ana no puede modificar un producto existente de Bruno", async () => {
    const { bruno, tokenAna, tokenBruno } = datos;
    const ajeno = (await crearProducto(tokenBruno, "Mate de plata")).body;
    const { body } = await request(app).put(`/api/productos/${ajeno.id}`)
        .set("Authorization", `Bearer ${tokenAna}`)
        .send(producto("Producto cambiado")).expect(404);
    assert.deepEqual(body, { mensaje: `No existe un producto con ID ${ajeno.id}` });
    const guardado = await prisma.producto.findUniqueOrThrow({ where: { id: ajeno.id } });
    assert.equal(guardado.artesanoId, bruno.artesano.id);
    assert.equal(guardado.nombre, "Mate de plata");
});

test("Una cuenta sin rol ARTESANO no puede crear productos", async () => {
    const { tokenCarla } = datos;
    await request(app).post("/api/productos")
        .set("Authorization", `Bearer ${tokenCarla}`)
        .send(producto("Poncho de lana"))
        .expect("Content-Type", /json/)
        .expect(403, { mensaje: "No tiene permiso para esta operación." });
    assert.equal(await prisma.producto.count(), 0);
});

test("Repetir una postulación con el mismo email devuelve 409", async () => {
    const { localidad, rubro } = datos;
    const postulacion = {
        nombre: "Diego", apellido: "Prueba", email: "diego@pruebas.test",
        password: "ClaveDePrueba2026!", nombreEmprendimiento: "Taller de Diego",
        trayectoria: "Artesano de prueba", localidadId: localidad.id, rubrosIds: [rubro.id]
    };
    await request(app).post("/api/usuarios/postulacion").send(postulacion).expect(201);
    const { body } = await request(app).post("/api/usuarios/postulacion")
        .send(postulacion).expect(409);
    assert.deepEqual(body, { mensaje: "Ya existe un registro con esos datos únicos." });
    assert.equal(await prisma.usuario.count({
        where: { email: "diego@pruebas.test" } }), 1);
});
