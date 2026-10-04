import Navbar from './components/Navbar'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'

function ProtectedAdmin({ children }) {
  const key = localStorage.getItem('adminKey');
  if (!key) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedAdmin>
            <AdminDashboard />
          </ProtectedAdmin>
        } />
      </Routes>
    </div>
  )
}

export default App
