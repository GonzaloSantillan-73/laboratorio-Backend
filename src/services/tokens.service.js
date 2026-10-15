import jwt from "jsonwebtoken"
import { secretoJWT } from "../config/jwt.js"

export const generarToken = (usuario) => {
    return jwt.sign(
        { sub: usuario.id },
        secretoJWT,
        {
            algorithm: "HS256",
            expiresIn: "15m"
        }
    )
}