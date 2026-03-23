function UpdateProfile() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-2">
        <h1 className="text-2xl md:text-4xl font-bold text-violet-900">Détail du profil</h1>
        <button className="bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded shadow hover:bg-purple-700 self-start">Mettre à jour</button>
      </div>
      {/* Card-1 */}
      <div className="bg-white shadow-md border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-lg font-bold mb-6">Renseignements personnels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Courriel</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm">••••••••</p>
          </div>
        </div>
      </div>

      {/* Card-2 */}
      <div className="bg-white shadow-md border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-lg font-bold mb-6">Adresses</h2>

        <p className="text-sm font-semibold text-purple-700 mb-3">Adresse personnelle</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro civique</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rue</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
          </div>
        </div>
      </div>

      {/* Card-3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md border border-gray-300 rounded p-6">
          <h2 className="text-lg font-bold mb-6">Établissement scolaire</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'école</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Programme</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin prévue</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
          </div>
        </div>

        {/* Card-4 */}
        <div className="bg-white shadow-md border border-gray-300 rounded p-6">
          <h2 className="text-lg font-bold mb-6">Renseignements bancaires</h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'institution</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Info du compte</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Info de prêt</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autre</label>
              <p className="bg-gray-200 rounded px-3 py-2 text-sm text-gray-600 italic">Non renseigné</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
