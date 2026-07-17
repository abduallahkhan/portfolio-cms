import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Tag, X } from 'lucide-react';

const BASE = 'https://portfolio-cms-production-22ff.up.railway.app/api';
const COLORS = ['#6c63ff', '#ff6584', '#43d4a0', '#f6ad55', '#63b3ed', '#f687b3', '#fc8181'];
const ICONS = ['📁', '🌐', '📱', '🎨', '📊', '⚙️', '🚀', '💡', '🔧', '📝'];
const empty = { name: '', color: '#6c63ff', icon: '📁', description: '' };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(`${BASE}/categories`);
      setCategories(res.data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c) => { setEditing(c._id); setForm({ name: c.name, color: c.color, icon: c.icon, description: c.description }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`${BASE}/categories/${editing}`, form);
        toast.success('Category updated!');
      } else {
        await axios.post(`${BASE}/categories`, form);
        toast.success('Category added!');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${BASE}/categories/${id}`);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Category</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : categories.length === 0 ? (
        <div className="empty-state card">
          <Tag size={48} />
          <h3>No categories yet</h3>
          <p>Create categories to organize your projects</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}><Plus size={16} /> Add Category</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map(c => (
            <div className="card" key={c._id} style={{ borderLeft: `4px solid ${c.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {c.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" onClick={() => openEdit(c)}><Pencil size={13} /></button>
                  <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(c._id)}><Trash2 size={13} /></button>
                </div>
              </div>
              {c.description && (
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{c.description}</p>
              )}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color }} />
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{c.color}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Web Development" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description..." />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {ICONS.map(icon => (
                    <button key={icon} type="button"
                      onClick={() => setForm({ ...form, icon })}
                      style={{
                        width: 40, height: 40, borderRadius: 10, fontSize: 20,
                        background: form.icon === icon ? 'var(--accent)' : 'var(--bg3)',
                        border: `2px solid ${form.icon === icon ? 'var(--accent)' : 'var(--border)'}`,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                  {COLORS.map(color => (
                    <button key={color} type="button"
                      onClick={() => setForm({ ...form, color })}
                      style={{
                        width: 32, height: 32, borderRadius: '50%', background: color,
                        border: form.color === color ? '3px solid white' : '3px solid transparent',
                        cursor: 'pointer', outline: form.color === color ? `3px solid ${color}` : 'none'
                      }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
