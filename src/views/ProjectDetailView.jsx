import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { SHAPExplanationChart } from '../components/charts/SHAPExplanationChart';
import { ProgressTimelineChart } from '../components/charts/ProgressTimelineChart';
import { MilestoneAuditPanel } from '../components/milestones/MilestoneAuditPanel';
import { Building2, Clock, Sparkles, SlidersHorizontal, FileText, MapPin, ChevronRight, AlertTriangle, Send, Bot, User, X, MoreHorizontal, Gauge, Wallet, IndianRupee, Target, ClipboardList, Cpu, ArrowLeft } from 'lucide-react';
import { generateOfficialPDF } from '../utils/pdfGenerator';
const NOT_AVAILABLE = 'Not available';
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const inr = (v) => (isNum(v) ? `\u20B9${v.toLocaleString('en-IN')} Cr` : NOT_AVAILABLE);
const pct = (v) => (isNum(v) ? `${v}%` : NOT_AVAILABLE);
const text = (v) => {
    const s = typeof v === 'string' ? v.trim() : '';
    return s.length > 0 ? s : NOT_AVAILABLE;
};
const TAB_IDS = ['overview', 'milestones', 'costs', 'explainability', 'interventions'];
const TABS = [
    { id: 'overview', label: 'Summary & Baseline', hint: 'Project identifiers, delivery signal and risk indicators' },
    { id: 'milestones', label: 'Progress & Milestones', hint: 'Monthly progress timeline and recorded monthly returns' },
    { id: 'costs', label: 'Costs & Outlay', hint: 'Sanctioned, revised and predicted financial outlay' },
    { id: 'explainability', label: 'Risk Explainability', hint: 'SHAP feature attribution behind the risk score' },
    { id: 'interventions', label: 'Actions & Interventions', hint: 'Suggested interventions and their modelled impact' }
];
export const ProjectDetailView = () => {
    const { selectedProject, navigateTo, setSimulationParams, showNotification } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [showOverflow, setShowOverflow] = useState(false);
    const tabRefs = useRef({});
    const overflowRef = useRef(null);
    const aiTriggerRef = useRef(null);
    const aiCloseRef = useRef(null);
    // AI Assistant on-demand drawer state (never open by default)
    const [showAiDrawer, setShowAiDrawer] = useState(false);
    const [aiChatMessages, setAiChatMessages] = useState([]);
    const [aiInputText, setAiInputText] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const closeAiDrawer = useCallback(() => {
        setShowAiDrawer(false);
        aiTriggerRef.current?.focus();
    }, []);
    // Scroll lock + Escape + focus restore while the AI drawer is open
    useEffect(() => {
        if (!showAiDrawer)
            return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                closeAiDrawer();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        const t = window.setTimeout(() => aiCloseRef.current?.focus(), 0);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', onKeyDown);
            window.clearTimeout(t);
        };
    }, [showAiDrawer, closeAiDrawer]);
    // Overflow menu: dismiss on outside click or Escape
    useEffect(() => {
        if (!showOverflow)
            return;
        const onPointerDown = (e) => {
            if (overflowRef.current && !overflowRef.current.contains(e.target))
                setShowOverflow(false);
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape')
                setShowOverflow(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [showOverflow]);
    const p = selectedProject;
    const handleTabKeyDown = (e, index) => {
        let next = -1;
        if (e.key === 'ArrowRight')
            next = (index + 1) % TAB_IDS.length;
        else if (e.key === 'ArrowLeft')
            next = (index - 1 + TAB_IDS.length) % TAB_IDS.length;
        else if (e.key === 'Home')
            next = 0;
        else if (e.key === 'End')
            next = TAB_IDS.length - 1;
        if (next < 0)
            return;
        e.preventDefault();
        const id = TAB_IDS[next];
        setActiveTab(id);
        tabRefs.current[id]?.focus();
    };
    const handleAskAiQuestion = (prompt) => {
        setAiChatMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
        setIsAiLoading(true);
        window.setTimeout(() => {
            let reply = '';
            const citations = [`${p.code} CUF Monthly Return`, `MoSPI IPMD Risk Engine v2.4`];
            if (prompt.includes('Summarise')) {
                reply = `${p.name} (${p.code}) is a ${inr(p.revisedCost)} ${p.sector} project by ${p.implementingAgency}. Physical progress stands at ${pct(p.physicalProgress)} against expected target ${pct(p.expectedProgress)}. Expected completion is ${text(p.aiPredictedCompletionDate)}.`;
            }
            else if (prompt.includes('attention') || prompt.includes('Why')) {
                reply = `Project flagged as ${p.riskLevel.toUpperCase()} priority due to: 1) ${text(p.mainRiskReason)}, 2) Progress gap of ${isNum(p.progressGap) ? Math.round(p.progressGap) + ' pts' : NOT_AVAILABLE} vs baseline, and 3) ${pct(p.scheduleDelayProbability)} calculated schedule overrun probability.`;
            }
            else if (prompt.includes('changed')) {
                reply = `Since the last monthly return: physical progress is ${pct(p.physicalProgress)}, cumulative expenditure reached ${inr(p.expenditure)} (${isNum(p.expenditure) && isNum(p.revisedCost) && p.revisedCost > 0 ? Math.round((p.expenditure / p.revisedCost) * 100) + '%' : NOT_AVAILABLE} of outlay), and clearance status reads ${text(p.cuf?.clearanceStatus)}.`;
            }
            else if (prompt.includes('milestones')) {
                const last = (p.monthlyHistory || [])[p.monthlyHistory.length - 1];
                reply = `Most recent recorded month ${text(last?.month)}: physical progress ${pct(last?.actualProgress)} against ${pct(last?.expectedProgress)} expected, risk score ${isNum(last?.riskScore) ? last.riskScore : NOT_AVAILABLE}/100.`;
            }
            else {
                reply = `Recommended action: ${p.recommendedInterventions?.[0]?.title || p.interventions?.[0]?.title || 'escalate to the inter-ministerial taskforce desk for clearance resolution'}.`;
            }
            setAiChatMessages((prev) => [...prev, { sender: 'ai', text: reply, citations }]);
            setIsAiLoading(false);
        }, 600);
    };
    const handleCustomAiSubmit = (e) => {
        e.preventDefault();
        if (!aiInputText.trim())
            return;
        const q = aiInputText;
        setAiInputText('');
        handleAskAiQuestion(q);
    };
    const openSimulator = () => {
        setShowOverflow(false);
        setSimulationParams({
            physicalProgress: p.physicalProgress,
            monthlyProgressRate: 0.8,
            fundingAvailability: 70,
            contractorCapacity: p.cuf?.contractorCapacity || 60,
            landAcquisitionPct: p.cuf?.landAcquisitionPct || 70,
            clearanceSpeed: 50,
            resourceDeployment: 50
        });
        navigateTo('simulator');
    };
    const handleSimulateIntervention = (intItem) => {
        setSimulationParams({
            physicalProgress: p.physicalProgress,
            monthlyProgressRate: 2.5,
            fundingAvailability: 90,
            contractorCapacity: 80,
            landAcquisitionPct: Math.min(100, (p.cuf?.landAcquisitionPct || 70) + 15),
            clearanceSpeed: 85,
            resourceDeployment: 75
        });
        navigateTo('simulator');
        showNotification(`Loaded scenario for ${p.code}: "${intItem.title}" into What-If Simulator.`);
    };
    const openAiDrawer = () => {
        setShowAiDrawer(true);
        if (aiChatMessages.length === 0) {
            setAiChatMessages([
                {
                    sender: 'ai',
                    text: `Sentinel AI Copilot active for ${p.name} (${p.code}). Ask any inquiry regarding this project's latest CUF monthly return, milestones, or risk drivers.`
                }
            ]);
        }
    };
    if (!p) {
        return (<div className="pd-panel">
        <p style={{ fontSize: 14, color: 'var(--ui-text-2)', marginBottom: 16 }}>
          No project is currently selected.
        </p>
        <button type="button" className="ui-btn ui-btn-primary" onClick={() => navigateTo('projects')}>
          <ArrowLeft size={14}/>
          <span>Back to Projects Directory</span>
        </button>
      </div>);
    }
    const isUrgent = p.riskLevel.toLowerCase() === 'critical' ||
        p.riskLevel.toLowerCase() === 'high' ||
        p.status === 'Critical Delay' ||
        p.status === 'Critical Review' ||
        p.status === 'Delayed';
    const targetCompletion = text(p.revisedCompletionDate || p.originalCompletionDate);
    const slippage = isNum(p.expectedDelayMonths) && p.expectedDelayMonths > 0 ? `+${p.expectedDelayMonths} months slippage` : 'On planned schedule';
    const utilisation = isNum(p.expenditure) && isNum(p.revisedCost) && p.revisedCost > 0
        ? `${Math.round((p.expenditure / p.revisedCost) * 100)}% of revised cost`
        : NOT_AVAILABLE;
    const escalation = isNum(p.revisedCost) && isNum(p.originalCost) ? p.revisedCost - p.originalCost : null;
    const interventions = p.interventions || p.recommendedInterventions || [];
    const history = p.monthlyHistory || [];
    const activeTabMeta = TABS.find((t) => t.id === activeTab);
    return (<div className="pd-page">
      {/* 1. Breadcrumb */}
      <nav className="pd-breadcrumb" aria-label="Breadcrumb">
        <button type="button" className="pd-breadcrumb-link" onClick={() => navigateTo('projects')}>
          <ArrowLeft size={13} aria-hidden="true"/>
          <span>Projects</span>
        </button>
        <span className="pd-breadcrumb-sep" aria-hidden="true">
          <ChevronRight size={14}/>
        </span>
        <span className="pd-breadcrumb-current" aria-current="page">
          {p.code}
        </span>
      </nav>

      {/* 2. Page header: identity + compact status + action group */}
      <header className="pd-header">
        <div className="pd-header-main">
          <div className="pd-eyebrow">
            <span className="ui-chip ui-chip-mono">{p.code}</span>
            <span className="pd-eyebrow-meta">
              {text(p.sector)} &middot; {text(p.implementingAgency)}
            </span>
          </div>

          <h1 className="pd-title">{p.name}</h1>

          <ul className="pd-meta-row">
            <li>
              <Building2 size={14} aria-hidden="true"/>
              <span>{text(p.ministry)}</span>
            </li>
            <li>
              <MapPin size={14} aria-hidden="true"/>
              <span>{[text(p.state), p.district ? text(p.district) : ''].filter(Boolean).join(', ')}</span>
            </li>
            <li>
              <Clock size={14} aria-hidden="true"/>
              <span>Target completion {targetCompletion}</span>
            </li>
          </ul>
        </div>

        <div className="pd-header-aside">
          <div className="pd-status-cluster">
            <StatusBadge level={p.riskLevel} customLabel={p.status} size="sm"/>
            <span className="pd-risk-chip">
              Risk score <b>{isNum(p.riskScore) ? p.riskScore : NOT_AVAILABLE}</b>
              {isNum(p.riskScore) ? <span>/100</span> : null}
            </span>
          </div>

          <div className="pd-actions">
            <button type="button" className="ui-btn ui-btn-ghost" onClick={openAiDrawer} ref={(el) => {
            aiTriggerRef.current = el;
        }}>
              <Sparkles size={14} aria-hidden="true"/>
              <span>Ask AI</span>
            </button>
            <button type="button" className="ui-btn ui-btn-primary" onClick={() => {
            try {
              const fileName = generateOfficialPDF({
                title: `${p.name} - Official Project Dossier`,
                id: p.code || p.id,
                category: p.sector || 'Central Sector Infrastructure',
                classification: 'Official Technical Dossier',
                totalCost: inr(p.sanctionedCostCr || p.costCr),
                projectsMonitored: '1 Monitored Asset',
                criticalProjects: p.riskLevel,
                avgCompletion: pct(p.physicalProgressPct),
                description: `Detailed project dossier for ${p.name} (${p.code}). Implementing Agency: ${p.agency || 'MoSPI'}. State: ${p.state}. Current physical progress: ${p.physicalProgressPct}%. Risk classification: ${p.riskLevel} with predicted delay of ${p.predictedDelayMonths || 0} months.`
              });
              showNotification(`Downloaded project dossier: ${fileName}`);
            } catch (err) {
              console.error('Error exporting dossier:', err);
              showNotification('Failed to generate project dossier PDF.', 'error');
            }
        }}>
              <FileText size={14} aria-hidden="true"/>
              <span>Export Dossier</span>
            </button>

            <div className="ui-menu-anchor" ref={overflowRef}>
              <button type="button" className="ui-btn ui-btn-secondary" aria-haspopup="menu" aria-expanded={showOverflow} aria-controls="pd-overflow-menu" onClick={() => setShowOverflow((v) => !v)}>
                <MoreHorizontal size={14} aria-hidden="true"/>
                <span>More</span>
              </button>
              {showOverflow && (<div className="ui-menu-panel" id="pd-overflow-menu" role="menu">
                  <button type="button" role="menuitem" className="ui-menu-item" onClick={openSimulator}>
                    <SlidersHorizontal size={15} aria-hidden="true"/>
                    <span>
                      What-If Simulator
                      <small>Run counterfactual delivery scenarios for this project</small>
                    </span>
                  </button>
                  <button type="button" role="menuitem" className="ui-menu-item" onClick={() => {
                setShowOverflow(false);
                setActiveTab('explainability');
            }}>
                    <Cpu size={15} aria-hidden="true"/>
                    <span>
                      Risk attribution
                      <small>Inspect SHAP drivers behind the risk score</small>
                    </span>
                  </button>
                  <button type="button" role="menuitem" className="ui-menu-item" onClick={() => {
                setShowOverflow(false);
                navigateTo('projects');
            }}>
                    <ClipboardList size={15} aria-hidden="true"/>
                    <span>
                      Back to projects
                      <small>Return to the projects directory</small>
                    </span>
                  </button>
                </div>)}
            </div>
          </div>
        </div>
      </header>

      {/* 3. Concise alert - only when an existing urgent / delayed condition applies */}
      {isUrgent && (<div className="pd-alert" role="status">
          <AlertTriangle size={17} className="pd-alert-icon" aria-hidden="true"/>
          <div className="pd-alert-text">
            <strong>Attention required &mdash; {p.status}</strong>
            <span>{text(p.mainRiskReason)}</span>
          </div>
          <button type="button" className="ui-btn" onClick={() => setActiveTab('interventions')}>
            Review interventions
          </button>
        </div>)}

      {/* 4. Compact summary of existing project metrics */}
      <section className="pd-metrics" aria-label="Project summary">
        <div className="pd-metric">
          <span className="pd-metric-label">
            <Gauge size={13} aria-hidden="true"/>
            Physical progress
          </span>
          <p className="pd-metric-value">
            {isNum(p.physicalProgress) ? (<>
                {p.physicalProgress}
                <small>%</small>
              </>) : (<span className="ui-na">{NOT_AVAILABLE}</span>)}
          </p>
          <p className="pd-metric-foot">Schedule target {pct(p.expectedProgress)}</p>
          {isNum(p.physicalProgress) && (<div className="pd-meter" data-tone={isNum(p.expectedProgress) && p.physicalProgress < p.expectedProgress ? 'warn' : 'ok'} role="img" aria-label={`Physical progress ${p.physicalProgress} percent`}>
              <i style={{ width: `${Math.max(0, Math.min(100, p.physicalProgress))}%` }}/>
            </div>)}
        </div>

        <div className="pd-metric">
          <span className="pd-metric-label">
            <Wallet size={13} aria-hidden="true"/>
            Approved cost
          </span>
          <p className="pd-metric-value">{inr(p.revisedCost)}</p>
          <p className="pd-metric-foot">Original sanction {inr(p.originalCost)}</p>
        </div>

        <div className="pd-metric">
          <span className="pd-metric-label">
            <IndianRupee size={13} aria-hidden="true"/>
            Expenditure
          </span>
          <p className="pd-metric-value">{inr(p.expenditure)}</p>
          <p className="pd-metric-foot">Utilisation {utilisation}</p>
        </div>

        <div className="pd-metric">
          <span className="pd-metric-label">
            <Target size={13} aria-hidden="true"/>
            Target completion
          </span>
          <p className="pd-metric-value">{targetCompletion}</p>
          <p className="pd-metric-foot">{slippage}</p>
        </div>
      </section>

      {/* 5. Tabs */}
      <div className="pd-tabs">
        <div className="pd-tablist" role="tablist" aria-label="Project detail sections">
          {TABS.map((tab, index) => (<button key={tab.id} type="button" role="tab" id={`pd-tab-${tab.id}`} aria-selected={activeTab === tab.id} aria-controls={`pd-panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} ref={(el) => {
                tabRefs.current[tab.id] = el;
            }} className="pd-tab" onClick={() => setActiveTab(tab.id)} onKeyDown={(e) => handleTabKeyDown(e, index)}>
              {tab.label}
            </button>))}
        </div>
      </div>

      <div role="tabpanel" id={`pd-panel-${activeTab}`} aria-labelledby={`pd-tab-${activeTab}`} tabIndex={0} className="pd-panel">
        <div className="pd-panel-head">
          <div>
            <h2 className="pd-panel-title">{activeTabMeta.label}</h2>
            <p className="pd-panel-sub">{activeTabMeta.hint}</p>
          </div>
        </div>

        {/* ---- Summary & Baseline ---- */}
        {activeTab === 'overview' && (<div className="pd-grid-2">
            <section className="pd-panel" style={{ boxShadow: 'none' }}>
              <h3 className="pd-panel-title" style={{ fontSize: 14, marginBottom: 12 }}>
                Project baseline
              </h3>
              <dl className="pd-dl">
                <div>
                  <dt>Implementing agency</dt>
                  <dd>{text(p.implementingAgency)}</dd>
                </div>
                <div>
                  <dt>Ministry</dt>
                  <dd>{text(p.ministry)}</dd>
                </div>
                <div>
                  <dt>Sector</dt>
                  <dd>{text(p.sector)}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{[text(p.state), p.district ? text(p.district) : ''].filter(Boolean).join(', ')}</dd>
                </div>
                <div>
                  <dt>Original sanctioned cost</dt>
                  <dd>{inr(p.originalCost)}</dd>
                </div>
                <div>
                  <dt>Revised approved cost</dt>
                  <dd>{inr(p.revisedCost)}</dd>
                </div>
                <div>
                  <dt>Original completion</dt>
                  <dd>{text(p.originalCompletionDate)}</dd>
                </div>
              </dl>
            </section>

            <section className="pd-panel" style={{ boxShadow: 'none' }}>
              <h3 className="pd-panel-title" style={{ fontSize: 14, marginBottom: 12 }}>
                Monthly progress signal
              </h3>
              <dl className="pd-dl">
                <div>
                  <dt>Physical progress</dt>
                  <dd>{pct(p.physicalProgress)}</dd>
                </div>
                <div>
                  <dt>Expected progress</dt>
                  <dd>{pct(p.expectedProgress)}</dd>
                </div>
                <div>
                  <dt>Progress gap</dt>
                  <dd>{isNum(p.progressGap) ? `${p.progressGap} pts behind target` : NOT_AVAILABLE}</dd>
                </div>
                <div>
                  <dt>Land acquisition (RoW)</dt>
                  <dd>{isNum(p.cuf?.landAcquisitionPct) ? `${p.cuf.landAcquisitionPct}% complete` : NOT_AVAILABLE}</dd>
                </div>
                <div>
                  <dt>Contractor capacity index</dt>
                  <dd>
                    {isNum(p.cuf?.contractorCapacity) ? `${p.cuf.contractorCapacity} / 100` : NOT_AVAILABLE}
                  </dd>
                </div>
                <div>
                  <dt>Statutory clearance</dt>
                  <dd>{text(p.cuf?.clearanceStatus)}</dd>
                </div>
                <div>
                  <dt>Funding availability</dt>
                  <dd>{text(p.cuf?.fundingAvailability)}</dd>
                </div>
              </dl>
            </section>

            <section className="pd-panel pd-span-2" style={{ boxShadow: 'none' }}>
              <h3 className="pd-panel-title" style={{ fontSize: 14, marginBottom: 12 }}>
                Schedule &amp; risk indicators
              </h3>
              <dl className="pd-dl">
                <div>
                  <dt>Delivery status</dt>
                  <dd>{text(p.status)}</dd>
                </div>
                <div>
                  <dt>Risk score</dt>
                  <dd>
                    {isNum(p.riskScore) ? `${p.riskScore} / 100` : NOT_AVAILABLE}
                    {isNum(p.confidenceScore) ? ` (${p.confidenceScore}% model confidence)` : ''}
                  </dd>
                </div>
                <div>
                  <dt>Risk trend</dt>
                  <dd>{text(p.riskTrend)}</dd>
                </div>
                <div>
                  <dt>Schedule overrun probability</dt>
                  <dd>{pct(p.scheduleDelayProbability)}</dd>
                </div>
                <div>
                  <dt>Cost overrun probability</dt>
                  <dd>{pct(p.costOverrunProbability)}</dd>
                </div>
                <div>
                  <dt>Revised / predicted completion</dt>
                  <dd>
                    {text(p.revisedCompletionDate)} &middot; {text(p.aiPredictedCompletionDate)}
                  </dd>
                </div>
                <div>
                  <dt>Primary risk reason</dt>
                  <dd>{text(p.mainRiskReason)}</dd>
                </div>
              </dl>
            </section>
          </div>)}

        {/* ---- Progress & Milestones ---- */}
        {activeTab === 'milestones' && (<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {history.length > 0 ? (<ProgressTimelineChart history={history} originalDate={p.originalCompletionDate || ''} revisedDate={p.revisedCompletionDate || ''} aiPredictedDate={p.aiPredictedCompletionDate || ''}/>) : (<p className="pd-empty">No monthly progress returns are recorded for this project yet.</p>)}

            {history.length > 0 && (<div>
                <h3 className="pd-panel-title" style={{ fontSize: 14, marginBottom: 10 }}>
                  Recorded monthly returns
                </h3>
                <div className="pd-table-scroll" tabIndex={0} role="group" aria-label="Recorded monthly returns, scrollable">
                  <table>
                    <caption className="sr-only">Physical progress, expenditure and risk score by month</caption>
                    <thead>
                      <tr>
                        <th scope="col">Reporting month</th>
                        <th scope="col" className="num">Physical progress</th>
                        <th scope="col" className="num">Expected</th>
                        <th scope="col" className="num">Gap</th>
                        <th scope="col" className="num">Expenditure</th>
                        <th scope="col" className="num">Risk score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...history].reverse().map((h, i) => (<tr key={`${h.month}-${i}`}>
                          <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, background: 'transparent', borderBottom: '1px solid var(--ui-divider)', fontWeight: 600 }}>
                            {text(h.month)}
                          </th>
                          <td className="num">{pct(h.actualProgress)}</td>
                          <td className="num">{pct(h.expectedProgress)}</td>
                          <td className="num">
                            {isNum(h.actualProgress) && isNum(h.expectedProgress)
                        ? `${(h.actualProgress - h.expectedProgress).toFixed(1)}`
                        : NOT_AVAILABLE}
                          </td>
                          <td className="num">{inr(h.expenditure)}</td>
                          <td className="num">{isNum(h.riskScore) ? h.riskScore : NOT_AVAILABLE}</td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
                <p className="pd-scroll-hint">Scroll the table sideways to see all columns.</p>
              </div>)}

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="mb-4">
                <h3 className="text-base font-bold text-[#172033]">Milestone Execution &amp; Statutory Audit</h3>
                <p className="text-xs text-[#526176]">Package-level delivery tracking, delay analysis, and statutory audit verification</p>
              </div>
              <MilestoneAuditPanel project={p}/>
            </div>
          </div>)}

        {/* ---- Costs & Outlay ---- */}
        {activeTab === 'costs' && (<div className="pd-stat-grid">
            <div className="pd-stat">
              <span>Cost escalation vs sanction</span>
              <strong style={{ color: escalation !== null && escalation > 0 ? '#B42318' : 'var(--ui-text)' }}>
                {escalation === null ? NOT_AVAILABLE : `${escalation > 0 ? '+' : ''}\u20B9${Math.abs(escalation).toLocaleString('en-IN')} Cr`}
              </strong>
              <em>
                {escalation === null || !isNum(p.originalCost) || p.originalCost === 0
                ? NOT_AVAILABLE
                : `${Math.abs(Math.round((escalation / p.originalCost) * 100))}% ${escalation >= 0 ? 'above' : 'below'} the sanctioned baseline`}
              </em>
            </div>
            <div className="pd-stat">
              <span>Fund utilisation</span>
              <strong>{utilisation}</strong>
              <em>{inr(p.expenditure)} spent of {inr(p.revisedCost)} revised outlay</em>
            </div>
            <div className="pd-stat">
              <span>Cost overrun probability</span>
              <strong>{pct(p.costOverrunProbability)}</strong>
              <em>Modelled probability of exceeding the revised outlay</em>
            </div>
            <div className="pd-stat">
              <span>Predicted final cost</span>
              <strong>{inr(p.predictedFinalCost)}</strong>
              <em>Forecast escalation {inr(p.costEscalationAmount)} above revised cost</em>
            </div>
          </div>)}

        {/* ---- Risk Explainability (advanced analysis, not shown by default) ---- */}
        {activeTab === 'explainability' && (<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="pd-panel-sub" style={{ margin: 0 }}>
              Additive feature importance from the TreeSHAP risk model. Positive contributions increase the predicted
              risk score, negative contributions reduce it.
            </p>
            {(p.shapContributors || []).length > 0 ? (<SHAPExplanationChart contributors={p.shapContributors} projectRiskScore={p.riskScore}/>) : (<p className="pd-empty">No model attribution has been published for this project yet.</p>)}
          </div>)}

        {/* ---- Actions & Interventions ---- */}
        {activeTab === 'interventions' && (<div>
            {interventions.length > 0 ? (<>
                <p className="pd-panel-sub" style={{ margin: '0 0 14px' }}>
                  These are suggested interventions from the monitoring model. Use &ldquo;Simulate impact&rdquo; to load
                  the scenario into the What-If Simulator before recording an approved action.
                </p>
                {interventions.map((item, idx) => (<article className="pd-intervention" key={item.id || idx}>
                    <div className="pd-intervention-head">
                      <div style={{ minWidth: 0 }}>
                        <h4 className="pd-intervention-title">
                          {text(item.title)}{' '}
                          <span className="ui-chip" style={{ verticalAlign: 'middle' }}>
                            {text(item.priority)} priority
                          </span>
                        </h4>
                        <p>{text(item.reason || item.description)}</p>
                      </div>
                      <button type="button" className="ui-btn ui-btn-secondary" onClick={() => handleSimulateIntervention(item)}>
                        <SlidersHorizontal size={14} aria-hidden="true"/>
                        <span>Simulate impact</span>
                      </button>
                    </div>
                    <dl className="pd-dl">
                      <div>
                        <dt>Expected impact</dt>
                        <dd>{text(item.expectedImpact)}</dd>
                      </div>
                      <div>
                        <dt>Assigned agency</dt>
                        <dd>{text(item.assignedAgency)}</dd>
                      </div>
                    </dl>
                  </article>))}
              </>) : (<p className="pd-empty">
                No interventions are currently suggested for this project. Review the monthly returns and clearances in
                the Summary tab, or open the What-If Simulator to model a scenario manually.
              </p>)}
          </div>)}
      </div>

      {/* 6. On-demand AI copilot drawer (opaque panel, separate backdrop) */}
      {showAiDrawer && (<div className="pd-ai-overlay">
          <div className="pd-ai-backdrop" onClick={closeAiDrawer}/>
          <div className="pd-ai-panel" role="dialog" aria-modal="true" aria-label="Sentinel AI Copilot for this project">
            <div className="pd-ai-header">
              <div style={{ minWidth: 0 }}>
                <div className="pd-ai-title">
                  <Sparkles size={16} aria-hidden="true"/>
                  <span>Sentinel AI Copilot</span>
                </div>
                <div className="pd-ai-project">{p.name}</div>
              </div>
              <button type="button" className="pd-ai-close" onClick={closeAiDrawer} aria-label="Close AI copilot" ref={aiCloseRef}>
                <X size={15} aria-hidden="true"/>
              </button>
            </div>

            <div className="pd-ai-chips">
              {[
                'Summarise this project',
                'Why does this project need attention?',
                'What changed since last update?',
                'Which milestones need review?'
            ].map((chip) => (<button key={chip} type="button" className="pd-ai-chip" onClick={() => handleAskAiQuestion(chip)}>
                  {chip}
                </button>))}
            </div>

            <div className="pd-ai-body">
              {aiChatMessages.map((msg, idx) => (<div key={idx} className={`pd-ai-msg pd-ai-msg-${msg.sender}`}>
                  {msg.text}
                  {msg.citations && (<div className="pd-ai-cite">
                      <strong style={{ fontWeight: 700 }}>Sources</strong>
                      <br />
                      {msg.citations.map((c, i) => (<span key={i}>{c}</span>))}
                    </div>)}
                </div>))}

              {isAiLoading && (<div className="pd-ai-thinking">
                  <Bot size={14} aria-hidden="true"/>
                  <span>Grounding the answer in {p.code} monthly records&hellip;</span>
                </div>)}
            </div>

            <form className="pd-ai-form" onSubmit={handleCustomAiSubmit}>
              <label className="sr-only" htmlFor="pd-ai-input">
                Ask a question about {p.code}
              </label>
              <User size={15} aria-hidden="true" style={{ alignSelf: 'center', color: 'var(--ui-text-2)' }}/>
              <input id="pd-ai-input" type="text" placeholder={`Ask about ${p.code} milestones, costs, or delays...`} value={aiInputText} onChange={(e) => setAiInputText(e.target.value)}/>
              <button type="submit" className="pd-ai-send" aria-label="Send question" disabled={isAiLoading}>
                <Send size={14} aria-hidden="true"/>
              </button>
            </form>
          </div>
        </div>)}

      {showAiDrawer && <span className="sr-only" role="status">AI copilot panel opened</span>}
    </div>);
};
