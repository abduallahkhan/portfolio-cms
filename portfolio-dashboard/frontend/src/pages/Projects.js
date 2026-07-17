import React, { useEffect, useState } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, ExternalLink, Github, FolderKanban, X } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Graphic Design', 'Data Analysis', 'Other'];
const STATUSES = ['Completed', 'In Progress', 'Planned'];
const catClass = { 'Web Development': 'badge-web', 'Mobile Development': 'badge-mobile', 'Graphic Design': 'badge-design', 'Data Analysis': 'badge-data', 'Other': 'badge-other' };
const statusClass = { 'Completed': 'badge-completed', 'In Progress': 'badge-progress', 'Planned': 'badge-planned' };

const empty = { title: '', description: '', category: 'Web Development', technologies: '', liveUrl: '', githubUrl: '', status: 'Completed', featured: false };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getProjects(params);
      setProjects(res.data);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    load({ search: e.target.value, category: filterCat });
  };

  const handleFilter = (cat) => {
    setFilterCat(cat);
    load({ search, category: cat });
  };

  const openAdd = () => { setEditing(null); setForm(empty); setImageFile(null); setModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, technologies: p.technologies.join(', ') });
    setImageFile(null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'technologies') fd.append(k, JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await updateProject(editing, fd);
        toast.success('Project updated!');
      } else {
        await addProject(fd);
        toast.success('Project added!');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving project');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200, margin: 0 }}>
          <Search size={16} color="var(--text3)" />
          <input placeholder="Search projects..." value={search} onChange={handleSearch} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={filterCat} onChange={e => handleFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : projects.length === 0 ? (
        <div className="empty-state card">
          <FolderKanban size={48} />
          <h3>No projects found</h3>
          <p>Add your first project to get started</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}><Plus size={16} /> Add Project</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {projects.map(p => (
            <div className="card" key={p._id} style={{ padding: 0, overflow: 'hidden' }}>
              {p.image && (
                <img src={`https://portfolio-cms-production-22ff.up.railway.app${p.image}`} alt={p.title}
                  style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              )}
              {!p.image && (
                <div style={{ height: 160, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderKanban size={40} color="var(--text3)" />
                </div>
              )}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h3>
                  <span className={`badge ${statusClass[p.status] || 'badge-other'}`}>{p.status}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.description}
                </p>
                <div style={{ marginBottom: 12 }}>
                  <span className={`badge ${catClass[p.category] || 'badge-other'}`}>{p.category}</span>
                </div>
                <div style={{ marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {p.technologies.slice(0, 4).map(t => <span key={t} className="tech-tag">{t}</span>)}
                  {p.technologies.length > 4 && <span className="tech-tag">+{p.technologies.length - 4}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={13} /> Live</a>}
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Github size={13} /> Code</a>}
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button className="btn-icon" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p._id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Project' : 'Add New Project'}</h2>
              <button className="modal-close" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Technologies (comma separated)</label>
                <input className="form-input" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Live URL</label>
                  <input className="form-input" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://" />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input className="form-input" value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Project Image</label>
                <input type="file" accept="image/*" className="form-input" onChange={e => setImageFile(e.target.files[0])} style={{ padding: 8 }} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
