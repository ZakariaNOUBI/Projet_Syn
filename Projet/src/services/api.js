const API_URL = "https://money-pie-2.fly.dev/api/v1";

// Créer un nouvel utilisateur
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

// Récupérer tous les utilisateurs
export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  return response.json();
}

// Récupérer un utilisateur spécifique par ID
export async function getUserById(id) {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
  return response.json();
}