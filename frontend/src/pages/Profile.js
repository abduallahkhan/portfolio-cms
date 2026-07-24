import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, uploadProfileImage } from '../api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Upload, Github, Linkedin, Twitter, Instagram, Mail, Phone, MapPin, Globe, Lock, Eye, EyeOff, Download } from 'lucide-react';

const BASE = 'https://portfolio-cms-production-22ff.up.railway.app';

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
        if (d.profileImage) setImagePreview(`${BASE}${d.profileImage}`);
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
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match!'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters!'); return; }
    setPwSaving(true);
    try {
      await axios.put(`${BASE}/api/auth/change-password`, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setPwSaving(false); }
  };

  const setField = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const setSocial = (field, val) => setForm(prev => ({ ...prev, social: { ...prev.social, [field]: val } }));

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Hero Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        borderRadius: 28, padding: 40, marginBottom: 28,
        display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40,
        alignItems: 'center', boxShadow: '0 20px 60px rgba(108,99,255,0.2)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(108,99,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 150, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,101,132,0.1)' }} />

        {/* Photo Section */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" style={{
                width: 180, height: 180, borderRadius: '50%', objectFit: 'cover',
                border: '4px solid rgba(108,99,255,0.5)',
                boxShadow: '0 8px 32px rgba(108,99,255,0.3)'
              }} />
            ) : (
              <div style={{
                width: 180, height: 180, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 64, fontWeight: 800, color: 'white',
                boxShadow: '0 8px 32px rgba(108,99,255,0.3)'
              }}>
                {form.name?.charAt(0) || 'A'}
              </div>
            )}
            {/* Upload overlay */}
            <label style={{
              position: 'absolute', bottom: 8, right: 8,
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c63ff, #5a52e0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(108,99,255,0.4)',
              transition: 'transform 0.2s'
            }}>
              <Upload size={16} color="white" />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
          </div>
          {imageFile && (
            <button onClick={handleUpload} disabled={uploading}
              style={{
                marginTop: 12, background: 'linear-gradient(135deg, #43d4a0, #38b2a0)',
                border: 'none', color: 'white', padding: '8px 16px', borderRadius: 10,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%',
                fontFamily: 'Poppins, sans-serif'
              }}>
              {uploading ? 'Uploading...' : '📤 Upload Photo'}
            </button>
          )}
        </div>

        {/* Info Section */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 40, fontWeight: 800, color: 'white',
            marginBottom: 8, lineHeight: 1.1,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            {form.name || 'Your Name'}
          </h1>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            padding: '6px 18px', borderRadius: 20, marginBottom: 20
          }}>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>
              {form.title || 'Your Title'}
            </span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontWeight: 500 }}>
            {form.bio || 'Your bio will appear here...'}
          </p>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            {form.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                <Mail size={14} color="#6c63ff" /> {form.email}
              </div>
            )}
            {form.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                <Phone size={14} color="#43d4a0" /> {form.phone}
              </div>
            )}
            {form.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                <MapPin size={14} color="#ff6584" /> {form.location}
              </div>
            )}
            {form.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                <Globe size={14} color="#f6ad55" /> {form.website}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {form.social?.github && (
              <a href={form.social.github} target="_blank" rel="noreferrer"
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Github size={14} /> GitHub
              </a>
            )}
            {form.social?.linkedin && (
              <a href={form.social.linkedin} target="_blank" rel="noreferrer"
                style={{ padding: '8px 16px', background: 'rgba(108,99,255,0.3)', borderRadius: 10, color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(108,99,255,0.3)' }}>
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
          </div>

          {/* Resume Download Button */}
          <a
            href="https://drive.google.com/your-resume-link"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #43d4a0, #38b2a0)',
              color: 'white', padding: '12px 24px', borderRadius: 14,
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(67,212,160,0.4)',
              transition: 'all 0.3s', fontFamily: 'Poppins, sans-serif'
            }}>
            <Download size={16} /> Download Resume
          </a>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Personal Info */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ color: '#6c63ff' }}>✏️ Personal Information</div>
            </div>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Professional Title</label>
              <input className="form-input" value={form.title} onChange={e => setField('title', e.target.value)} placeholder="Full Stack Developer" />
            </div>
            <div className="form-group">
              <label className="form-label">Bio / About</label>
              <textarea className="form-textarea" value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder="Tell your story..." />
            </div>
          </div>

          {/* Contact */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ color: '#ff6584' }}>📞 Contact Details</div>
            </div>
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
              <input className="form-input" value={form.location} onChange={e => setField('location', e.target.value)} placeholder="Peshawar, Pakistan" />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input className="form-input" value={form.website} onChange={e => setField('website', e.target.value)} placeholder="https://yoursite.com" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title" style={{ color: '#43d4a0' }}>🌐 Social Media Links</div>
          </div>
          <div className="form-grid">
            {[
              { key: 'github', icon: Github, label: 'GitHub', placeholder: 'https://github.com/username', color: '#333' },
              { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username', color: '#0077b5' },
              { key: 'twitter', icon: Twitter, label: 'Twitter', placeholder: 'https://twitter.com/username', color: '#1da1f2' },
              { key: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/username', color: '#e4405f' },
            ].map(({ key, icon: Icon, label, placeholder, color }) => (
              <div className="form-group" key={key}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon size={13} color={color} /> {label}
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
      </form>

      {/* Change Password */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title" style={{ color: '#f6ad55' }}>🔐 Change Password</div>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showCurrent ? 'text' : 'password'} value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} placeholder="Current password" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showNew ? 'text' : 'password'} value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} placeholder="New password" required style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} placeholder="Confirm password" required />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={pwSaving} style={{ background: 'linear-gradient(135deg, #f6ad55, #ed8936)' }}>
              <Lock size={16} /> {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      <style>{`@media (max-width: 768px) { div[style*="gridTemplateColumns: '220px"] { grid-template-columns: 1fr !important; text-align: center; } }`}</style>
    </div>
  );
}
