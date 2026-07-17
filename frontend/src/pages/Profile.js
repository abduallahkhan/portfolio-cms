import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, uploadProfileImage } from '../api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Upload, Github, Linkedin, Twitter, Instagram, User, Lock, Eye, EyeOff } from 'lucide-react';

const BASE = 'https://portfolio-cms-production-22ff.up.railway.app/api';

export default function Profile() {
  const [form, setForm] = useState({
    name: '', title: '', bio: '', email: '', phone: '',
    location: '', website: '',
    social: { github: '', linkedin: '', twitter: '', instagram: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  // Password change
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    getProfile()
      .then(res => {
        const d = res.data;
        setForm({
          name: d.name || '', title: d.title || '', bio: d.bio || '',
          email: d.email || '', phone: d.phone || '',
          location: d.location || '', website: d.website || '',
          social: d.social || { github: '', linkedin: '', twitter: '', instagram: '' }
        });
        if (d.profileImage) setImagePreview(`https://portfolio-cms-production-22ff.up.railway.app${d.profileImage}`);
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('profileImage', imageFile);
      await uploadProfileImage(fd);
      toast.success('Profile image updated!');
      setImageFile(null);

      // Create notification
      await axios.post(`${BASE}/notifications`, {
        message: 'Profile image updated successfully',
        type: 'success', icon: '🖼️'
      });
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile saved!');
      await axios.post(`${BASE}/notifications`, {
        message: 'Profile information updated successfully',
        type: 'success', icon: '✅'
      });
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }
    setPwSaving(true);
    try {
      await axios.put(`${BASE}/auth/change-password`, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      await axios.post(`${BASE}/notifications`, {
        message: 'Password changed successfully',
        type: 'success', icon: '🔐'
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setPwSaving(false); }
  };

  const setField = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const setSocial = (field, val) => setForm(prev => ({ ...prev, social: { ...prev.social, [field]: val } }));

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div>
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Avatar Card */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)', margin: '0 auto' }} />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <User size={40} color="white" />
                </div>
              )}
            </div>
            <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{form.name || 'Your Name'}</h3>
            <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 20 }}>{form.title || 'Your Title'}</p>
            <label style={{ cursor: 'pointer' }}>
              <div className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}>
                <Upload size={14} /> Choose Photo
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
            {imageFile && (
              <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            )}
          </div>

          {/* Info */}
          <div style={{ display: 'grid', gap: 20 }}>
            {/* Personal Info */}
            <div className="card">
              <div className="card-header"><div className="card-title">Personal Information</div></div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Title</label>
                  <input className="form-input" value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Full Stack Developer" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio / About</label>
                <textarea className="form-textarea" value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder="Tell your story..." />
              </div>
            </div>

            {/* Contact */}
            <div className="card">
              <div className="card-header"><div className="card-title">Contact Details</div></div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+92 300 0000000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Islamabad, Pakistan" />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-input" value={form.website} onChange={e => setField('website', e.target.value)} placeholder="https://yoursite.com" />
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="card">
              <div className="card-header"><div className="card-title">Social Media Links</div></div>
              <div className="form-grid">
                {[
                  { key: 'github', icon: Github, label: 'GitHub', placeholder: 'https://github.com/username' },
                  { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'twitter', icon: Twitter, label: 'Twitter', placeholder: 'https://twitter.com/username' },
                  { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/username' },
                ].map(({ key, icon: Icon, label, placeholder }) => (
                  <div className="form-group" key={key}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon size={13} /> {label}
                    </label>
                    <input className="form-input" value={form.social[key]} onChange={e => setSocial(key, e.target.value)} placeholder={placeholder} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Change Password Section */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={18} color="var(--accent)" />
            <div className="card-title">Change Password</div>
          </div>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input" type={showCurrent ? 'text' : 'password'}
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  placeholder="Enter current password" required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input" type={showNew ? 'text' : 'password'}
                  value={pwForm.newPassword}
                  onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  placeholder="Enter new password" required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                className="form-input" type="password"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password" required
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={pwSaving}>
              <Lock size={16} /> {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      <style>{`@media (max-width: 768px) { form > div { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
