import { useState, useContext } from 'react';
import { signupUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


function AlertModal({ onClose }) {
  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 p-2">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <button
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}


function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 4.5c-4 0-7 4-7 4s3 4 7 4 7-4 7-4-3-4-7-4zM10 11a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10 4.5c-4 0-7 4-7 4s3 4 7 4c1.7 0 3.2-.7 4.3-1.8M14.7 9.3a2 2 0 11-2.7-2.7" />
    </svg>
  );
}

// Page d'inscription
export default function ProfilePage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };
  const strength = Object.values(passwordCriteria).filter(Boolean).length;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { firstName, email, password, confirmPassword } = formData;


  if (!firstName || !email || !password || !confirmPassword) return;
  if (firstName.length < 3) return;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  if (strength < 4) return;
  if (password !== confirmPassword) return;


  try {
  const payload = { firstName, email, password, isActive: true, phone: '' };
  const data = await signupUser(payload);

  login({ id: data.id, firstName: data.firstName, email: data.email });

 
  navigate('/updateProfil', { state: { welcomeMessage: `Bienvenue ${data.firstName} !` } });
} catch (err) {
  console.error('Erreur signup:', err);
}

   
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-2">
        <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
        <p className="text-center mb-6 text-gray-600">Commencez à budgetter en quelques secondes! 💰</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Votre prénom :</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Votre courriel :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mot de passe :</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirmer mot de passe :</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-semibold shadow-lg hover:brightness-110 transition duration-300"
          >
            S’inscrire
          </button>
        </form>

        {showModal && <AlertModal onClose={handleCloseModal} />}
      </div>
    </div>
  );
}