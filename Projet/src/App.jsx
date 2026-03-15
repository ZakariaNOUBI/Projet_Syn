import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import ProfilePage from "./pages/ProfilePage";
import UsersListPage from "./pages/UsersListPage";

function App() {
  const [usersList, setUsersList] = useState([]);

  const addUserToList = (user) => {
    setUsersList((prev) => [...prev, user]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersListPage />} />
        <Route path="/profile" element={<ProfilePage onNewUser={addUserToList} />} />
      </Routes>
    </Router>
  );
}

export default App;