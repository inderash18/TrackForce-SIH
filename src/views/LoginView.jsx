import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
export const LoginView = ({ onNavigate }) => {
    const { loginUser, navigateTo } = useApp();
    const [email, setEmail] = useState('admin@mospi.gov.in');
    const [password, setPassword] = useState('Paimana@2026');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('admin');
    const handleNav = (route) => {
        if (onNavigate) {
            onNavigate(route);
        }
        else {
            navigateTo(route);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(email);
    };
    const selectPresetRole = (role, roleEmail) => {
        setSelectedRole(role);
        setEmail(roleEmail);
        setPassword('Paimana@2026');
    };
    return (<div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #99C7F4 0%, #C3E0FA 28%, #DFEEFD 60%, #F4F8FC 100%)',
            fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif"
        }}>
      {/* Background Ethereal Concentric Light Rings (Matching Reference) */}
      <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '900px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            pointerEvents: 'none'
        }}/>
      <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1200px',
            height: '1200px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none'
        }}/>
      <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1500px',
            height: '1500px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            pointerEvents: 'none'
        }}/>

      {/* Top Bar with Brand and Return Link */}
      <header style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 10
        }}>
        {/* Top-Left Brand (Like Ebolt in reference) */}
        <div onClick={() => handleNav('landing')} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '13px',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)'
        }}>
            P
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            PAIMANA
          </span>
        </div>

        {/* Top-Right Return to Portal Action */}
        <button onClick={() => handleNav('landing')} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            color: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }} onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)')} onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)')}>
          <ChevronLeft size={14}/>
          Back to Portal
        </button>
      </header>

      {/* Main Center Area: Floating Glass Card (Exact Match to Reference) */}
      <main style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            position: 'relative',
            zIndex: 10
        }}>
        <div style={{
            width: '100%',
            maxWidth: '410px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            padding: '28px 22px 24px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
          {/* Top Floating Icon Square (Arrow into Bracket ->]) */}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            color: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.9)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
              <ArrowRight size={15} strokeWidth={2.5}/>
              <div style={{ width: '3px', height: '14px', borderRight: '2.5px solid #0F172A', borderTop: '2.5px solid #0F172A', borderBottom: '2.5px solid #0F172A', borderRadius: '0 2px 2px 0' }}/>
            </div>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 6px 0',
            textAlign: 'center',
            letterSpacing: '-0.02em'
        }}>
            Sign in with email
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '12.5px',
            color: '#64748B',
            margin: '0 0 24px 0',
            textAlign: 'center',
            lineHeight: 1.45,
            maxWidth: '300px'
        }}>
            Access real-time central infrastructure monitoring, risk AI, and executive dossiers.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Email Input */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#F1F5F9',
            borderRadius: '12px',
            padding: '11px 14px',
            border: '1px solid transparent',
            transition: 'all 0.15s ease'
        }} onFocus={(e) => (e.currentTarget.style.borderColor = '#0084C7')} onBlur={(e) => (e.currentTarget.style.borderColor = 'transparent')}>
              <Mail size={16} color="#94A3B8"/>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: '#0F172A',
            fontWeight: 500
        }}/>
            </div>

            {/* Password Input */}
            <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#F1F5F9',
            borderRadius: '12px',
            padding: '11px 14px',
            border: '1px solid transparent',
            transition: 'all 0.15s ease'
        }} onFocus={(e) => (e.currentTarget.style.borderColor = '#0084C7')} onBlur={(e) => (e.currentTarget.style.borderColor = 'transparent')}>
              <Lock size={16} color="#94A3B8"/>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: '#0F172A',
            fontWeight: 500
        }}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px', marginBottom: '6px' }}>
              <a href="#forgot" onClick={(e) => {
            e.preventDefault();
            alert('For official account recovery, contact support-ocms@nic.in');
        }} style={{
            fontSize: '11.5px',
            color: '#64748B',
            textDecoration: 'none',
            fontWeight: 500
        }} onMouseOver={(e) => (e.currentTarget.style.color = '#0F172A')} onMouseOut={(e) => (e.currentTarget.style.color = '#64748B')}>
                Forgot password?
              </a>
            </div>

            {/* Main Dark Button: "Get Started" (Exact Match) */}
            <button type="submit" style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: '#0F172A',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
            transition: 'all 0.15s ease'
        }} onMouseOver={(e) => {
            e.currentTarget.style.background = '#1E293B';
            e.currentTarget.style.transform = 'translateY(-1px)';
        }} onMouseOut={(e) => {
            e.currentTarget.style.background = '#0F172A';
            e.currentTarget.style.transform = 'translateY(0)';
        }}>
              Get Started
            </button>
          </form>

          {/* Dotted Divider: "Or sign in with" */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '22px 0 16px 0',
            position: 'relative'
        }}>
            <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            borderTop: '1px dashed #CBD5E1'
        }}/>
            <span style={{
            position: 'relative',
            background: '#FFFFFF',
            padding: '0 12px',
            fontSize: '11px',
            color: '#94A3B8',
            fontWeight: 500,
            borderRadius: '4px'
        }}>
              Or sign in with
            </span>
          </div>

          {/* 3 Quick Role Buttons (Google / FB / Apple style in reference) */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {/* MoSPI Admin */}
            <button type="button" onClick={() => selectPresetRole('admin', 'admin@mospi.gov.in')} title="MoSPI Apex Admin" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 6px',
            borderRadius: '12px',
            background: selectedRole === 'admin' ? '#F0F9FF' : '#FFFFFF',
            border: selectedRole === 'admin' ? '1.5px solid #0084C7' : '1px solid #E2E8F0',
            color: '#0F172A',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.15s ease'
        }}>
              <span style={{ fontSize: '13px' }}>👑</span>
              <span>Admin</span>
            </button>

            {/* Railways Lead */}
            <button type="button" onClick={() => selectPresetRole('railways', 'railways.officer@gov.in')} title="Railways Executing Agency" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 6px',
            borderRadius: '12px',
            background: selectedRole === 'railways' ? '#F0F9FF' : '#FFFFFF',
            border: selectedRole === 'railways' ? '1.5px solid #0084C7' : '1px solid #E2E8F0',
            color: '#0F172A',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.15s ease'
        }}>
              <span style={{ fontSize: '13px' }}>🚆</span>
              <span>Railways</span>
            </button>

            {/* Risk Analyst */}
            <button type="button" onClick={() => selectPresetRole('analyst', 'analyst@paimana.gov.in')} title="Risk Analyst" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 6px',
            borderRadius: '12px',
            background: selectedRole === 'analyst' ? '#F0F9FF' : '#FFFFFF',
            border: selectedRole === 'analyst' ? '1.5px solid #0084C7' : '1px solid #E2E8F0',
            color: '#0F172A',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            transition: 'all 0.15s ease'
        }}>
              <span style={{ fontSize: '13px' }}>📊</span>
              <span>Analyst</span>
            </button>
          </div>
        </div>
      </main>

      {/* Subtle Bottom Trust Note */}
      <footer style={{
            padding: '16px 24px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#64748B',
            position: 'relative',
            zIndex: 10
        }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={13} color="#0084C7"/>
          Secured with AES-256 & Parichay Single Sign-On • Government of India
        </span>
      </footer>
    </div>);
};
