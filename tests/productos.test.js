import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "secreto-exclusivo-de-pruebas";
const { app } = await import("../app.js");

// Cuerpo válido: en los tres casos solo cambia la cabecera Authorization
const productoValido = {
    nombre: "Vasija de barro",
    descripcion: "Vasija pintada a mano",
    precio: 15000,
    stock: 5
};

test("POST /api/productos sin token devuelve 401", async () => {
    const respuesta = await request(app).post("/api/productos")
        .send(productoValido).expect(401)
        .expect("Content-Type", /json/);
    assert.deepEqual(respuesta.body, {
        mensaje: "Se requiere un token de acceso"
    });
});

test("Cabecera mal formada devuelve 400", async () => {
    await request(app).post("/api/productos")
        .set("Authorization", "Basic abc")
        .send(productoValido)
        .expect("Content-Type", /json/)
        .expect(400, {
            mensaje: "Usar Authorization: Bearer <token>"
        });
});

test("Token inválido devuelve 401", async () => {
    await request(app).post("/api/productos")
        .set("Authorization", "Bearer token-invalido")
        .send(productoValido)
        .expect("Content-Type", /json/)
        .expect(401, {
            mensaje: "Token inválido, vencido o revocado"
        });
});
