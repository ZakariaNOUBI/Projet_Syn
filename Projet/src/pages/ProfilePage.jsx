import { useState, useContext } from 'react';
import { signupUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useState, useContext } from 'react';

function ProfilePage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(UserContext); //add
 
  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
 
  const strength = Object.values(passwordCriteria).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    // 1. Vérification du mot de passe avant l'appel API
    if (!validatePassword(password)) {
      const errorMsg = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.";
      setMessage(errorMsg);
      setIsError(true);
      window.alert("⚠️ " + errorMsg);
      return;
    }

    try {
      const payload = {
        firstName,
        lastName: lastName || "Non renseigné",
        birthDate: new Date().toISOString().split("T")[0], 
        isActive: true,
        phone: "00000000000",
        email,
        password
      };

      const data = await signupUser(payload);

      // 2. Stockage de l'ID pour la suite
      if (data && data.id) {
        localStorage.setItem("userId", data.id);
        
        // --- ALERTE DE CONFIRMATION ---
        window.alert("✅ Utilisateur créé avec succès !");
        
        setMessage("Inscription réussie ! Redirection...");
        setIsError(false);

        // 3. Reset et Redirection immédiate après le "OK" de l'alerte
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        
        navigate("/UpdateProfile");
      }

    } catch (err) {
      console.error(err);
      const errorDetail = err.message || "Erreur lors de l'inscription";
      setMessage(errorDetail);
      setIsError(true);
      window.alert("❌ " + errorDetail);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border-t-4 border-purple-600">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Inscription</h1>

        {message && (
          <div className={`text-sm p-3 rounded mb-4 text-center font-medium ${isError ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Prénom</label>
            <input
              type="text"
              placeholder="Entrez votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Nom</label>
            <input
              type="text"
              placeholder="Entrez votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="exemple@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded py-2.5 mt-4 hover:bg-purple-700 transition font-bold shadow-md uppercase tracking-wider"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;