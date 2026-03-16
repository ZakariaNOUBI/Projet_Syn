import React from "react";
import Sidebar from "./Components/Sidebar.jsx";
import { Routes, Route } from "react-router-dom";
import BudgetPage from "./pages/BudgetPage.jsx"; // ton BudgetPage importé

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Routes>
          <Route path="/" element={<h1>Accueil</h1>} />
          <Route path="/about" element={<h1>À propos</h1>} />
          <Route path="/budget" element={<BudgetPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;