import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Sparkles,
  BellRing,
  Sliders,
  ArrowRight,
  Lock
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px', padding: '20px 0 60px' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-grey)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-royal-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
            PS
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0 }}>
              PAIMANA Sentinel AI
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Ministry of Statistics & Programme Implementation (MoSPI)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('login')}>
            <Lock size={13} /> Official Login
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigateTo('dashboard')}>
            Enter Platform →
          </button>
        </div>
      </div>

      {/* Hero Section (Section 28) */}
      <div
        className="gov-card"
        style={{
          padding: '44px 36px',
          backgroundColor: 'var(--color-white)',
          borderTop: '4px solid var(--color-royal-blue)',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-royal-blue-subtle)',
            color: 'var(--color-royal-blue)',
            border: '1px solid var(--color-royal-blue-border)',
            display: 'inline-block',
            marginBottom: '16px'
          }}
        >
          National Infrastructure Intelligence Portal
        </span>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--color-deep-navy)',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            maxWidth: '820px',
            margin: '0 auto 16px'
          }}
        >
          AI-Powered Predictive Infrastructure Monitoring
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: 'var(--color-text-body)',
            lineHeight: 1.5,
            maxWidth: '740px',
            margin: '0 auto 28px'
          }}
        >
          Supporting early detection of project cost escalation, schedule delays, and implementation risks across 1,981 Central Sector Infrastructure Projects.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => navigateTo('dashboard')}>
            Explore National Platform <ArrowRight size={16} />
          </button>
          <button className="btn btn-navy" style={{ padding: '10px 24px', fontSize: '14px' }} onClick={() => navigateTo('login')}>
            <Lock size={15} /> Authorized Government Login
          </button>
        </div>
      </div>

      {/* Four Core Capabilities (Predict, Explain, Alert, Intervene) */}
      <div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-dark)', textAlign: 'center', marginBottom: '20px' }}>
          Core AI Capabilities
        </h3>

        <div className="grid-cols-4">
          <div className="gov-card" style={{ padding: '22px 18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-royal-blue-subtle)', color: 'var(--color-royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <TrendingUp size={20} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
              1. Predict
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>
              Estimates cost overrun probability, schedule slippage drift, and completion dates using 42-variable augmented XGBoost models.
            </p>
          </div>

          <div className="gov-card" style={{ padding: '22px 18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--color-royal-blue-subtle)', color: 'var(--color-royal-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sparkles size={20} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
              2. Explain
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>
              SHAP-style explainable AI decomposes black-box predictions into transparent root-cause factors for non-technical policymakers.
            </p>
          </div>

          <div className="gov-card" style={{ padding: '22px 18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--status-critical-bg)', color: 'var(--status-critical-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <BellRing size={20} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
              3. Alert
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>
              Flags physical progress velocity drops, financial divergence anomalies, and land acquisition bottlenecks in real time.
            </p>
          </div>

          <div className="gov-card" style={{ padding: '22px 18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--status-low-bg)', color: 'var(--status-low-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sliders size={20} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px' }}>
              4. Intervene
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>
              Interactive What-If simulation engine computes quantified risk reduction deltas before committing capital and policy resources.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Workflow (Section 28 & 37) */}
      <div className="gov-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-dark)', marginBottom: '6px', textAlign: 'center' }}>
          Decision Support Workflow Architecture
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
          From observation to measurable policy impact
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', textAlign: 'center' }}>
          {[
            { step: 'OBSERVE', desc: 'Ingest CUF & OCMS data feeds' },
            { step: 'PREDICT', desc: 'Compute cost & delay probabilities' },
            { step: 'UNDERSTAND', desc: 'SHAP root cause attribution' },
            { step: 'PRIORITIZE', desc: 'Rank top 184 critical risks' },
            { step: 'INTERVENE', desc: 'Test What-If policy levers' },
            { step: 'MEASURE', desc: 'Track velocity recovery' }
          ].map((item, idx) => (
            <div key={item.step} style={{ background: 'var(--color-bg-soft)', padding: '14px 10px', borderRadius: '8px', border: '1px solid var(--color-border-grey)' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-royal-blue)' }}>STEP 0{idx + 1}</span>
              <strong style={{ fontSize: '13px', color: 'var(--color-text-dark)', display: 'block' }}>{item.step}</strong>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
