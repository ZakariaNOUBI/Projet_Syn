import axios from "axios";

const API_URL = "https://money-pie-2.fly.dev/api/v1";
const DEFAULT_USER_ID = 20;

// ===============================
// Récupérer toutes les transactions d’un utilisateur
// ===============================
export const getTransactions = async (userId = DEFAULT_USER_ID) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Erreur récupération transactions :", error);
    throw error;
  }
};

// ===============================
// Ajouter une transaction
// ===============================
export const addTransaction = async (transactionData, userId = 20) => {
  try {
    // Si userId non défini, utiliser défaut
    if (!transactionData.userId) transactionData.userId = userId;

    const response = await axios.post(
      `${API_URL}/users/${userId}/transactions`,
      transactionData
    );
    return response.data;
  } catch (error) {
    console.error("Erreur ajout transaction :", error);
    throw error;
  }
};

// ===============================
// Modifier une transaction
// ===============================
export const updateTransaction = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/transactions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erreur modification transaction :", error);
    throw error;
  }
};

// ===============================
// Supprimer une transaction
// ===============================
export const deleteTransaction = async (userId = DEFAULT_USER_ID, transactionId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur suppression transaction :", error);
    throw error;
  }
};