import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const payload = {
        firstName,
        lastName: lastName || "Dupont",
        birthDate: new Date().toISOString().split("T")[0], // format "YYYY-MM-DD"
        isActive: true,
        phone: "11111111111",
        email,
        password
      };

      const data = await signupUser(payload);

      // Ajouter à la liste globale
      if (onNewUser) onNewUser({ id: data.user.id, firstName, email });

      setMessage("Compte créé avec succès !");
      setIsError(false);

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
      setIsError(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Inscription</h1>

        {message && (
          <p className={`text-center mb-4 ${isError ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Prénom</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500"/>
          </div>

          <div>
            <label>Nom</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500"/>
          </div>

          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500"/>
          </div>

          <div>
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500"/>
          </div>

          <button type="submit" className="w-full bg-purple-500 text-white rounded py-2 mt-2 hover:bg-purple-600 transition">
            S’inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;