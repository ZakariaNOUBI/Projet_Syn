import React from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../assets/icons/home.png";
import BudgetIcon from "../assets/icons/budget.png";
import ProfileIcon from "../assets/icons/profile.png";
import LogoutIcon from "../assets/icons/logout1.png";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: HomeIcon, path: "/", label: "Accueil" , size: "h-6 w-6"  },
    { icon: BudgetIcon, path: "/budget", label: "Budget" , size: "h-6 w-6" },
    { icon: ProfileIcon, path: "/profile", label: "Profil", size: "h-6 w-6"  },
  ];

  return (
    <div className="flex flex-col w-20 h-screen p-4 bg-gradient-to-b from-purple-600 via-purple-700 to-purple-800 text-white shadow-lg">
  
      <div className="flex flex-col items-center">
        <button className="p-2 rounded hover:bg-purple-500/50 transition-all duration-300 shadow-md">
          <span className="text-2xl">☰</span>
        </button>
      </div>

 
      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex justify-center items-center h-12 w-12 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:bg-purple-500/30 ${
              location.pathname === item.path ? "bg-purple-900 shadow-inner" : ""
            }`}
            title={item.label}
          >
            <img src={item.icon} alt={item.label} className="h-6 w-6" />
          </Link>
        ))}
      </div>

      {/* Déconnexion en bas */}
      <div className="flex flex-col items-center mt-4">
        <Link
          to="/"
          className="flex justify-center items-center h-12 w-12 rounded-lg hover:bg-purple-500/30 transition-all duration-300 shadow-md"
          title="Déconnexion"
        >
          <img src={LogoutIcon} alt="Déconnexion" className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;