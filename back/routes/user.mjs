import { Router } from "express"
import { User } from '../models/User.mjs'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export const routes = Router()

routes.post("/", async (req, res) => {
    const body = req.body
    try {
        const { fullName, email, password, confirmPassword } = body
        if (password !== confirmPassword) {
            res.status(403).json({
                error: true,
                msg: "Las contraseñas no coinciden"
            })
            return
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const activateToken = "123" 
        const user = new User({
            fullName,
            email,
            hash,
            activateToken
        })

        await user.save()
        res.json({
            error: false,
            msg: "Usuario creado"
        })

    } catch (err) {
        res.status(400).json({
            error: true,
            msg: err.message
        })
    }
})

routes.post("/login", async (req, res) => {
    try {
        const body = req.body
        const { email, password } = body

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            res.status(404).json({
                error: true,
                msg: "El usuario no existe"
            })
            return
        }

        const checkPasswd = await bcrypt.compare(password, user.hash)

        if (!checkPasswd) {
            res.status(403).json({
                error: true,
                msg: "Password incorrecto"
            })
            return
        }

        const payload = {
            id: user.id, 
            email: user.email
        }

        const token = jwt.sign(payload, process.env.SECRET)

        res.json({
            error: false,
            user: {
                id: user.id, 
                full_name: user.fullName,
                email: user.email,
                token: `Bearer ${token}` 
            }
        })
    } catch(e) {
        console.log(e)
        res.status(500).json({
            error: true,
            msg: "Hubo un error al iniciar sesion"
        })
    }
})

routes.get("/verify-token", async (req, res) => {
    const headers = req.headers
    const auth = headers.authorization
    
    if (!auth) {
        return res.status(401).json({ error: true, msg: "No token provided" })
    }
    
    const token = auth.split(" ")[1]

    try {
        const verify = jwt.verify(token, process.env.SECRET)
        
        if (!verify) {
            return res.json({ error: true })
        }
        
        res.json({
            error: false,
            id: verify.id, 
            email: verify.email
        })
    } catch (err) {
        res.status(401).json({ error: true, msg: "Token inválido o expirado" })
    }
})