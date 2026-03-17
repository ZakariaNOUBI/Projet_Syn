import React, { useEffect, useState } from "react";
import Logo from "../assets/icons/logo.png";
import UserIcon from "../assets/icons/user (1).png";

const Header = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = sessionStorage.getItem("username");
    if (user) setUsername(user);
  }, []);

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">

      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-gray-800">MonBudget</h1>
      </div>

 
      <div className="relative">
        <button className="flex items-center gap-2 border rounded-md px-3 py-1 hover:bg-gray-100 transition">
          <img src={UserIcon} alt="Profil" className="w-6 h-6 rounded-full" />
          <span>{username || "Invité"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;