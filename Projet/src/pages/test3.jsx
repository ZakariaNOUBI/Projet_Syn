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
const [showConfirmModal, setShowConfirmModal] = useState(false);
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
    const isRecurring = Number(r.frequency) === 1;

    const updatedData = {
      frequency: isRecurring ? -1 : 1,
    };

    const updated = await updateTransaction(userId, r.id, updatedData);

    if (type === "Revenue") {
      setRevenues((prev) =>
        prev.map((item) => (item.id === r.id ? updated : item))
      );
    }

    showToast("Récurrence mise à jour ✅");
  } catch (error) {
    console.error("ERREUR :", error.response?.data || error);
    showToast("Erreur mise à jour ❌");
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
const handleNewMonth = () => {
  setShowConfirmModal(true);
};
const confirmNewMonth = async () => {
  setShowConfirmModal(false);

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
    console.error(error);
    showToast("Erreur !");
  }
};
 return (
  <div className="p-4 bg-gray-50 min-h-screen">

    {/* HEADER */}
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      <p className="text-lg font-semibold">
        Balance :
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

    <h1 className="text-2xl font-bold mb-6 text-violet-900">
      Budget Mensuel
    </h1>

    {/* REVENUS */}
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Revenus</h2>

      <div className="flex flex-col gap-3">
        {revenues.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg p-3 flex flex-wrap justify-between items-center gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold">{r.description}</p>
            </div>

            <div className="text-green-600 font-bold">
              {r.amount} $
            </div>

            <button
              onClick={() => toggleFrequency(r, "Revenue")}
              className={`w-6 h-6 rounded-full border flex items-center justify-center
              ${r.frequency === 1 ? "bg-green-500" : "bg-gray-200"}`}
            >
              {r.frequency === 1 && <span className="text-white text-xs">✓</span>}
            </button>

            <button
              onClick={() => openDeleteModal(r.id, "Revenue")}
              className="text-red-500"
            >
              🗑️
            </button>
          </div>
        ))}

        {/* ADD */}
        <div className="border rounded-lg p-3 flex flex-wrap gap-2">
          <input
            className="border rounded px-2 flex-1"
            value={newRevenue.description}
            onChange={(e) =>
              setNewRevenue({ ...newRevenue, description: e.target.value })
            }
            placeholder="Description"
          />

          <input
            type="number"
            className="border rounded px-2 w-32"
            value={newRevenue.amount}
            onChange={(e) =>
              setNewRevenue({ ...newRevenue, amount: e.target.value })
            }
            placeholder="Montant"
          />

          <button
            onClick={handleAddRevenue}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    {/* DEPENSES */}
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Dépenses</h2>

      <div className="flex flex-col gap-3">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="border rounded-lg p-3 flex flex-wrap justify-between items-center gap-3"
          >
            <div>
              <p className="font-semibold">{e.description}</p>
              <p className="text-sm text-gray-500">{e.category}</p>
            </div>

            <div className="text-red-600 font-bold">
              -{e.amount} $
            </div>

            <select
              className="border rounded px-2 py-1"
              value={e.frequency === 1 ? "Mensuelle" : ""}
              onChange={async (event) => {
                const freqValue = event.target.value === "Mensuelle" ? 1 : -1;

                setExpenses((prev) =>
                  prev.map((item) =>
                    item.id === e.id ? { ...item, frequency: freqValue } : item
                  )
                );

                await updateTransaction(userId, e.id, {
                  ...e,
                  frequency: freqValue,
                });
              }}
            >
              <option value="">-</option>
              <option value="Mensuelle">Mensuelle</option>
            </select>

            <button
              onClick={() => openDeleteModal(e.id, "Expense")}
              className="text-red-500"
            >
              🗑️
            </button>
          </div>
        ))}

        {/* ADD */}
        <div className="border rounded-lg p-3 flex flex-wrap gap-2">
          <input
            className="border rounded px-2 flex-1"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            placeholder="Description"
          />

          <input
            className="border rounded px-2"
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            placeholder="Catégorie"
          />

          <input
            type="number"
            className="border rounded px-2 w-28"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            placeholder="Montant"
          />

          <button
            onClick={handleAddExpense}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    {/* TOTALS */}
    <div className="mt-6 text-right font-semibold">
      Revenus : {totalRevenue} $ | Dépenses : {totalExpenses} $
    </div>

    {/* MODALS restent pareils mais change width */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow">
          <h2 className="mb-4 font-bold">Supprimer ?</h2>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                handleDelete(transactionToDelete.id, transactionToDelete.type);
                setShowModal(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Oui
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Non
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);


  
};

export default BudgetPage;