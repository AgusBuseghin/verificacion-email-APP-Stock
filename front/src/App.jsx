
import { BrowserRouter, Routes, Route } from 'react-router-dom' // ✅ Correcto
import Public from "./components/Public"
import Private from './components/Private'
import Login from './components/Login'
import Register from './components/Register'
import { ProductList } from './components/ProductList'
import { ProductForm } from './components/ProductForm' 
import { ToastContainer } from "react-toastify"

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas: Login y Registro */}
                <Route element={<Public />} path="/">
                    <Route index element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                
                {/* Rutas Privadas: Gestión de Productos */}
                <Route element={<Private />} path="/private">
                    {/* Lista de Productos (Ruta base privada) */}
                    <Route index element={<ProductList />} />
                    {/* Crear Producto */}
                    <Route path="product/new" element={<ProductForm />} /> 
                    {/* Editar Producto */}
                    <Route path="product/edit/:id" element={<ProductForm />} /> 
                </Route>
                <Route path="*" element={<h1>404</h1>} />
            </Routes>
            <ToastContainer theme="colored" />
        </BrowserRouter>
    )
}

export default App