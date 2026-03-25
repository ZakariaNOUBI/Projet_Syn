import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import Logo from "../assets/icons/logo.png";
import UserIcon from "../assets/icons/user (1).png";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();

  const isAuthPage = ["/connexion", "/inscription"].includes(location.pathname);
  const isLoggedIn = !!user;

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-gray-800">MonBudget</h1>
      </div>

      {/* Boutons / Profil */}
      <div className="flex items-center gap-3">
        {isAuthPage && !isLoggedIn && (
          <>
            <Link
              to="/inscription"
              className="bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 transition"
            >
              Inscription
            </Link>
            <Link
              to="/connexion"
              className="bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 transition"
            >
              Connexion
            </Link>
          </>
        )}

        {!isAuthPage && isLoggedIn && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 border rounded-md px-3 py-1 hover:bg-gray-100 transition">
              <img
                src={UserIcon}
                alt="Profil"
                className="w-6 h-6 rounded-full"
              />
              <span>{user.firstName}</span>
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;