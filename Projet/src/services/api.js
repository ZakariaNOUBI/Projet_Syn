
const API_URL = "https://money-pie-2.fly.dev/api/v1";


export async function signupUser(payload) {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de l'inscription");
  }

  return response.json();
}


export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  return response.json();
}

import axios from "axios";



const DEFAULT_USER_ID = 20;


export const getTransactions = async (userId = DEFAULT_USER_ID) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/transactions`);
    return response.data; 
  } catch (error) {
    console.error("Erreur récupération transactions :", error);
    throw error;
  }
};


export const addTransaction = async (transactionData, userId = DEFAULT_USER_ID) => {
  try {
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


export const updateTransaction = async (
  userId = DEFAULT_USER_ID,
  id,
  data
) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}/transactions/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Erreur modification transaction :", error);
    throw error;
  }
};


export const deleteTransaction = async (userId = DEFAULT_USER_ID, transactionId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}/transactions/${transactionId}`);
    return response.data; 
  } catch (error) {
    console.error("Erreur suppression transaction :", error);
    throw error;
  }
};

