import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
 
    localStorage.removeItem("token"); 
    sessionStorage.removeItem("token");


    navigate("/");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

   
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Déconnexion
      </button>
    </div>
  );
};

export default SettingsPage;