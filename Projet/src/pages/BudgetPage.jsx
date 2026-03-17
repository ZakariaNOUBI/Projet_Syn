import React, { useState, useEffect } from "react";
import { getTransactions, deleteTransaction, addTransaction } from "../services/api";

const BudgetPage = () => {
  const userId = 20;

  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [newRevenue, setNewRevenue] = useState({ description: "", category: "", amount: "" });
  const [newExpense, setNewExpense] = useState({ description: "", category: "", amount: "" });

  // Récupération des transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getTransactions(userId);
        setRevenues(transactions.filter((t) => t.type === "Revenue"));
        setExpenses(transactions.filter((t) => t.type === "Expense"));
      } catch (error) {
        console.error(error);
      }
    };
    fetchTransactions();
  }, [userId]);

  // Totaux
  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalRevenue - totalExpenses;

  // Suppression transaction
  const openDeleteModal = (id, type) => {
    setTransactionToDelete({ id, type });
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteTransaction(userId, id);
      if (type === "Revenue") setRevenues(revenues.filter((r) => r.id !== id));
      else setExpenses(expenses.filter((e) => e.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Nouveau mois
  const handleNewMonth = () => {
    if (!window.confirm("Commencer un nouveau mois ?")) return;
    setRevenues(revenues.filter((r) => r.isRecurring));
    setExpenses(expenses.filter((e) => e.isRecurring));
  };

  // Ajouter revenu
  const handleAddRevenue = async () => {
    if (!newRevenue.description || !newRevenue.amount) return;
    const transaction = {
      description: newRevenue.description,
      category: newRevenue.category,
      amount: Number(newRevenue.amount),
      type: "Revenue",
      isRecurring: false,
      userId,
    };
    try {
      const added = await addTransaction(transaction);
      setRevenues([...revenues, added]);
      setNewRevenue({ description: "", category: "", amount: "" });
    } catch (error) {
      console.error(error);
    }
  };

  // Ajouter dépense
  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return;
    const transaction = {
      description: newExpense.description,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      type: "Expense",
      isRecurring: false,
      userId,
    };
    try {
      const added = await addTransaction(transaction);
      setExpenses([...expenses, added]);
      setNewExpense({ description: "", category: "", amount: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Balance & Nouveau mois */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-semibold">
          Votre balance ce mois-ci :
          <span className={balance >= 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
            {balance >= 0 ? `+${balance}` : balance} $
          </span>
        </p>
        <button onClick={handleNewMonth} className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">
          Nouveau mois
        </button>
      </div>

      {/* Revenus */}
      <h2 className="text-xl font-bold mb-2">Revenus</h2>
      <table className="w-full bg-white shadow rounded mb-4">
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
          {revenues.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.description}</td>
              <td className="p-2">{r.category}</td>
              <td className="p-2">{r.amount} $</td>
              <td className="p-2">
                <button
                  onClick={() => {
                    const updated = revenues.map((item) =>
                      item.id === r.id ? { ...item, isRecurring: !item.isRecurring } : item
                    );
                    setRevenues(updated);
                  }}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    r.isRecurring ? "bg-green-500 border-green-600" : "bg-gray-200"
                  }`}
                >
                  {r.isRecurring && <span className="text-white text-xs">✓</span>}
                </button>
              </td>
              <td className="p-2">
                <button onClick={() => openDeleteModal(r.id, "Revenue")} className="text-red-500">
                  🗑
                </button>
              </td>
            </tr>
          ))}

          {/* Ajouter revenu */}
          <tr>
            <td className="p-2">
              <input
                className="border rounded px-2"
                value={newRevenue.description}
                onChange={(e) => setNewRevenue({ ...newRevenue, description: e.target.value })}
                placeholder="Description"
              />
            </td>
            <td className="p-2">
              <input
                className="border rounded px-2"
                value={newRevenue.category}
                onChange={(e) => setNewRevenue({ ...newRevenue, category: e.target.value })}
                placeholder="Catégorie"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                className="border rounded px-2"
                value={newRevenue.amount}
                onChange={(e) => setNewRevenue({ ...newRevenue, amount: e.target.value })}
                placeholder="Montant"
              />
            </td>
            <td></td>
            <td>
              <button onClick={handleAddRevenue} className="text-green-600 font-bold">
                Ajouter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-right font-semibold mb-8">Total Revenus : {totalRevenue} $</p>

      {/* Dépenses */}
      <h2 className="text-xl font-bold mb-2">Dépenses</h2>
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
          {expenses.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="p-2">{e.description}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2">{e.amount} $</td>
              <td className="p-2">
                <select
                  value={e.isRecurring ? "Oui" : "Non"}
                  onChange={(ev) => {
                    const updated = expenses.map((item) =>
                      item.id === e.id ? { ...item, isRecurring: ev.target.value === "Oui" } : item
                    );
                    setExpenses(updated);
                  }}
                  className="border rounded px-2"
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </td>
              <td className="p-2">
                <button onClick={() => openDeleteModal(e.id, "Expense")} className="text-red-500">
                  🗑
                </button>
              </td>
            </tr>
          ))}

          {/* Ajouter dépense */}
          <tr>
            <td className="p-2">
              <input
                className="border rounded px-2"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Description"
              />
            </td>
            <td className="p-2">
              <input
                className="border rounded px-2"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                placeholder="Catégorie"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                className="border rounded px-2"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="Montant"
              />
            </td>
            <td></td>
            <td>
              <button onClick={handleAddExpense} className="text-green-600 font-bold">
                Ajouter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-right font-semibold mt-2">Total Dépenses : {totalExpenses} $</p>

      {/* Modal suppression */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression ?</h2>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                Annuler
              </button>
              <button
                onClick={() => {
                  handleDelete(transactionToDelete.id, transactionToDelete.type);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;