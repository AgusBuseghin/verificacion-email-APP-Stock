import { useState } from 'react'
import { Link } from 'react-router-dom' 
import { Form } from './Form'
import { Input } from "./Input"
import { Button } from "./Button"
import { toast } from 'react-toastify'
import { useStore } from '../store/useStore'
import { useNavigate } from 'react-router-dom' 

const Legend = () => {
  return (
    <p>
      No tiene cuenta? 
      <Link 
        to="/register" 
        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline" 
      >
        Registrate
      </Link>
    </p>
  )
}

const Login = () => {
  const { setUser } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = { email, password }
      const url = `${import.meta.env.VITE_API_URL}/login` 
      const config = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }
      const req = await fetch(url, config)
      const res = await req.json()

      if (res.error) {
        toast.error(res.msg)
        return
      }
      
      setUser(res.user) 
      toast.success("Sesión iniciada")
      navigate("/private") 

    } catch (err) {
      toast.error("Error de conexión con el servidor.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form title="Iniciar Sesion" Legend={Legend} onSubmit={handleSubmit}>
      <Input
        type="email" id="email" name="email" title="Email" placeholder="@gmail.com"
        value={email} onChange={(e) => { setEmail(e.target.value) }}
      />
      <Input
        type="password" id="password" name="password" placeholder="contraseña" title="Contraseña"
        value={password} onChange={(e) => { setPassword(e.target.value) }}
      />
      <Button type='submit' value={loading ? "Cargando..." : "Iniciar Sesion"} disabled={loading} />
    </Form>
  )
}


export default Login