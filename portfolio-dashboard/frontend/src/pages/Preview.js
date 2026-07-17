import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Github, ExternalLink, MapPin, Mail, Phone, Globe, Linkedin, Twitter } from 'lucide-react';

const BASE = https://portfolio-cms-production-22ff.up.railway.app/api;

const catColors = {
  'Web Development': '#6c63ff',
  'Mobile Development': '#43d4a0',
  'Graphic Design': '#ff6584',
  'Data Analysis': '#f6ad55',
  'Other': '#9ba3c7'
};

const skillCatColors = {
  Frontend: '#6c63ff', Backend: '#43d4a0', Mobile: '#ff6584',
  Database: '#f6ad55', DevOps: '#63b3ed', Design: '#f687b3', Other: '#9ba3c7'
};

export default function Preview() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${BASE}/preview/${userId}`)
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!data) return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Portfolio not found</h2>
        <Link to="/" style={{ color: '#6c63ff' }}>Go back</Link>
      </div>
    </div>
  );

  const { profile, projects, skills } = data;
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filtered = projects.filter(p => {
    const matchCat = filter === 'All' || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e8eaf6', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1d2e 0%, #0f1117 100%)', borderBottom: '1px solid #2e3354', padding: '80px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          {profile.profileImage ? (
            <img src={`http://localhost:5000${profile.profileImage}`} alt="Profile"
              style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6c63ff', marginBottom: 20 }} />
          ) : (
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: 'white', margin: '0 auto 20px' }}>
              {profile.name?.charAt(0) || 'P'}
            </div>
          )}
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>{profile.name || 'My Portfolio'}</h1>
          <p style={{ fontSize: 18, color: '#6c63ff', marginBottom: 16 }}>{profile.title || 'Developer'}</p>
          <p style={{ fontSize: 15, color: '#9ba3c7', maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.7 }}>{profile.bio}</p>

          {/* Contact */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            {profile.email && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ba3c7', fontSize: 14 }}><Mail size={14} />{profile.email}</span>}
            {profile.location && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ba3c7', fontSize: 14 }}><MapPin size={14} />{profile.location}</span>}
            {profile.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9ba3c7', fontSize: 14 }}><Phone size={14} />{profile.phone}</span>}
          </div>

          {/* Social */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            {profile.social?.github && <a href={profile.social.github} target="_blank" rel="noreferrer" style={{ color: '#9ba3c7', padding: 8, background: '#1e2235', borderRadius: 8, display: 'flex' }}><Github size={18} /></a>}
            {profile.social?.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noreferrer" style={{ color: '#9ba3c7', padding: 8, background: '#1e2235', borderRadius: 8, display: 'flex' }}><Linkedin size={18} /></a>}
            {profile.social?.twitter && <a href={profile.social.twitter} target="_blank" rel="noreferrer" style={{ color: '#9ba3c7', padding: 8, background: '#1e2235', borderRadius: 8, display: 'flex' }}><Twitter size={18} /></a>}
            {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: '#9ba3c7', padding: 8, background: '#1e2235', borderRadius: 8, display: 'flex' }}><Globe size={18} /></a>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px' }}>

        {/* Projects */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Projects</h2>
          <p style={{ color: '#9ba3c7', textAlign: 'center', marginBottom: 32 }}>Things I've built</p>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              style={{ background: '#1e2235', border: '1px solid #2e3354', borderRadius: 10, padding: '9px 16px', color: '#e8eaf6', fontSize: 14, outline: 'none', minWidth: 220 }}
            />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  style={{
                    padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    background: filter === cat ? '#6c63ff' : '#1e2235',
                    color: filter === cat ? 'white' : '#9ba3c7',
                    border: `1px solid ${filter === cat ? '#6c63ff' : '#2e3354'}`,
                    transition: 'all 0.2s'
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map(p => (
              <div key={p._id} style={{ background: '#1e2235', border: '1px solid #2e3354', borderRadius: 16, overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {p.image ? (
                  <img src={`http://localhost:5000${p.image}`} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                ) : (
                  <div style={{ height: 160, background: `${catColors[p.category] || '#6c63ff'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                    🚀
                  </div>
                )}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h3>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${catColors[p.category] || '#6c63ff'}22`, color: catColors[p.category] || '#6c63ff' }}>
                      {p.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#9ba3c7', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                    {p.technologies.slice(0, 4).map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '2px 8px', background: '#242840', border: '1px solid #2e3354', borderRadius: 6, color: '#9ba3c7' }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6c63ff', textDecoration: 'none' }}><ExternalLink size={12} /> Live Demo</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ba3c7', textDecoration: 'none' }}><Github size={12} /> GitHub</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Skills</h2>
          <p style={{ color: '#9ba3c7', textAlign: 'center', marginBottom: 40 }}>My technical expertise</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {Object.entries(grouped).map(([cat, catSkills]) => (
              <div key={cat} style={{ background: '#1e2235', border: '1px solid #2e3354', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: skillCatColors[cat] || '#9ba3c7' }} />
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>{cat}</h3>
                </div>
                {catSkills.map(s => (
                  <div key={s._id} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>{s.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: skillCatColors[s.category] || '#6c63ff' }}>{s.proficiency}%</span>
                    </div>
                    <div style={{ height: 6, background: '#242840', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.proficiency}%`, background: skillCatColors[s.category] || '#6c63ff', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 20px', borderTop: '1px solid #2e3354', color: '#5c6394', fontSize: 13 }}>
        Built with Portfolio Dashboard 🚀
      </div>
    </div>
  );
}
