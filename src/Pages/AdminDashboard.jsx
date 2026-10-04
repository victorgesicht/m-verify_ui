import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';

const EMPTY_FORM = {
  idNumber: '',
  fullName: '',
  phone: '',
  email: '',
  status: 'Pending',
  remarks: '',
  batch: 'TEST',
};

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('adminUser');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await adminApi.list();
      setRecords(data);
    } catch (err) {
      if (err?.response?.status === 401) return;
      setError(err?.response?.data?.error || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await adminApi.update(editingId, form);
      } else {
        await adminApi.create(form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      if (err?.response?.status === 401) return;
      setError(err?.response?.data?.error || err?.response?.data?.title || 'Save failed');
    }
  };

  const editRecord = (r) => {
    setForm({
      idNumber: r.idNumber,
      fullName: r.fullName,
      phone: r.phone,
      email: r.email,
      status: r.status,
      remarks: r.remarks,
      batch: r.batch,
    });
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete this record? This cannot be undone.')) return;
    try {
      await adminApi.remove(id);
      fetchRecords();
    } catch (err) {
      if (err?.response?.status === 401) return;
      setError('Delete failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    nav('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex flex-col h-2.5 w-full">
        <div className="flex-1 bg-black"></div>
        <div className="flex-1 bg-red-700"></div>
        <div className="flex-1 bg-emerald-700"></div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            {user && (
              <p className="text-neutral-400 text-sm">
                Signed in as <span className="text-white">{user.email}</span>
                {user.roles?.length ? ` (${user.roles.join(', ')})` : ''}
              </p>
            )}
          </div>
          <button onClick={logout} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded">
            Sign out
          </button>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-neutral-900 p-4 rounded border border-neutral-800 mb-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">ID Number</label>
            <input value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} required className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="2547..." className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600">
              <option>Pending</option>
              <option>Verified</option>
              <option>Invalid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Batch</label>
            <input value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600" />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Remarks</label>
            <input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full bg-neutral-800 p-2 rounded outline-none focus:border-emerald-600" />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button className="bg-emerald-700 hover:bg-emerald-800 px-6 py-2 rounded font-bold">
              {editingId ? 'Update record' : 'Add record'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }} className="px-4 py-2 rounded border border-neutral-700">
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <p className="text-neutral-400">Loading records...</p>
        ) : records.length === 0 ? (
          <p className="text-neutral-400">No records yet.</p>
        ) : (
          <div className="overflow-x-auto bg-neutral-900 rounded border border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 text-left">
                  <th className="p-3">ID Number</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Batch</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t border-neutral-800">
                    <td className="p-3 font-mono">{r.idNumber}</td>
                    <td className="p-3">{r.fullName}</td>
                    <td className="p-3">{r.phone}</td>
                    <td className="p-3">{r.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        r.status === 'Verified' ? 'bg-emerald-900 text-emerald-300' :
                        r.status === 'Invalid' ? 'bg-red-900 text-red-300' :
                        'bg-neutral-800 text-neutral-300'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3">{r.batch}</td>
                    <td className="p-3 space-x-3">
                      <button onClick={() => editRecord(r)} className="text-emerald-400 hover:text-emerald-300">Edit</button>
                      <button onClick={() => deleteRecord(r.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}