import { Outlet, useNavigate, Link } from 'react-router-dom' 
import { useStore } from '../store/useStore'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

function Private() {
  const { user, setUser } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.token) {
      navigate("/")
    }
  }, [user.token, navigate])

  const handleLogout = () => {
    setUser({ full_name: null, email: null, token: null, id: null }) 
    toast.info("Sesión cerrada")
    navigate("/") 
  }

  return (
    <div 
      className='min-h-screen bg-cover bg-center relative'
      style={{ backgroundImage: "url('/deposito.jpg')" }} 
    >
      <div className="absolute inset-0 bg-black opacity-40"></div> 
      
      <div className="relative z-10">

        <header className="py-4 shadow-md sticky top-0 z-10 border-b border-gray-700/50 
                           bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
            
            <Link to="/private" className='font-extrabold text-xl text-white drop-shadow-md'>
              Inventario APP
            </Link>

            <div className="flex items-center gap-6">
              <span className='font-semibold text-white hidden sm:inline drop-shadow-md'>
                Bienvenido, 
                <strong className='text-white'>{user.full_name}</strong>
              </span>
              
              <button onClick={handleLogout} 
                className="py-2 px-4 text-sm font-bold rounded-lg shadow-md transition-all text-white 
                           bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                           transform hover:scale-[1.02] active:scale-[0.98]">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main className='p-4'>
          <Outlet />
        </main>
      
      </div>
    </div>
  )
}


export default Private
