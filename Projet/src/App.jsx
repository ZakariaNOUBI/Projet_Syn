import React from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./Components/Sidebar.jsx";
import Header from "./Components/Header.jsx";

import ProfilePage from "./pages/ProfilePage.jsx";
import UsersListPage from "./pages/UsersListPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import LoginPage from "./pages/LoginPage";
 // import UpdateProfile from "./pages/UpdateProfile.jsx";

import { UserProvider } from "./context/UserContext.jsx";

function App() {
  return (
    <UserProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
          <Header />
          <div className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/" element={<UsersListPage />} />
              <Route path="/inscription" element={<ProfilePage />} />
              <Route path="/budget" element={<BudgetPage />} />
                     {/* <Route path="/update-profile" element={<UpdateProfile />} /> */}
              <Route path="/about" element={<h1>À propos</h1>} />
              <Route path="/home" element={<h1>Accueil</h1>} />
            </Routes>
          </div>
        </main>
      </div>
    </UserProvider>
  );
}

export default App;