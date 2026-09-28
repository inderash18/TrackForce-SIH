import React, { useState } from 'react';
import { PaimanaHeader } from '../components/paimana/PaimanaHeader';
import { PaimanaFooter } from '../components/paimana/PaimanaFooter';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import type { ActiveNavRoute } from '../types/project';

interface FAQItem {
  question: string;
  category: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    category: 'General & Scope',
    question: 'What is PAIMANA and who operates it?',
    answer: 'PAIMANA (Project Analytics & Integrated Monitoring for Actionable National Analytics) is an enterprise AI monitoring system operated by the Infrastructure and Project Monitoring Division (IPMD) under the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.'
  },
  {
    category: 'General & Scope',
    question: 'Which projects are covered under the PAIMANA monitoring mandate?',
    answer: 'All Central Sector Infrastructure Projects costing ₹ 150 Crore and above across ministries including Railways, Road Transport and Highways, Petroleum and Natural Gas, Power, Civil Aviation, Shipping & Waterways, Urban Transit, and Telecommunications are tracked.'
  },
  {
    category: 'Flash Reports & Publications',
    question: 'How frequently are MoSPI Flash Reports generated and published?',
    answer: 'Flash Reports are generated on a monthly cycle based on standard Central Upload Format (CUF) progress returns submitted by project authorities across line ministries and implementing agencies.'
  },
  {
    category: 'Flash Reports & Publications',
    question: 'How is physical progress vs schedule delay calculated?',
    answer: 'Physical progress is measured against weighted milestone completion schedules submitted in the original sanctioned DPR. Schedule delay reflects the variance between the original commissioning date and the latest anticipated commissioning date verified by the line ministry.'
  },
  {
    category: 'Data & Sentinel AI',
    question: 'What is the Central Upload Format (CUF)?',
    answer: 'The CUF is a standardized technical format (CSV/JSON/API) through which project directors report physical milestone completion, capital expenditure, land acquisition percentage, environmental clearances, and contractor capacity.'
  },
  {
    category: 'Data & Sentinel AI',
    question: 'How does the Predictive Risk & Early Warning Engine work?',
    answer: 'PAIMANA Sentinel AI leverages machine learning ensemble models (LightGBM & XGBoost) trained on multi-year MoSPI flash records and SHAP (Shapley Additive exPlanations) to identify velocity drops and predict cost/schedule overruns 6 to 12 months in advance.'
  }
];

interface FAQViewProps {
  onNavigate?: (route: ActiveNavRoute) => void;
  onOpenAddProject?: () => void;
  onOpenLoginModal?: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({
  onNavigate,
  onOpenAddProject,
  onOpenLoginModal
}) => {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const toggleAccordion = (idx: number) => {
    setOpenIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredFaqs = FAQS_DATA.filter((f) => {
    if (activeCategory !== 'All' && f.category !== activeCategory) return false;
    if (search && !f.question.toLowerCase().includes(search.toLowerCase()) && !f.answer.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="paimana-portal-wrapper">
      <PaimanaHeader 
        activeRoute="faq"
        onNavigate={onNavigate}
        onOpenAddProject={onOpenAddProject}
        onOpenLoginModal={onOpenLoginModal}
      />

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: '#F8FAFC', paddingBottom: '60px' }}>
        <div className="paimana-section-container" style={{ paddingTop: '32px' }}>
          {/* Header */}
          <div className="paimana-reports-page-header">
            <div>
              <div className="paimana-heading-with-underline">
                <h1 className="paimana-reports-h1">Frequently Asked Questions (FAQs)</h1>
                <div className="paimana-heading-line" />
              </div>
              <p className="paimana-reports-lead">
                Clarifications regarding Central Sector Infrastructure Project monitoring, Flash Reports, CUF submissions, and predictive analytics.
              </p>
            </div>
          </div>

          {/* Filter / Search Bar */}
          <div className="paimana-pub-filter-card" style={{ marginBottom: '24px' }}>
            <div className="paimana-filter-grid-4">
              <div className="paimana-filter-group">
                <label className="paimana-filter-lbl">Category</label>
                <select
                  className="paimana-dash-select"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="General & Scope">General & Scope</option>
                  <option value="Flash Reports & Publications">Flash Reports & Publications</option>
                  <option value="Data & Sentinel AI">Data & Sentinel AI</option>
                </select>
              </div>

              <div className="paimana-filter-group" style={{ gridColumn: 'span 2' }}>
                <label className="paimana-filter-lbl">Search Questions</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="paimana-dash-select"
                    placeholder="Search keywords (e.g. flash report, delay, CUF)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingRight: '28px' }}
                  />
                  <Search size={14} style={{ position: 'absolute', right: '10px', top: '12px', color: '#94A3B8' }} />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openIndices[idx];
              return (
                <div
                  key={faq.question}
                  className="paimana-white-card"
                  style={{
                    overflow: 'hidden',
                    border: isOpen ? '1px solid #0084C7' : '1px solid #E2E8F0',
                    transition: 'border-color 150ms ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: isOpen ? '#EEF6FB' : '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <HelpCircle size={18} color="#0084C7" />
                      <div>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block' }}>
                          {faq.category}
                        </span>
                        <strong style={{ fontSize: '14.5px', color: '#0F172A' }}>
                          {faq.question}
                        </strong>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      color="#0F172A"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 150ms ease'
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '16px 20px 20px 48px', fontSize: '13.5px', lineHeight: 1.65, color: '#334155', borderTop: '1px solid #E2E8F0' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <PaimanaFooter onNavigate={onNavigate} />
    </div>
  );
};
