
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ProfilePage from "./pages/ProfilePage";
import UsersListPage from "./pages/UsersListPage";

import React from "react";
import Sidebar from "./Components/Sidebar.jsx";
import Header from "./Components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import BudgetPage from "./pages/BudgetPage.jsx";



function App() {
  const [usersList, setUsersList] = useState([]);

  const addUserToList = (user) => {
    setUsersList((prev) => [...prev, user]);
  };

  return (

    <Router>
      <Routes>
        <Route path="/" element={<UsersListPage />} />
        <Route path="/profile" element={<ProfilePage onNewUser={addUserToList} />} />
      </Routes>
    </Router>

    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
        <Header /> 


 
        <div className="p-6 flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<h1>Accueil</h1>} />
            <Route path="/about" element={<h1>À propos</h1>} />
            <Route path="/budget" element={<BudgetPage />} />

          </Routes>
        </div>
      </main>
    </div>

  );
}

export default App;