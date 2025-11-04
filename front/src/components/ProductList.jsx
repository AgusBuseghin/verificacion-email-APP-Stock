import { useEffect, useState } from 'react'
import { Container } from './Container'
import { toast } from 'react-toastify'
import { ProductRow } from './ProductRow'
import { useStore } from '../store/useStore'
import { Link } from 'react-router-dom'

const HistoryPanel = ({ data }) => {
    const sortedData = [...data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    const recentData = sortedData.slice(0, 5)

    const formatTime = (isoTime) => {
        return new Date(isoTime).toLocaleDateString('es-ES', { 
            day: '2-digit', month: '2-digit', year: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        })
    }

    let historyContent

    if (recentData.length === 0) {
        historyContent = (
            <p className="text-gray-600">No hay productos o historial reciente.</p>
        )
    } else {
        historyContent = (
            <ul className='space-y-3'>
                {recentData.map((d, index) => {
                    const isNew = new Date(d.createdAt).getTime() === new Date(d.updatedAt).getTime()
                    
                    let listItemClass
                    if (isNew) {
                        listItemClass = 'p-3 rounded-md border bg-slate-100 bg-opacity-70 border-slate-300'
                    } else {
                        listItemClass = 'p-3 rounded-md border bg-pink-100 bg-opacity-70 border-pink-300'
                    }

                    let statusText
                    if (isNew) {
                        statusText = 'Nuevo producto creado'
                    } else {
                        statusText = `Última Modificación`
                    }

                    let creatorName
                    if (d.creator?.fullName) {
                        creatorName = d.creator.fullName
                    } else {
                        creatorName = 'N/A'
                    }
                    
                    return (
                        <li key={d.id} className={listItemClass}>
                            <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                            <p className="text-xs text-gray-700 font-medium mt-1">
                                {statusText}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Por: <span className="font-medium text-slate-900">{creatorName}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Fecha: {formatTime(d.updatedAt)}
                            </p>
                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <div className="bg-white bg-opacity-50 backdrop-blur-md shadow-xl p-4 rounded-lg sticky top-24 max-h-[85vh] overflow-y-auto border border-gray-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                Historial de Modificaciones
            </h3>
            {historyContent}
        </div>
    )
}


export const ProductList = () => {
    const { user } = useStore()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true) 
    
    const config = {
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            'Authorization': user.token
        }
    }

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true)
            const url = `${import.meta.env.VITE_API_URL}/products` 
            try {
                const req = await fetch(url, config)
                const res = await req.json() 

                if (!req.ok || res.error) {
                    let errorMessage
                    if (res.msg) {
                        errorMessage = res.msg
                    } else {
                        errorMessage = `Error al cargar (Status: ${req.status}). Verifique la consola del servidor.`
                    }
                    toast.error(errorMessage)
                    return
                }
                
                setData(res.data)
            } catch (err) {
                toast.error("Error al cargar productos. Verifique que el backend esté encendido.")
            } finally {
                setLoading(false) 
            }
        }
        if (user.token) {
            getProduct()
        }
    }, [user.token])

    async function handleDelete(id) {
        if (!confirm("Desea eliminar el producto")) { 
            toast.info("Producto no eliminado")
            return
        }
        try {
            const url = `${import.meta.env.VITE_API_URL}/products/?id=${id}`
            const deleteConfig = {
                method: 'DELETE',
                headers: {
                    accept: "application/json",
                    'Authorization': user.token
                }
            }
            const req = await fetch(url, deleteConfig)
            const res = await req.json()
            
            if (!req.ok || res.error) {
                let errorMessage
                if (res.msg) {
                    errorMessage = res.msg
                } else {
                    errorMessage = `Error al intentar eliminar (Status: ${req.status})`
                }
                toast.error(errorMessage)
                return
            }

            toast.info("Producto eliminado correctamente")
            setData(data.filter(p => p.id !== id)) 
        } catch (error) {
            console.error("Fallo de red o JSON al borrar:", error)
            toast.error("Ocurrió un error inesperado al borrar") 
        }
    }

    let listContent

    if (loading) {
        listContent = (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        )
    } else if (data.length === 0) {
        listContent = (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No hay productos disponibles.</p>
            </div>
        )
    } else {
        listContent = (
            <div className="flex flex-col gap-4">
                {
                    data.map((d) => <ProductRow key={d.id} data={d} onDelete={handleDelete} />)
                }
            </div>
        )
    }

    return (
        <div className="flex container mx-auto gap-8 pt-5 max-w-6xl">
            
            <div className="hidden lg:block w-1/4">
                <HistoryPanel data={data} />
            </div>

            <div className="w-full lg:w-3/4">
                <Link 
                    to="/private/product/new" 
                    className="inline-block mb-6 py-3 px-6 rounded-lg shadow-md font-bold text-center 
                             bg-linear-to-r from-slate-700 to-slate-900 text-white 
                             hover:shadow-xl hover:shadow-slate-500/25 transition-all transform hover:scale-[1.01]" 
                >
                    + Cargar Producto
                </Link>
                
                <Container>
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">
                        Productos en Stock ({data.length})
                    </h1>
                    
                    {listContent}
                </Container>
            </div>
        </div>
    )
}