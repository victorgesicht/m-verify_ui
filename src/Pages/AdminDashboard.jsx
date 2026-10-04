import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ idNumber: '', fullName: '', phone: '', email: '', status: 'Pending', remarks: '', batch: 'TEST' });
  const [editingId, setEditingId] = useState(null);
  const nav = useNavigate();

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/api/admin/records');
      setRecords(data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem('adminKey');
        nav('/admin/login');
        return;
      }
      setError(err?.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/admin/records/${editingId}`, form);
      } else {
        await api.post('/api/admin/records', form);
      }
      setForm({ idNumber: '', fullName: '', phone: '', email: '', status: 'Pending', remarks: '', batch: 'TEST' });
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed');
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
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete record?')) return;
    try {
      await api.delete(`/api/admin/records/${id}`);
      fetchRecords();
    } catch (err) {
      setError('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={() => { localStorage.removeItem('adminKey'); nav('/admin/login'); }} className="bg-red-700 px-4 py-2 rounded">Logout</button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-neutral-900 p-4 rounded border border-neutral-800 mb-6">
          <input value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} placeholder="ID Number" className="bg-neutral-800 p-2 rounded" required />
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full Name" className="bg-neutral-800 p-2 rounded" required />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="bg-neutral-800 p-2 rounded" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-neutral-800 p-2 rounded" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-neutral-800 p-2 rounded">
            <option>Pending</option>
            <option>Verified</option>
            <option>Invalid</option>
          </select>
          <input value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Remarks" className="bg-neutral-800 p-2 rounded" />
          <button className="bg-emerald-700 px-4 py-2 rounded md:col-span-6">{editingId ? 'Update' : 'Add'}</button>
        </form>
        {loading ? <p>Loading...</p> : (
          <div className="overflow-x-auto bg-neutral-900 rounded border border-neutral-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id} className="border-t border-neutral-800">
                    <td className="p-2">{r.idNumber}</td>
                    <td className="p-2">{r.fullName}</td>
                    <td className="p-2">{r.phone}</td>
                    <td className="p-2">{r.email}</td>
                    <td className="p-2">{r.status}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => editRecord(r)} className="text-emerald-400">Edit</button>
                      <button onClick={() => deleteRecord(r.id)} className="text-red-400">Delete</button>
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
