import { useNavigate } from 'react-router-dom'
 
export default function Header() {
    const navigate = useNavigate()
 
    return (
        <nav className="bg-white border-b border-gray-200 px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1 cursor-pointer">
                    <span className="w-5 h-0.5 bg-gray-500 block"></span>
                    <span className="w-5 h-0.5 bg-gray-500 block"></span>
                    <span className="w-5 h-0.5 bg-gray-500 block"></span>
                </div>
                <span className="font-semibold text-gray-800">LOGO</span>
            </div>
            <div className="flex gap-2">
                <button
                    className="bg-primary text-white px-4 py-1.5 rounded text-sm"
                    onClick={() => navigate('/profile')}>
                    Inscription
                </button>
                <button
                    className="border border-primary text-primary bg-white px-4 py-1.5 rounded text-sm"
                    onClick={() => navigate('/login')}>
                    Connexion
                </button>
            </div>
        </nav>
    )
}
 