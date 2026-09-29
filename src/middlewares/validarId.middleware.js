export const validarId = (req, res, next) => {
    const { id } = req.params;
    const idNumerico = Number(id);
    if (isNaN(idNumerico) || !Number.isInteger(idNumerico) || idNumerico <= 0) {
        return res.status(400).json({
            mensaje: "ID inválido",
            error: `El valor '${id}' no es un ID numérico válido. Debe ser un número entero positivo.`
        });
    }
    req.params.id = idNumerico;

    return next();
};