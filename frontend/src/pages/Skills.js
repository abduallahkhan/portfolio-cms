import React, { useEffect, useState } from 'react';
import { getSkills, addSkill, updateSkill, deleteSkill } from '../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Code2, X } from 'lucide-react';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'Database', 'DevOps', 'Design', 'Other'];
const catColors = {
  Frontend: '#6c63ff', Backend: '#43d4a0', Mobile: '#ff6584',
  Database: '#f6ad55', DevOps: '#63b3ed', Design: '#f687b3', Other: '#9ba3c7'
};
const empty = { name: '', category: 'Frontend', proficiency: 80 };

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await getSkills();
      setSkills(res.data);
    } catch { toast.error('Failed to load skills'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (s) => { setEditing(s._id); setForm({ name: s.name, category: s.category, proficiency: s.proficiency }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await updateSkill(editing, form); toast.success('Skill updated!'); }
      else { await addSkill(form); toast.success('Skill added!'); }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving skill');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try { await deleteSkill(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  // Group skills by category
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Skill</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : skills.length === 0 ? (
        <div className="empty-state card">
          <Code2 size={48} />
          <h3>No skills yet</h3>
          <p>Add your first skill to showcase your expertise</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}><Plus size={16} /> Add Skill</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div className="card" key={category}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColors[category] || '#9ba3c7' }} />
                  <div className="card-title">{category}</div>
                  <span style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 20 }}>
                    {catSkills.length} skills
                  </span>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                {catSkills.map(s => (
                  <div key={s._id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: catColors[s.category] || 'var(--text2)' }}>
                          {s.proficiency}%
                        </span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${s.proficiency}%`,
                            background: `linear-gradient(90deg, ${catColors[s.category] || 'var(--accent)'}, ${catColors[s.category] || 'var(--accent2)'}aa)`
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon" onClick={() => openEdit(s)}><Pencil size={13} /></button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s._id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Skill' : 'Add New Skill'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Skill Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. React.js" required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Proficiency: <strong style={{ color: catColors[form.category] }}>{form.proficiency}%</strong></label>
                <input
                  type="range" min="0" max="100" value={form.proficiency}
                  onChange={e => setForm({ ...form, proficiency: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: catColors[form.category] || 'var(--accent)', marginTop: 8 }}
                />
                <div className="progress-bar-bg" style={{ marginTop: 8 }}>
                  <div className="progress-bar-fill" style={{
                    width: `${form.proficiency}%`,
                    background: catColors[form.category] || 'var(--accent)'
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
