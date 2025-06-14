import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import SkillListPage from "./pages/SkillListPage";
import SkillDetailPage from "./pages/SkillDetailPage";
import NewSkillPage from "./pages/NewSkillPage";
import EditSkillPage from "./pages/SkillFormPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills/:id"
            element={
              <ProtectedRoute>
                <SkillDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-skill"
            element={
              <ProtectedRoute>
                <NewSkillPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills/:id/edit"
            element={
              <ProtectedRoute>
                <EditSkillPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}
export default App;
