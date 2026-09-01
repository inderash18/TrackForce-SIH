import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ShieldCheck, Building } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginUser } = useApp();
  const [email, setEmail] = useState('r.verma-ias@gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="gov-card"
        style={{
          width: '100%',
          maxWidth: '860px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Left Side: Official Branding */}
        <div
          style={{
            backgroundColor: 'var(--color-deep-navy)',
            color: '#FFFFFF',
            padding: '48px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--color-royal-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', marginBottom: '24px' }}>
              PS
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              PAIMANA Sentinel AI
            </h2>

            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.4, margin: '0 0 24px' }}>
              Predictive Infrastructure Intelligence & Early Warning System
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--color-royal-blue)" />
                <span>Central Sector Project Surveillance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={16} color="var(--color-royal-blue)" />
                <span>Ministry of Statistics & Programme Implementation</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748B' }}>
            Authorized Government of India Access Portal • National Informatics Centre (NIC)
          </div>
        </div>

        {/* Right Side: Secure Login Form */}
        <div style={{ padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-dark)', margin: '0 0 4px' }}>
              Secure Official Sign In
            </h3>
            <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
              Use your NIC / GOV.IN email credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '6px' }}>
                Official Email / Employee ID
              </label>
              <input
                type="text"
                className="gov-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-dark)', display: 'block', marginBottom: '6px' }}>
                Password / Digital Signature Pin
              </label>
              <input
                type="password"
                className="gov-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', fontSize: '13px' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '13.5px', marginTop: '8px' }}
            >
              <Lock size={14} /> Sign In to Sentinel AI
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border-light)', textAlign: 'center', fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            <span>Authorized Government Access Only. All actions logged under IT Act 2000.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
