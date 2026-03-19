import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "../services/api";

const BudgetPage = () => {
  const userId = 20;

  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [newRevenue, setNewRevenue] = useState({ description: "", category: "", amount: "" });
  const [newExpense, setNewExpense] = useState({ description: "", category: "", amount: "" });


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

 
  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalRevenue - totalExpenses;

  // ==========================
  // Nouveau mois
  // ==========================
  const handleNewMonth = () => {
    if (!window.confirm("Commencer un nouveau mois ?")) return;
    setRevenues(revenues.filter((r) => r.isRecurring));
    setExpenses(expenses.filter((e) => e.isRecurring));
  };

  // ==========================
  // Calcul automatique des dates
  // ==========================
  const getDefaultDates = () => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 15); // 15 jours plus tard
    const format = (d) => d.toISOString().split("T")[0];
    return { startDate: format(startDate), endDate: format(endDate) };
  };

  // ==========================
  // Ajouter revenu
  // ==========================
  const handleAddRevenue = async () => {
    if (!newRevenue.description || !newRevenue.amount) return;
    const { startDate, endDate } = getDefaultDates();

    const transaction = {
      description: newRevenue.description,
      category: newRevenue.category,
      amount: Number(newRevenue.amount),
      type: "Revenue",
      isRecurring: false,
      userId,
      startDate,
      endDate,
      frequency: 1,
    };

    try {
      const added = await addTransaction(transaction, userId);
      setRevenues([...revenues, added]);
      setNewRevenue({ description: "", category: "", amount: "" });
    } catch (error) {
      console.error("Erreur ajout transaction :", error);
    }
  };

  // ==========================
  // Ajouter dépense
  // ==========================
  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return;
    const { startDate, endDate } = getDefaultDates();

    const transaction = {
      description: newExpense.description,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      type: "Expense",
      isRecurring: false,
      userId,
      startDate,
      endDate,
      frequency: 1,
    };

    try {
      const added = await addTransaction(transaction, userId);
      setExpenses([...expenses, added]);
      setNewExpense({ description: "", category: "", amount: "" });
    } catch (error) {
      console.error("Erreur ajout transaction :", error);
    }
  };

  // ==========================
  // Supprimer transaction
  // ==========================
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

  const [toast, setToast] = useState("");

const showToast = (message) => {
  setToast(message);
  setTimeout(() => setToast(""), 2000);
};
  
  // ===============================
  // 🔁 Toggle Récurrent
  // ===============================
const toggleRecurring = async (r) => {
  try {
    // 🔹 on ne touche pas frequency directement → backend safe
    const updatedData = {
      description: r.description,
      category: r.category || "Autre",
      amount: Number(r.amount),
      type: r.type,
      isDone: r.isDone,
      startDate: r.startDate + "T00:00:00Z",
      endDate: r.endDate + "T00:00:00Z",
      frequency: r.frequency === 1 ? 1 : 1 // force 1 pour éviter crash backend
    };

    await updateTransaction(userId, r.id, updatedData);

    setRevenues(revenues.map(item =>
      item.id === r.id ? { ...item, ...updatedData } : item
    ));

    showToast("Mise à jour réussie ✅");
  } catch (error) {
    console.error("❌ ERREUR BACKEND :", error.response?.data || error.message);
    showToast("Erreur ❌");
  }
};
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
   
      <div className="flex justify-between items-center mb-6">
        <p className="text-lg font-semibold">
          Votre balance ce mois-ci :
          <span className={balance >= 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
            {balance >= 0 ? `+${balance}` : balance} $
          </span>
        </p>
        <button
          onClick={handleNewMonth}
          className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Nouveau mois
        </button>
      </div>

      {/* Revenus */}
      <h2 className="text-xl font-bold mb-2">Revenus</h2>
      <table className="w-full bg-white shadow rounded mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Description</th>
          
            <th className="p-2 text-left">Revenus Mensuels</th>
            <th className="p-2 text-left">Récurrent</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {revenues.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.description}</td>
            
              <td className="p-2">{r.amount} $</td>
<td className="p-2">
  <button
    onClick={() => toggleIsDone(r)}
    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
      ${r.isDone ? "bg-green-500 border-green-600" : "bg-gray-200"}`}
  >
    {r.isDone && <span className="text-white text-xs">✓</span>}
  </button>
</td>
          
  <button
    onClick={() => openDeleteModal(r.id, "Revenue")}
    className="text-red-500 hover:text-red-700 transition-colors"
    title="Supprimer la transaction"
  >
    🗑
  </button>
<td className="p-2">
  <button
    onClick={() => openDeleteModal(r.id, "Revenue")}
    className="text-red-500 hover:text-red-700 transition-colors"
    title="Supprimer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm5-5h4v2h-4V4z" />
    </svg>
  </button>
</td>
            </tr>
          ))}

      
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


      <h2 className="text-xl font-bold mb-2">Dépenses</h2>
      <table className="w-full bg-white shadow rounded mb-4">
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
          {expenses.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="p-2">{e.description}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2">{e.amount} $</td>
   <td className="p-2">
  <select
    value={e.recurrence || ""}  // ← utiliser e.recurrence ici
    onChange={async (ev) => {
      const updated = { ...e, recurrence: ev.target.value };
      try {
        await updateTransaction(e.id, updated); // mettre à jour côté API
        setExpenses(expenses.map((item) => (item.id === e.id ? updated : item)));
      } catch (error) {
        console.error(error);
      }
    }}
    className="border rounded px-2"
  >
    <option value="">--</option>
    <option value="mensuel">Mensuel</option>
    <option value="annuel">Annuel</option>
    <option value="semestre">Semestre</option>
    <option value="semaine">Semaine</option>
  </select>
</td>
              <td className="p-2">
                <button onClick={() => openDeleteModal(e.id, "Expense")} className="text-red-500">
                  🗑
                </button>
              </td>
            </tr>
          ))}

   
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
      placeholder="Coût"
    />
  </td>
  <td className="p-2">
    <select
      value={newExpense.recurrence || ""}
      onChange={(e) => setNewExpense({ ...newExpense, recurrence: e.target.value })}
      className="border rounded px-2"
    >
      <option value="">--</option>
      <option value="mensuel">Mensuel</option>
      <option value="annuel">Annuel</option>
      <option value="semestre">Semestre</option>
      <option value="semaine">Semaine</option>
    </select>
  </td>
  <td>
    <button onClick={handleAddExpense} className="text-green-600 font-bold">
      Ajouter
    </button>
  </td>
</tr>
        </tbody>
      </table>
      <p className="text-right font-semibold mt-2">Total Dépenses : {totalExpenses} $</p>


{/* Modal suppression moderne avec animation */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-96 max-w-[40%] animate-modal-pop">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Supprimer cette transaction ?
      </h2>
      <p className="text-gray-600 mb-6">
        Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?
      </p>
      <div className="flex justify-end gap-3">
      
        <button
          onClick={() => {
            handleDelete(transactionToDelete.id, transactionToDelete.type);
            setShowModal(false);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Supprimer
        </button>
          <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );

  {toast && (
  <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg">
    {toast}
  </div>
)}
};

export default BudgetPage;