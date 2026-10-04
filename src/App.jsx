import Navbar from './components/Navbar';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;