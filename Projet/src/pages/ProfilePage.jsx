import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


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


    if (firstName.length < 3) {
      setMessage("Le prénom doit contenir au moins 3 caractères.");
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (email.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Veuillez entrer un email valide d'au moins 3 caractères.");
      setIsError(true);
      setShowModal(true);
      return;
    }

    // Validation mot de passe
    if (strength < 4) {
      setMessage(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre."
      );
      setIsError(true);
      setShowModal(true);
      return;
    }


    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      setIsError(true);
      setShowModal(true);
      return;
    }

    try {
      const payload = {
        firstName,
        birthDate: new Date().toISOString().split("T")[0],
        isActive: true,
        phone: "",
        email,
        password,
      };

      const data = await signupUser(payload);

      setMessage(`Bienvenue ${firstName} ! Votre compte a été créé avec succès 🎉`);
      setIsError(false);
      setShowModal(true);

      setFirstName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.message || "Erreur lors de l'inscription");
      setIsError(true);
      setShowModal(true);
    }
  };


  const getStrengthColor = () => {
    if (strength <= 2) return "#f87171"; 
    if (strength === 3) return "#facc15"; 
    return "#34d399"; 
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Mot de passe faible";
    if (strength === 3) return "Mot de passe moyen";
    return "Mot de passe fort";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-2">
        <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
        <p className="text-center mb-6 text-gray-600">
          Commencez à budgetter en quelques secondes!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
      
          <div>
            <label className="block mb-1 font-medium">Votre prénom :</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

    
          <div>
            <label className="block mb-1 font-medium">Votre courriel :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

     
          <div>
            <label className="block mb-1 font-medium">Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {password && (
              <>
                <div className="mt-2 h-2 w-full bg-gray-300 rounded">
                  <div
                    className="h-2 rounded transition-all duration-300"
                    style={{
                      width: `${(strength / 4) * 100}%`,
                      backgroundColor: getStrengthColor(),
                    }}
                  />
                </div>
                <p
                  className="text-sm mt-1 font-medium text-center"
                  style={{ color: getStrengthColor() }}
                >
                  {getStrengthText()}
                </p>
              </>
            )}
          </div>

   
          <div>
            <label className="block mb-1 font-medium">Confirmer mot de passe :</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-semibold shadow-lg hover:brightness-110 transition duration-300"
          >
            S’inscrire
          </button>
        </form>


        {showModal && (
          <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 p-2">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
              <p className={`mb-4 font-medium ${isError ? "text-red-500" : "text-green-500"}`}>
                {message}
              </p>
              <button
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;