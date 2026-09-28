import React, { useState } from 'react';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import {
  Building2,
  Target,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Cpu
} from 'lucide-react';

import type { ActiveNavRoute } from '../types/project';

interface AboutPagesViewProps {
  subpage?: 'ipmd' | 'ocms' | 'vision' | 'allocation';
  onNavigate?: (route: ActiveNavRoute) => void;
  onOpenAddProject?: () => void;
  onOpenLoginModal?: () => void;
}

export const AboutPagesView: React.FC<AboutPagesViewProps> = ({
  subpage = 'ipmd',
  onNavigate,
  onOpenAddProject,
  onOpenLoginModal
}) => {
  const [activeTab, setActiveTab] = useState<'ipmd' | 'ocms' | 'vision' | 'allocation'>(subpage);

  return (
    <div className="paimana-portal-wrapper">
      <PaimanaHeader 
        activeRoute={`about-${subpage === 'allocation' ? 'vision' : subpage}` as ActiveNavRoute}
        onNavigate={onNavigate}
        onOpenAddProject={onOpenAddProject}
        onOpenLoginModal={onOpenLoginModal}
      />

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
        <div className="paimana-section-container" style={{ paddingTop: '32px' }}>
          {/* Header Row */}
          <div className="paimana-reports-page-header">
            <div>
              <div className="paimana-heading-with-underline">
                <h1 className="paimana-reports-h1">About PAIMANA & IPMD</h1>
                <div className="paimana-heading-line" />
              </div>
              <p className="paimana-reports-lead">
                Infrastructure and Project Monitoring Division (IPMD), Ministry of Statistics & Programme Implementation.
              </p>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="paimana-pub-filter-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`paimana-filter-tab ${activeTab === 'ipmd' ? 'active' : ''}`}
                onClick={() => setActiveTab('ipmd')}
              >
                <Building2 size={14} /> About IPMD
              </button>
              <button
                type="button"
                className={`paimana-filter-tab ${activeTab === 'ocms' ? 'active' : ''}`}
                onClick={() => setActiveTab('ocms')}
              >
                <Cpu size={14} /> About OCMS & Sentinel
              </button>
              <button
                type="button"
                className={`paimana-filter-tab ${activeTab === 'vision' ? 'active' : ''}`}
                onClick={() => setActiveTab('vision')}
              >
                <Target size={14} /> Vision & Strategic Objectives
              </button>
              <button
                type="button"
                className={`paimana-filter-tab ${activeTab === 'allocation' ? 'active' : ''}`}
                onClick={() => setActiveTab('allocation')}
              >
                <Layers size={14} /> Allocation of Business Rules
              </button>
            </div>
          </div>

          {/* Tab Content Cards */}
          <div className="paimana-white-card" style={{ padding: '32px', marginBottom: '32px' }}>
            {activeTab === 'ipmd' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  Infrastructure & Project Monitoring Division (IPMD)
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', marginBottom: '16px' }}>
                  The <strong>Infrastructure and Project Monitoring Division (IPMD)</strong> in the Ministry of Statistics and Programme Implementation (MoSPI) is mandated to monitor all Central Sector Infrastructure Projects costing ₹ 150 Crore and above. IPMD acts as the apex national monitoring body providing objective surveillance on implementation timelines, cost escalations, and inter-ministerial bottlenecks.
                </p>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '24px 0 12px' }}>
                  Core Responsibilities of IPMD:
                </h3>
                <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '13.5px', color: '#334155' }}>
                  <li>Continuous milestone monitoring of mega schemes (₹ 1,000 Cr+) and major projects (₹ 150 Cr – ₹ 1,000 Cr).</li>
                  <li>Compilation and publication of statutory <strong>Monthly Flash Reports</strong> and <strong>Performance Review Reports</strong> for the Cabinet Secretariat, PMO, and Parliament.</li>
                  <li>Identification of critical systemic bottlenecks: Land Acquisition & Right-of-Way (RoW), environmental & forest clearances, contractor liquidity, and inter-ministerial coordination gaps.</li>
                  <li>Facilitating Empowered Committee interventions and GatiShakti National Master Plan synergy.</li>
                </ul>
              </div>
            )}

            {activeTab === 'ocms' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  Online Central Monitoring System (OCMS) & PAIMANA Sentinel AI
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', marginBottom: '16px' }}>
                  The <strong>Online Central Monitoring System (OCMS)</strong> is MoSPI’s secure data-exchange portal through which project authorities across line ministries (Railways, Road Transport & Highways, Petroleum, Power, Shipping, Civil Aviation) submit standardized Central Upload Format (CUF) progress returns.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
                  <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0084C7', fontWeight: 700 }}>
                      <FileSpreadsheet size={18} /> Central Upload Format (CUF)
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                      Rigorous data validation pipeline ingesting physical milestone progress, financial accruals, contractor capacities, and statutory permit statuses.
                    </p>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#0084C7', fontWeight: 700 }}>
                      <ShieldCheck size={18} /> Predictive Sentinel AI Layer
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                      Integrated machine learning models (XGBoost/LightGBM) and SHAP root-cause attribution calculating delay probabilities 6–12 months before milestone breach.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vision' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  Strategic Vision & National Objectives
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', marginBottom: '16px' }}>
                  To achieve zero-cost overrun and zero-time slippage across India&apos;s national infrastructure portfolio by transitioning from retrospective reporting to proactive, predictive intelligence and institutional accountability.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                  {[
                    { title: 'Transparency & Defensibility', desc: 'Providing audited, explainable data that enables ministries to unblock stalled investments.' },
                    { title: 'PM GatiShakti Synergy', desc: 'Geospatial mapping and multi-modal alignment for seamless infrastructure logistics.' },
                    { title: 'Actionable Early Warnings', desc: 'Algorithmic surveillance alerting project directors before cost escalation becomes irreversible.' }
                  ].map((item) => (
                    <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#EEF6FB', padding: '14px', borderRadius: '8px' }}>
                      <CheckCircle2 size={18} color="#0084C7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{item.title}:</strong>
                        <span style={{ fontSize: '13px', color: '#475569', marginLeft: '6px' }}>{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'allocation' && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                  Allocation of Business Rules Mandate
                </h2>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#334155', marginBottom: '16px' }}>
                  Under the Government of India (Allocation of Business) Rules, 1961, the Ministry of Statistics and Programme Implementation is assigned the institutional duty of monitoring Central Sector Projects costing ₹ 150 Crore and above, and submitting periodic evaluation dossiers to the Prime Minister&apos;s Office and Cabinet Committee on Economic Affairs (CCEA).
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <PaimanaFooter onNavigate={onNavigate} />
    </div>
  );
};
