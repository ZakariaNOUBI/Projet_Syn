import { useState, useContext, useEffect } from 'react';
import { signupUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function AlertModal({ message, isError, onClose }) {
  return (
    <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50 p-2">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
        <p className={`mb-4 font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
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

function ProfilePage() {
  const { user, login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) navigate('/updateProfil');
  }, [user, navigate]);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  const strength = Object.values(passwordCriteria).filter(Boolean).length;

  const getStrengthColor = () => {
    if (strength <= 2) return '#f87171';
    if (strength === 3) return '#facc15';
    return '#34d399';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Mot de passe faible';
    if (strength === 3) return 'Mot de passe moyen';
    return 'Mot de passe fort';
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const { firstName, email, password, confirmPassword } = formData;

     if (!email || !password || !firstName || !confirmPassword) {
      setMessage
  ('Tous les champs sont obligatoires');
      setIsError(true);
      setShowModal(true);
      return;
    }
    if (firstName.length < 3) {
      setMessage('Le prénom doit contenir au moins 3 caractères.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (!email) {
      setMessage('Veuillez entrer votre email.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Format email invalide.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (strength < 4) {
      setMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      setIsError(true);
      setShowModal(true);
      return;
    }

    try {
      const payload = { firstName, email, password, isActive: true, phone: '' };
      const data = await signupUser(payload);

      login({
        id: data.id,
        firstName: data.firstName,
        email: data.email,
      });

    
      setMessage(`Bienvenue ${firstName} ! Votre compte a été créé avec succès 🎉`);
      setIsError(false);
      setShowModal(true);
      

      setFormData({ firstName: '', email: '', password: '', confirmPassword: '' });


      navigate('/updateProfil');
       

    } catch (err) {
      console.error('Erreur signup:', err);
      setMessage(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
      setIsError(true);
      setShowModal(true);
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-center">Vous êtes déjà connecté. Redirection...</p>
      </div>
    );
  }

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
            {formData.password && (
              <>
                <div className="mt-2 h-2 w-full bg-gray-300 rounded">
                  <div
                    className="h-2 rounded"
                    style={{ width: `${(strength / 4) * 100}%`, backgroundColor: getStrengthColor() }}
                  ></div>
                </div>
                <p className="text-sm mt-1" style={{ color: getStrengthColor() }}>
                  {getStrengthText()}
                </p>
              </>
            )}
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

        {showModal && (
          <AlertModal
            message={message}
            isError={isError}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;