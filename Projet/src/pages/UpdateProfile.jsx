function FieldLabel({ text, required = false }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function Field({ label, required = false, value, onChange, type = 'text', isEditing }) {
  return (
    <div className="mb-4">
      <FieldLabel text={label} required={required} />
      {isEditing ? (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
      ) : (
        <p className={`bg-gray-200 rounded px-3 py-2 text-sm ${value ? 'text-gray-700' : 'text-gray-600 italic'}`}>{type === 'password' ? '•••••••' : value || 'Non renseigné'}</p>
      )}
    </div>
  );
}

const PROVINCES = ['QC', 'ON', 'NL', 'NS', 'PE', 'NB', 'MB', 'SK', 'AB', 'BC', 'YT', 'NT', 'NU'];

function UpdateProfile() {
  const { user, loading } = useContext(UserContext);
  const userId = user?.id || 30;

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    email: '',
    password: '',
  });

  const passwordCriteria = {
    length: personalInfo.password.length >= 8,
    uppercase: /[A-Z]/.test(personalInfo.password),
    lowercase: /[a-z]/.test(personalInfo.password),
    number: /\d/.test(personalInfo.password),
  };

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      email: '',
      password: '',
    };

    let isValid = true;

    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis.';
      isValid = false;
    } else if (personalInfo.firstName.trim().length < 3) {
      newErrors.firstName = 'Le prénom doit contenir au moins 3 caractères.';
      isValid = false;
    }

    if (!personalInfo.email.trim()) {
      newErrors.email = 'Le courriel est requis.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
      newErrors.email = 'Veuillez entrer un courriel valide.';
      isValid = false;
    }

    if (personalInfo.password.trim() !== '') {
      const isPasswordValid = passwordCriteria.length && passwordCriteria.uppercase && passwordCriteria.lowercase && passwordCriteria.number;

      if (!isPasswordValid) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const toISODate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const handleSave = async () => {
    const isFormValid = validateForm();

    const newSectionErrors = {
      personalAddress: '',
      workAddress: '',
      school: '',
      banking: '',
    };

    let areSectionsValid = true;

    if (!isAddressComplete(personalAddress)) {
      newSectionErrors.personalAddress = "Veuillez remplir tous les champs requis de l'adresse personnelle.";
      areSectionsValid = false;
    }

    if (!isAddressComplete(workAddress)) {
      newSectionErrors.workAddress = "Veuillez remplir tous les champs requis de l'adresse au travail.";
      areSectionsValid = false;
    }

    if (!isSchoolComplete(schoolInfo)) {
      newSectionErrors.school = 'Veuillez remplir tous les champs requis des renseignements scolaires.';
      areSectionsValid = false;
    }

    if (!isBankingComplete(bankingInfo)) {
      newSectionErrors.banking = 'Veuillez remplir tous les champs requis des renseignements bancaires.';
      areSectionsValid = false;
    }

    setSectionErrors(newSectionErrors);

    if (!isFormValid || !areSectionsValid) {
      return;
    }
    try {
      console.log('Formulaire ok');

      if (hasStartedSchool(schoolInfo)) {
        await updateSchoolDetails(userId, {
          schoolName: schoolInfo.schoolName,
          fieldOfStudy: schoolInfo.fieldOfStudy,
          startDate: toISODate(schoolInfo.startDate),
          projectedEndDate: schoolInfo.projectedEndDate ? toISODate(schoolInfo.projectedEndDate) : null,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Erreur sauvegarde profil :', error);
      setError('Une erreur est survenue lors de la sauvegarde.');
    }
  };

  const [personalAddress, setPersonalAddress] = useState({
    //THIS OK
    streetNumber: '',
    streetName: '',
    city: '',
    province: '',
    country: 'CA',
    type: 'PERSONAL',
  });

  const [workAddress, setWorkAddress] = useState({
    // THIS OK
    streetNumber: '',
    streetName: '',
    city: '',
    province: '',
    country: 'CA',
    type: 'WORK',
  });

  const [schoolInfo, setSchoolInfo] = useState({
    schoolName: '',
    fieldOfStudy: '',
    startDate: '',
    projectedEndDate: '',
  });

  const [bankingInfo, setBankingInfo] = useState({
    institutionName: '',
    accountInfo: '',
    loanInfo: '',
    other: '',
  });

  const [sectionErrors, setSectionErrors] = useState({
    personalAddress: '',
    workAddress: '',
    school: '',
    banking: '',
  });

  const isAddressComplete = (address) => {
    return address.streetNumber.trim() !== '' && address.streetName.trim() !== '' && address.city.trim() !== '' && address.province.trim() !== '';
  };

  const isSchoolComplete = (school) => {
    return school.schoolName.trim() !== '' && school.fieldOfStudy.trim() !== '' && school.startDate.trim() !== '';
  };

  const isBankingComplete = (banking) => {
    return banking.institutionName.trim() !== '' && banking.accountInfo.trim() !== '';
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-2">
        <h1 className="text-2xl md:text-4xl font-bold text-violet-900">Détail du profil</h1>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded shadow hover:bg-purple-700 self-start">
            Mettre à jour
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              Annuler
            </button>
            <button onClick={handleSave} className="bg-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded shadow hover:bg-purple-700">
              Sauvegarder
            </button>
          </div>
        )}
      </div>

      {/* Card-1 */}
      <div className="bg-white shadow-md border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-lg font-bold mb-6">Renseignements personnels</h2>

        <p className="text-sm text-gray-700 mb-4">
          Les champs marqués d'un <span className="text-red-500 font-bold">*</span> sont obligatoires.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          <div>
            <Field label="Prénom" required value={personalInfo.firstName} isEditing={isEditing} onChange={(newValue) => setPersonalInfo({ ...personalInfo, firstName: newValue })} />

            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Field label="Nom" value={personalInfo.lastName} isEditing={isEditing} onChange={(newValue) => setPersonalInfo({ ...personalInfo, lastName: newValue })} />
          </div>
          <div>
            <Field label="Courriel" required value={personalInfo.email} isEditing={isEditing} onChange={(newValue) => setPersonalInfo({ ...personalInfo, email: newValue })} />

            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <Field label="Téléphone" value={personalInfo.phone} isEditing={isEditing} onChange={(newValue) => setPersonalInfo({ ...personalInfo, phone: newValue })} />
          </div>
          <div>
            <Field label="Date de naissance" value={personalInfo.birthDate} isEditing={isEditing} onChange={(newValue) => setPersonalInfo({ ...personalInfo, birthDate: newValue })} />
          </div>
          <div>
            <Field
              label="Mot de passe"
              required
              type="password"
              value={personalInfo.password}
              isEditing={isEditing}
              onChange={(newValue) => setPersonalInfo({ ...personalInfo, password: newValue })}
            />

            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
        </div>
      </div>

      {/* Card-2 */}
      <div className="bg-white shadow-md border border-gray-300 rounded p-6 mb-6">
        <h2 className="text-lg font-bold mb-6">Adresses</h2>

        <p className="text-sm font-semibold text-purple-700 mb-3">Adresse personnelle</p>
        {sectionErrors.personalAddress && <p className="text-red-500 text-sm mb-3">{sectionErrors.personalAddress}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <Field
              label="Numéro civique"
              required
              value={personalAddress.streetNumber}
              isEditing={isEditing}
              onChange={(newValue) => setPersonalAddress({ ...personalAddress, streetNumber: newValue })}
            />
          </div>
          <div>
            <Field label="Rue" required value={personalAddress.streetName} isEditing={isEditing} onChange={(newValue) => setPersonalAddress({ ...personalAddress, streetName: newValue })} />
          </div>

          <div>
            <Field label="Ville" required value={personalAddress.city} isEditing={isEditing} onChange={(newValue) => setPersonalAddress({ ...personalAddress, city: newValue })} />
          </div>

          <div className="mb-4">
            <FieldLabel text="Province" required />
            {isEditing ? (
              <select
                value={personalAddress.province}
                onChange={(e) =>
                  setPersonalAddress({
                    ...personalAddress,
                    province: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option value="">Sélectionner...</option>
                {PROVINCES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            ) : (
              <p className={`bg-gray-200 rounded px-3 py-2 text-sm ${personalAddress.province ? 'text-gray-700' : 'text-gray-600 italic'}`}>{personalAddress.province || 'Non renseigné'}</p>
            )}
          </div>

          <div>
            <FieldLabel text="Pays" />
            <span className="inline-block bg-gray-200 text-purple-800 text-sm font-bold px-3 py-2 rounded">CA</span>
          </div>
        </div>
        <hr className="mb-6"></hr>

        <p className="text-sm font-semibold text-purple-700 mb-3">Adresse au travail</p>

        {sectionErrors.workAddress && <p className="text-red-500 text-sm mb-3">{sectionErrors.workAddress}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <Field label="Numéro civique" required value={workAddress.streetNumber} isEditing={isEditing} onChange={(newValue) => setWorkAddress({ ...workAddress, streetNumber: newValue })} />
          </div>

          <div>
            <Field label="Rue" required value={workAddress.streetName} isEditing={isEditing} onChange={(newValue) => setWorkAddress({ ...workAddress, streetName: newValue })} />
          </div>

          <div>
            <Field label="Ville" required value={workAddress.city} isEditing={isEditing} onChange={(newValue) => setWorkAddress({ ...workAddress, city: newValue })} />
          </div>

          <div className="mb-4">
            <FieldLabel text="Province" required />
            {isEditing ? (
              <select
                value={workAddress.province}
                onChange={(e) =>
                  setWorkAddress({
                    ...workAddress,
                    province: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option value="">Sélectionner...</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            ) : (
              <p className={`bg-gray-200 rounded px-3 py-2 text-sm ${workAddress.province ? 'text-gray-700' : 'text-gray-600 italic'}`}>{workAddress.province || 'Non renseigné'}</p>
            )}
          </div>

          <div>
            <FieldLabel text="Pays" />
            <span className="inline-block bg-gray-200 text-purple-800 text-sm font-bold px-3 py-2 rounded">CA</span>
          </div>
        </div>
      </div>

      {/* Card-3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md border border-gray-300 rounded p-6">
          <h2 className="text-lg font-bold mb-6">Établissement scolaire</h2>
          {sectionErrors.school && <p className="text-red-500 text-sm mb-3">{sectionErrors.school}</p>}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Field label="Nom de l'école" required value={schoolInfo.schoolName} isEditing={isEditing} onChange={(newValue) => setSchoolInfo({ ...schoolInfo, schoolName: newValue })} />
            </div>

            <div>
              <Field label="Programme" required value={schoolInfo.fieldOfStudy} isEditing={isEditing} onChange={(newValue) => setSchoolInfo({ ...schoolInfo, fieldOfStudy: newValue })} />
            </div>

            <div>
              <Field label="Date de début" required type="date" value={schoolInfo.startDate} isEditing={isEditing} onChange={(newValue) => setSchoolInfo({ ...schoolInfo, startDate: newValue })} />
            </div>

            <div>
              <Field
                label="Date de fin prévue"
                type="date"
                value={schoolInfo.projectedEndDate}
                isEditing={isEditing}
                onChange={(newValue) => setSchoolInfo({ ...schoolInfo, projectedEndDate: newValue })}
              />
            </div>
          </div>
        </div>

        {/* Card-4 */}
        <div className="bg-white shadow-md border border-gray-300 rounded p-6">
          <h2 className="text-lg font-bold mb-6">Renseignements bancaires</h2>
          {sectionErrors.banking && <p className="text-red-500 text-sm mb-3">{sectionErrors.banking}</p>}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <Field
                label="Nom de l'institution"
                required
                value={bankingInfo.institutionName}
                isEditing={isEditing}
                onChange={(newValue) => setBankingInfo({ ...bankingInfo, institutionName: newValue })}
              />
            </div>

            <div>
              <Field label="Info du compte" required value={bankingInfo.accountInfo} isEditing={isEditing} onChange={(newValue) => setBankingInfo({ ...bankingInfo, accountInfo: newValue })} />
            </div>

            <div>
              <Field label="Info de prêt" value={bankingInfo.loanInfo} isEditing={isEditing} onChange={(newValue) => setBankingInfo({ ...bankingInfo, loanInfo: newValue })} />
            </div>

            <div>
              <Field label="Autre" value={bankingInfo.other} isEditing={isEditing} onChange={(newValue) => setBankingInfo({ ...bankingInfo, other: newValue })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
