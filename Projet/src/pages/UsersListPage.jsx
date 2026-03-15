import { useEffect, useState } from "react";
import { getUsers } from "../services/api";

function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Erreur récupération utilisateurs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p className="p-8">Chargement...</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Utilisateurs inscrits</h1>

      {users.length === 0 ? (
        <p className="text-gray-500">Aucun utilisateur pour le moment.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="p-3 border rounded bg-white">
              <p><strong>Prénom:</strong> {user.firstName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UsersListPage;