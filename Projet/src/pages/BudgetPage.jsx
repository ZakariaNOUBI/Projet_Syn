import React, { useState, useEffect } from "react";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "../services/api";

const BudgetPage = () => {
  const userId = 30;

  const [revenues, setRevenues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [newRevenue, setNewRevenue] = useState({ description: "", category: "", amount: "", isRecurring: false });
  const [newExpense, setNewExpense] = useState({ description: "", category: "", amount: "", isRecurring: false });

  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getTransactions(userId);
        setRevenues(transactions.filter((t) => t.type === "Revenue"));
        setExpenses(transactions.filter((t) => t.type === "Expense"));
      } catch (error) {
        console.error(error);
        showToast("Erreur récupération transactions ❌");
      }
    };
    fetchTransactions();
  }, [userId]);

  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const balance = totalRevenue - totalExpenses;


  const getDefaultDates = (isRecurring = false) => {
    const startDate = new Date();
    const format = (d) => d.toISOString().split("T")[0];
    return { startDate: format(startDate), endDate: isRecurring ? format(startDate) : null };
  };


  const handleAddRevenue = async () => {
    if (!newRevenue.description || !newRevenue.amount) return;

    const { startDate, endDate } = getDefaultDates(newRevenue.isRecurring);

    const transaction = {
      description: newRevenue.description,
      category: newRevenue.category || "Autre",
      amount: Number(newRevenue.amount),
      type: "Revenue",
      userId,
      startDate,
      endDate,
      frequency: newRevenue.isRecurring ? 1 : -1,
    };

    try {
      const added = await addTransaction(transaction, userId);
      setRevenues([...revenues, added]);
      setNewRevenue({ description: "", category: "", amount: "", isRecurring: false });
      showToast("Revenu ajouté ✅");
    } catch (error) {
      console.error(error);
      showToast("Erreur ajout revenu ❌");
    }
  };


  const handleAddExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return;

    const { startDate, endDate } = getDefaultDates(newExpense.isRecurring);

    const transaction = {
      description: newExpense.description,
      category: newExpense.category || "Autre",
      amount: Number(newExpense.amount),
      type: "Expense",
      userId,
      startDate,
      endDate,
      frequency: newExpense.isRecurring ? 1 : -1,
    };

    try {
      const added = await addTransaction(transaction, userId);
      setExpenses([...expenses, added]);
      setNewExpense({ description: "", category: "", amount: "", isRecurring: false });
      showToast("Dépense ajoutée ✅");
    } catch (error) {
      console.error(error);
      showToast("Erreur ajout dépense ❌");
    }
  };

const toggleFrequency = async (r, type) => {
  try {
    const updatedData = {
      ...r,
      frequency: r.frequency === 1 ? -1 : 1, 
      endDate: r.frequency === 1 ? null : r.startDate, 
    };

    const updated = await updateTransaction(userId, r.id, updatedData);

    if (type === "Revenue") {
      setRevenues(revenues.map((item) => (item.id === r.id ? updated : item)));
    } 

    showToast("Récurrent mise à jour ✅");
  } catch (error) {
    console.error(error);
    showToast("Erreur mise à jour Récurrent ❌");
  }
};
  const openDeleteModal = (id, type) => {
    setTransactionToDelete({ id, type });
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteTransaction(userId, id);
      if (type === "Revenue") setRevenues(revenues.filter((r) => r.id !== id));
      else setExpenses(expenses.filter((e) => e.id !== id));
      showToast("Transaction supprimée ✅");
    } catch (error) {
      console.error(error);
      showToast("Erreur suppression ❌");
    }
  };

const handleNewMonth = async () => {

  const confirmAction = window.confirm(
    "Voulez-vous vraiment passer au nouveau mois ? Toutes les transactions non récurrentes (revenus et dépenses) seront supprimées."
  );
  if (!confirmAction) return;

  try {
   
    const recurringExpenses = expenses.filter((t) => t.frequency === 1);
    const nonRecurringExpenses = expenses.filter((t) => t.frequency === -1);

    const recurringRevenues = revenues.filter((t) => t.frequency === 1);
    const nonRecurringRevenues = revenues.filter((t) => t.frequency === -1);

    const allNonRecurring = [...nonRecurringExpenses, ...nonRecurringRevenues];

   
    await Promise.all(
      allNonRecurring.map((t) => deleteTransaction(userId, t.id))
    );

 
    setExpenses(recurringExpenses);
    setRevenues(recurringRevenues);

   
    showToast("Nouveau mois activé ✅ !");
  } catch (error) {
    console.error("Erreur lors du changement de mois :", error);
    showToast("Erreur lors du changement de mois !");
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen overflow-x-auto">
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

      <h1 className="text-xl font-bold mb-2 text-violet-900">Budget Mensuel</h1>


      <h2 className="text-xl font-bold mb-2">Revenus</h2>
      <table className="w-full bg-white shadow rounded mb-4 ">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Montant</th>
            <th className="p-2 text-left">Récurrent</th>
            <th className="p-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {revenues.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.description}</td>
              <td className="p-2">{r.amount} $</td>
     <td className="p-2">
  <button
    onClick={() => toggleFrequency(r, "Revenue")} 
    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all
      ${r.frequency === 1 ? "bg-green-500 border-green-600" : "bg-gray-200 border-gray-400"}`}
    title={r.frequency === 1 ? "Récurrent" : "Non récurrent"}
  >
    {r.frequency === 1 && <span className="text-white text-xs">✓</span>}
  </button>
</td>


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
      <table className="w-full bg-white shadow rounded mb-4 ">
        <thead>
          <tr className="bg-gray-200">
         <th className="p-2 text-left">Description</th>
<th className="p-2 text-left">Catégorie</th>
<th className="p-2 text-left">Coût</th>
<th className="p-2 text-left">Récurrence</th>
<th className="p-2 text-left"></th>
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
    className={`border rounded px-2 py-1 transition-all
      ${e.frequency === 1 ? "bg-green-100 border-green-400" : "bg-gray-100 border-gray-300"}`}
    value={e.frequency === 1 ? "Mensuelle" : ""}
    title={e.frequency === 1 ? "Récurrence" : "Non Récurrence"}
    onChange={async (event) => {
      const freqValue = event.target.value === "Mensuelle" ? 1 : -1;

      setExpenses((prev) =>
        prev.map((item) =>
          item.id === e.id ? { ...item, frequency: freqValue } : item
        )
      );

      try {
        await updateTransaction(userId, e.id, {
          ...e,
          frequency: freqValue,
        });
        showToast("Récurrence mise à jour ✅");
      } catch (error) {
        console.error("Erreur update fréquence :", error);
      }
    }}
  >
    <option value="">-</option>
    <option value="Mensuelle">Mensuelle</option>
  </select>
</td>        


              
           <td className="p-2">
  <button
    onClick={() => openDeleteModal(e.id, "Revenue")}
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
                className="border rounded px-2 w-full sm:w-auto"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Description"
              />
            </td>
            <td className="p-2">
              <input
                className="border rounded px-2 w-full sm:w-auto"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                placeholder="Catégorie"
              />
            </td>
            <td className="p-2">
              <input
                type="number"
                className="border rounded px-2  w-full sm:w-auto"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="Montant"
              />
            </td>
        <td></td>
            <td>
              <button onClick={handleAddExpense} className="text-green-600 font-bold  w-full sm:w-auto">
                Ajouter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-right font-semibold mt-2">Total Dépenses : {totalExpenses} $</p>


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

  
      {toast && (
        <div className="fixed top-5 right-5 bg-violet-900 text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );


  
};

export default BudgetPage;