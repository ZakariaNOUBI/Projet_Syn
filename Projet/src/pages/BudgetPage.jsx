import React, { useState, useEffect } from "react";
import axios from "axios";

const BudgetPage = () => {
  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const userId = 20;
  const API_URL = "https://money-pie-2.fly.dev/api/v1";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${userId}/transactions`);
        const transactions = res.data;

        setRevenues(transactions.filter(t => t.type === "Revenue"));
        setExpenses(transactions.filter(t => t.type === "Expense"));
      } catch (error) {
        console.error("Erreur fetch transactions :", error);
      }
    };

    fetchTransactions();
  }, []);

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalRevenue - totalExpenses;

  const handleDelete = (id, type) => {
    if (type === "Revenue") {
      setRevenues(revenues.filter(r => r.id !== id));
    } else {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">


 <div className="mb-6">

  {/* Ligne 1 : balance + bouton */}
  <div className="flex justify-between items-center">
    <p className="text-lg font-semibold">
      Votre balance ce mois-ci :{" "}
      <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
        {balance >= 0 ? `+${balance}` : balance} $
      </span>
    </p>

    <button
      onClick={() => console.log("Nouveau mois !")}
      className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800
                 text-white font-bold italic px-4 py-2 rounded shadow-lg
                 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
                 transition-colors duration-300"
    >
      Nouveau mois
    </button>
  </div>

  {/* Ligne 2 : titre */}
  <h1 className="text-3xl font-extrabold text-gray-800 text-left mt-4">
    Budget mensuel
  </h1>

</div>

      {/* Revenus */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Revenus</h2>
    
        </div>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Catégorie</th>
              <th className="p-2 text-left">Montant</th>
              <th className="p-2 text-left">Récurrent</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map(r => (
              <tr key={r.id} className="border-b">
                <td className="p-2">{r.description}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">{r.amount} $</td>
            <td className="p-2 ">
  <button
    onClick={() => {
      const updatedRevenues = revenues.map(item =>
        item.id === r.id
          ? { ...item, isRecurring: !item.isRecurring }
          : item
      );
      setRevenues(updatedRevenues);
    }}
    className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-400 bg-gray-200"
  >
    {r.isRecurring && (
      <span className="text-green-600 text-sm font-bold">✓</span>
    )}
  </button>
</td>
    <td>
  <button
    onClick={() => handleDelete(r.id, "Revenue")}
    className="text-red-500 hover:text-red-700"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6v14h12V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  </button>
</td>
       
              </tr>
            ))}
          </tbody>
        </table>
              <p className="font-semibold text-right">Total Revenus : {totalRevenue} $</p>
      </div>

      {/* Dépenses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Dépenses</h2>
     
        </div>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Catégorie</th>
              <th className="p-2 text-left">Coût</th>
              <th className="p-2 text-left">Récurrence</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="border-b">
                <td className="p-2">{e.description}</td>
                <td className="p-2">{e.category}</td>
                <td className="p-2">{e.amount} $</td>
                <td className="p-2">
                  <select
                    value={e.isRecurring ? "Oui" : "Non"}
                    onChange={(ev) => {
                      const updatedExpenses = expenses.map(item =>
                        item.id === e.id ? { ...item, isRecurring: ev.target.value === "Oui" } : item
                      );
                      setExpenses(updatedExpenses);
                    }}
                    className="border px-1 rounded"
                  >
                    <option>Oui</option>
                    <option>Non</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(e.id, "Expense")}
                    className="text-red-500 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
             <p className="font-semibold text-right">Total Dépenses : {totalExpenses} $</p>
      </div>
    </div>
  );
};

export default BudgetPage;