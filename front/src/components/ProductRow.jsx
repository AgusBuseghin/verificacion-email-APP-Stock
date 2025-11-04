import { Link } from 'react-router-dom' 
import { useLocation } from 'react-router-dom' 

export const ProductRow = ({ data, onDelete }) => {
    const location = useLocation()
    
    const isPrivate = location.pathname.includes('/private')

    let creatorName
    if (data.creator?.fullName) {
        creatorName = data.creator.fullName
    } else {
        creatorName = 'N/A'
    }

    let actionButtons = null
    if (isPrivate) {
        actionButtons = (
            <section className='flex gap-2 w-full sm:w-auto mt-3 sm:mt-0'>
                <button className="flex-1 sm:flex-none py-2 px-4 text-sm bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => onDelete(data.id)}
                >
                    Borrar
                </button>
                
                <Link className="flex-1 sm:flex-none py-2 px-4 text-sm rounded-lg shadow-md cursor-pointer inline-block font-bold transition-all text-center
                    bg-linear-to-r from-slate-700 to-slate-900 text-white hover:shadow-lg hover:shadow-slate-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
                    to={`/private/product/edit/${data.id}`} 
                >
                    Editar
                </Link>
            </section>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg justify-between items-start sm:items-center hover:shadow-lg transition-all duration-200">

            <div className="flex flex-col sm:flex-row grow w-full sm:w-auto gap-4 justify-between items-center">
                
                <div className='flex flex-col min-w-[150px] items-start flex-1'>
                    <p className="font-bold text-indigo-700 text-lg truncate max-w-[200px]">{data.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Creador: <span className='font-semibold text-pink-500'>{creatorName}</span>
                    </p>
                </div>
                
                <div className='flex justify-end items-center w-full sm:w-2/5 gap-4'>
                    <p className="text-right text-green-600 font-bold truncate w-1/2">${data.price}</p>
                    <p className="text-right font-semibold w-1/2 text-gray-800 truncate">Stock: {data.stock}</p>
                </div>
            </div>

            {actionButtons}
        </div>
    )
}