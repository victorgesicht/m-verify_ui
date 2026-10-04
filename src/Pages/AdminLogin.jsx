import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminLogin() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/admin/auth/verify', { apiKey: apiKey.trim() });
      if (data.valid) {
        localStorage.setItem('adminKey', apiKey.trim());
        nav('/admin');
      } else {
        setError('Invalid API key');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Invalid API key');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <form onSubmit={login} className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded mb-4 outline-none"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button className="w-full bg-emerald-700 hover:bg-emerald-800 py-3 rounded font-bold">
          Login
        </button>
      </form>
    </div>
  );
}
