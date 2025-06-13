import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddUser from "./pages/AddUser";
import { withAuthenticator } from '@aws-amplify/ui-react';

function App({ signOut, user }) {
  return (
    <>
      <header style={{ padding: "1rem", background: "#f3f3f3" }}>
        <span>👤 {user.username}</span>
        <button onClick={signOut} style={{ marginLeft: "1rem" }}>
          Logout
        </button>
      </header>

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<AddUser />} />
        </Routes>
      </Router>
    </>
  );
}

export default withAuthenticator(App);
