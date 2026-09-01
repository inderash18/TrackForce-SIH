import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ChatMessage } from '../types/project';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ExternalLink,
  Clock,
  Database,
  RotateCcw
} from 'lucide-react';

export const AssistantView: React.FC = () => {
  const { selectedProject, navigateToProject, reportingMonth } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: '20:30',
      content:
        'Welcome to **PAIMANA Sentinel AI Assistant**. I provide predictive risk analytics, SHAP factor explanations, cost escalation projections, and policy intervention insights across all 1,981 Central Sector Infrastructure Projects for reporting period **' +
        reportingMonth +
        '**.',
      confidence: 'High (94%)',
      suggestedActions: [
        'Which railway projects have the highest delay risk?',
        'Why is Project 602096 critical?',
        'Show projects above ₹5,000 crore with risk >80.',
        'Show emerging risks this month.'
      ]
    }
  ]);

  const handleSendPrompt = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate context-aware AI response
    setTimeout(() => {
      let botResponse: ChatMessage;

      const q = queryText.toLowerCase();

      if (q.includes('602096') || q.includes('mumbai suburban') || q.includes('why is project')) {
        botResponse = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `### Risk Audit: Project PRJ-602096 (Mumbai Suburban Rail & Metro Corridor)\n\nProject **PRJ-602096** is categorized under **CRITICAL RISK (87 / 100)** with a **91% Schedule Delay Probability**.\n\n**Primary Root Causes Identified by SHAP Attribution:**\n1. **Execution Stagnation (+23% risk)**: Physical progress advanced only **0.5%** this reporting month compared to historical target of 3.2%/mo.\n2. **TBM & Tunnel Civil Slippage (+19% risk)**: 3 consecutive critical path milestones missed without catch-up shift deployment.\n3. **Spending-to-Progress Divergence (+16% risk)**: Expenditure at 55.8% (₹3,240 Cr) while physical ground completion is locked at 58.0%.\n\n**Recommended Intervention:** Fast-track Right-of-Way clearance at Dharavi junction and restructure EPC Package B to restore velocity. Expected risk reduction: **87 → 68 / 100**.\n`,
          referencedProjectIds: ['PRJ-602096'],
          confidence: 'High (94%)',
          metricsTable: [
            { label: 'Overall Risk Score', value: '87 / 100', note: 'Critical Tier' },
            { label: 'Schedule Delay Prob', value: '91%', note: '+8.4 months drift' },
            { label: 'Cost Escalation Forecast', value: '₹6,430 Cr', note: '+₹630 Cr over revised' },
            { label: 'Physical Progress Stagnation', value: '58.0%', note: '0.5% / month current velocity' }
          ],
          suggestedActions: [
            'Simulate Dharavi RoW clearance in What-If Lab',
            'Generate Executive Dossier for Ministry of Railways'
          ]
        };
      } else if (q.includes('railway') || q.includes('highest delay')) {
        botResponse = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `### High Delay Risk Railway Projects (${reportingMonth})\n\nThe Ministry of Railways portfolio has **52 projects in Critical Risk** with an average delay probability of **68%**.\n\n**Top Vulnerable Rail Corridors:**\n1. **PRJ-108273**: *Rishikesh-Karanprayag Broad Gauge Rail Link* — Delay Prob: **94%**, Expected Delay: **+11.2 months** (Geological fault zone in Tunnel 8).\n2. **PRJ-602096**: *Mumbai Suburban Corridor Link* — Delay Prob: **91%**, Expected Delay: **+8.4 months** (Stagnant progress velocity).\n3. **PRJ-992015**: *Bengaluru Suburban Rail (BSRP Corridor 2)* — Delay Prob: **89%**, Expected Delay: **+10.0 months** (Defense land handover delay).`,
          referencedProjectIds: ['PRJ-108273', 'PRJ-602096', 'PRJ-992015'],
          confidence: 'High (94%)',
          metricsTable: [
            { label: 'Rishikesh-Karanprayag', value: 'Risk 92/100', note: 'Delay: 94%' },
            { label: 'Bengaluru Suburban BSRP', value: 'Risk 89/100', note: 'Delay: 89%' },
            { label: 'Mumbai Suburban Rail', value: 'Risk 87/100', note: 'Delay: 91%' }
          ]
        };
      } else if (q.includes('5000') || q.includes('>80') || q.includes('above')) {
        botResponse = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `### Mega Projects (Outlay > ₹5,000 Cr & Risk Score > 80)\n\nFound **3 mega central sector projects** exceeding ₹5,000 Crore with severe risk thresholds requiring Cabinet Secretariat / PMO surveillance:\n\n1. **Rishikesh-Karanprayag Rail Link** (` + 'PRJ-108273' + `): Revised Cost: **₹24,500 Cr** | Risk: **92 / 100** | Delay Prob: **94%**\n2. **Bengaluru Suburban Rail Project Corridor 2** (` + 'PRJ-992015' + `): Revised Cost: **₹18,450 Cr** | Risk: **89 / 100** | Delay Prob: **89%**\n3. **Mumbai Suburban Rail Corridor** (` + 'PRJ-602096' + `): Revised Cost: **₹5,800 Cr** | Risk: **87 / 100** | Delay Prob: **91%**`,
          referencedProjectIds: ['PRJ-108273', 'PRJ-992015', 'PRJ-602096'],
          confidence: 'High (94%)'
        };
      } else {
        botResponse = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `### Portfolio Synthesis for "${queryText}"\n\nBased on the latest PAIMANA CUF + OCMS ingestion (**1,981 projects, ${reportingMonth}**):\n- **Portfolio Health Score**: 72 / 100 (Needs Attention)\n- **Critical Risk Schemes**: 184 projects\n- **Primary Delay Mechanism**: Land Acquisition disputes (27%) and Contractor liquidity crunch (21%).\n\nYou can query specific project IDs (e.g. *PRJ-602096*, *PRJ-108273*), compare sectors, or test policy simulations in the What-If lab.`,
          confidence: 'Moderate (81%)'
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 450);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: '20px', height: 'calc(100vh - 160px)', minHeight: '620px' }}>
      {/* Left Pane: Conversation History & Prompts */}
      <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="gov-card-header" style={{ padding: '12px 14px' }}>
          <div className="gov-card-title" style={{ fontSize: '13px' }}>
            <Clock size={14} color="var(--color-royal-blue)" />
            Query Presets & Topics
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            'Which railway projects have the highest delay risk?',
            'Why is Project 602096 critical?',
            'Show projects above ₹5,000 crore with risk >80.',
            'Show emerging risks this month.',
            'Compare Mumbai Metro vs Western DFC',
            'Generate Executive Portfolio Brief'
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(prompt)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-grey)',
                backgroundColor: 'var(--color-bg-soft)',
                fontSize: '11.5px',
                color: 'var(--color-text-dark)',
                cursor: 'pointer',
                lineHeight: 1.3,
                transition: 'all 120ms ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-royal-blue-subtle)';
                e.currentTarget.style.borderColor = 'var(--color-royal-blue-border)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-soft)';
                e.currentTarget.style.borderColor = 'var(--color-border-grey)';
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div style={{ padding: '10px', borderTop: '1px solid var(--color-border-grey)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          <span>Source: MoSPI IPMD OCMS + CUF Data</span>
        </div>
      </div>

      {/* Center Pane: Active Chat Window */}
      <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div className="gov-card-header" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--color-royal-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} />
            </div>
            <div>
              <strong style={{ fontSize: '13.5px', color: 'var(--color-text-dark)', display: 'block' }}>
                PAIMANA Sentinel Intelligence Copilot
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--status-low-text)', fontWeight: 600 }}>
                ● Active Knowledge Engine (1,981 Projects • April 2026)
              </span>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setMessages([messages[0]])}
            title="Clear Chat"
          >
            <RotateCcw size={12} /> Clear
          </button>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: isBot ? '90%' : '80%'
                }}
              >
                {isBot && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-deep-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <Bot size={15} />
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: isBot ? 'var(--color-white)' : 'var(--color-royal-blue)',
                    color: isBot ? 'var(--color-text-dark)' : '#FFFFFF',
                    border: isBot ? '1px solid var(--color-border-grey)' : 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 18px',
                    boxShadow: 'var(--shadow-xs)',
                    fontSize: '13px',
                    lineHeight: 1.5
                  }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>

                  {/* Metrics Table if present */}
                  {msg.metricsTable && (
                    <div style={{ marginTop: '12px', background: 'var(--color-bg-soft)', borderRadius: 'var(--radius-md)', padding: '8px 12px', border: '1px solid var(--color-border-grey)' }}>
                      <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                        <tbody>
                          {msg.metricsTable.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: rIdx === msg.metricsTable!.length - 1 ? 'none' : '1px solid var(--color-border-light)' }}>
                              <td style={{ padding: '4px 0', color: 'var(--color-text-secondary)' }}>{row.label}</td>
                              <td style={{ padding: '4px 8px', fontWeight: 700, color: 'var(--color-text-dark)', textAlign: 'right' }}>{row.value}</td>
                              {row.note && <td style={{ padding: '4px 0', fontSize: '11px', color: 'var(--status-critical-text)', textAlign: 'right' }}>{row.note}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Project Jump-Links */}
                  {msg.referencedProjectIds && msg.referencedProjectIds.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {msg.referencedProjectIds.map(pid => (
                        <button
                          key={pid}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '11px', background: 'var(--color-royal-blue-subtle)', borderColor: 'var(--color-royal-blue-border)', color: 'var(--color-royal-blue)' }}
                          onClick={() => navigateToProject(pid)}
                        >
                          <ExternalLink size={11} /> Open {pid} Intelligence
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Meta */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '10.5px', color: isBot ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.8)' }}>
                    <span>{msg.timestamp}</span>
                    {msg.confidence && <span>Confidence: <strong>{msg.confidence}</strong></span>}
                  </div>
                </div>

                {!isBot && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-royal-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--color-border-grey)', background: 'var(--color-bg-soft)', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="gov-input"
            placeholder="Ask anything about 1,981 central projects, cost risk, delay factors..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendPrompt(inputQuery)}
            style={{ flex: 1, fontSize: '13px' }}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleSendPrompt(inputQuery)}
            style={{ padding: '8px 18px' }}
          >
            <Send size={15} /> Ask Sentinel AI
          </button>
        </div>
      </div>

      {/* Right Pane: Selected Active Project Context */}
      <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="gov-card-header" style={{ padding: '12px 14px' }}>
          <div className="gov-card-title" style={{ fontSize: '13px' }}>
            <Database size={14} color="var(--color-royal-blue)" />
            Active Project Context
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                {selectedProject.code}
              </span>
              <StatusBadge level={selectedProject.riskLevel} size="sm" />
            </div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0, lineHeight: 1.3 }}>
              {selectedProject.name}
            </h4>
          </div>

          <div style={{ background: 'var(--color-bg-soft)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-grey)', fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Ministry:</span>
              <span style={{ fontWeight: 600 }}>{selectedProject.ministry.replace('Ministry of ', '')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Revised Cost:</span>
              <span style={{ fontWeight: 600 }}>₹{selectedProject.revisedCost} Cr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Progress:</span>
              <span style={{ fontWeight: 600 }}>{selectedProject.physicalProgress}% (Gap -{selectedProject.progressGap}%)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Delay Drift:</span>
              <span style={{ fontWeight: 700, color: 'var(--status-critical-text)' }}>+{selectedProject.expectedDelayMonths} months</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Top Risk Driver
            </span>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-body)', margin: 0, lineHeight: 1.35 }}>
              {selectedProject.mainRiskReason}
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginTop: 'auto' }}
            onClick={() => navigateToProject(selectedProject.id)}
          >
            Open Full Project Intelligence →
          </button>
        </div>
      </div>
    </div>
  );
};
