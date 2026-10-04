import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.login(email.trim(), password);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        email: data.email,
        username: data.username,
        roles: data.roles,
      }));
      nav('/admin');
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        (err?.response?.status === 429
          ? 'Too many attempts. Please wait and try again.'
          : 'Login failed')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <form onSubmit={login} className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-1">Admin Login</h2>
        <p className="text-neutral-400 text-sm mb-6">Authorized personnel only. Access is logged.</p>

        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@m-verify.ke"
          autoComplete="username"
          required
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded mb-4 outline-none focus:border-emerald-600"
        />

        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded mb-4 outline-none focus:border-emerald-600"
        />

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 py-3 rounded font-bold"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}