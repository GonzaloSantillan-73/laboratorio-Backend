import request from "supertest";

export async function crearEscenario(app, prisma) {
    const password = "ClaveDePrueba2026!";

    // La postulación necesita una localidad y un rubro que existan
    const provincia = await prisma.provincia.create({
        data: { id: "99", nombre: "Provincia de prueba" } });
    const departamento = await prisma.departamento.create({
        data: { id: "99001", nombre: "Departamento de prueba", provinciaId: provincia.id } });
    const localidad = await prisma.localidad.create({
        data: { id: "99001001", nombre: "Localidad de prueba",
            departamentoId: departamento.id, provinciaId: provincia.id } });
    // Los rubros son un catálogo que ya cargaron las migraciones
    const rubro = await prisma.rubro.findUniqueOrThrow({ where: { nombre: "Textil" } });

    // Se postula por la API y, si corresponde, se aprueba la solicitud
    const registrar = async (nombre, aprobar) => {
        const email = `${nombre.toLowerCase()}@pruebas.test`;
        const { body: usuario } = await request(app)
            .post("/api/usuarios/postulacion")
            .send({ nombre, apellido: "Prueba", email, password,
                nombreEmprendimiento: `Taller de ${nombre}`,
                trayectoria: "Artesana de prueba",
                localidadId: localidad.id, rubrosIds: [rubro.id] }).expect(201);
        if (aprobar) {
            await prisma.artesano.update({
                where: { id: usuario.artesano.id },
                data: { estadoSolicitud: "APROBADO" } });
            const rolArtesano = await prisma.rol.findUniqueOrThrow({
                where: { nombre: "ARTESANO" } });
            await prisma.usuarioRol.create({
                data: { usuarioId: usuario.id, rolId: rolArtesano.id } });
        }
        const { body: sesion } = await request(app).post("/api/usuarios/login")
            .send({ email, password }).expect(200);
        return { usuario, token: sesion.token };
    };

    const { usuario: ana, token: tokenAna } = await registrar("Ana", true);
    const { usuario: bruno, token: tokenBruno } = await registrar("Bruno", true);
    // Carla se postuló pero todavía no fue aprobada: no tiene el rol ARTESANO
    const { usuario: carla, token: tokenCarla } = await registrar("Carla", false);

    return { ana, bruno, carla, tokenAna, tokenBruno, tokenCarla, localidad, rubro };
}
