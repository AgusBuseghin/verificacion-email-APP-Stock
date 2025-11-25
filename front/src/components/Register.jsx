import { useState } from 'react'
import { Form } from './Form'
import { Input } from './Input'
import { Button } from "./Button"
import { Link } from 'react-router-dom' 
import { toast } from "react-toastify"
import {auth} from "./firebase.js"
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

const Legend = () => {
    return (
        <p>
            Ya tiene cuenta? 
            <Link 
                to="/" 
                className='text-blue-600 hover:text-blue-700 font-semibold transition-colors underline'
            >
                Inicia Sesion
            </Link>
        </p>
    )
}


const Register = () => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const url = `${import.meta.env.VITE_API_URL}/` 
            const body = { fullName, email, password, confirmPassword }

            const req = await fetch(url, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body)
            })
            
            if (!req.ok) {
                let errorRes
                try {
                    errorRes = await req.json()
                } catch (e) {
                    errorRes = { msg: `Error de servidor (${req.status}).` }
                }
                toast.error(errorRes.msg)
                return
            }
            
            const res = await req.json()
            
            if (res.error) {
                toast.error(res.msg)
                return
            }

            try{
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                await sendEmailVerification(userCredential.user)
                setMsg("Cuenta creada. Revisa tu correo para verificar la cuenta.")
            } catch (er){
                setMsg(er.message)
            }

            toast.success(res.msg)
            toast.info("El correo puede haber llegado a la carpeta de spam.")
            setFullName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")


        } catch (e){
            console.log(e)
            toast.error("Error de conexión con el servidor.")
        }
        finally {
            setLoading(false)
        }
    }

    let buttonValue
    if (loading) {
        buttonValue = "Cargando..."
    } else {
        buttonValue = "Registrarse"
    }

    

    return (
        <Form title="Registrarse" Legend={Legend} onSubmit={handleSubmit}>
            <Input name="fullName" type="text" id="fullname" title="Nombre completo" placeholder="Nombre y Apellido"
                value={fullName} onChange={(e) => setFullName(e.target.value)}
            />
            <Input name="email" type="email" title="Correo" placeholder="@gmail.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <Input type="password" name="password" title="Contraseña" placeholder="contraseña"
                value={password} id="password" onChange={(e) => setPassword(e.target.value)}
            />
            <Input type="password" id="confirmPassword" name="confirmPassword" title="Confirmar Contraseña" placeholder=" Repita la contraseña"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type='submit' value={buttonValue} disabled={loading} />
        <p>{msg}</p>
        </Form>
    )
}


export default Register