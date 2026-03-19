import React from "react";
import Sidebar from "./Components/Sidebar.jsx";
import Header from "./Components/Header.jsx";
import { Routes, Route } from "react-router-dom";
import BudgetPage from "./pages/BudgetPage.jsx";


function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
        <Header /> {/* Header ajouté ici */}


 
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