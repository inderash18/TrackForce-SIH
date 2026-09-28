import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { sectorSummaryList } from '../data/nationalMetrics';
import { StatusBadge } from '../components/common/StatusBadge';
import { ShieldAlert, AlertTriangle, ChevronRight, TrendingUp, Search, RotateCcw, Download, Flame, DollarSign, Clock, Layers, MapPin, Building2, Info } from 'lucide-react';
export const RiskMonitorView = () => {
    const { projects, navigateToProject, reportingMonth, showNotification } = useApp();
    const [selectedRiskTier, setSelectedRiskTier] = useState('all');
    const [selectedSector, setSelectedSector] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    // Filtered Critical / Watchlist Projects
    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            // Risk Tier Filter
            if (selectedRiskTier !== 'all' && p.riskLevel.toLowerCase() !== selectedRiskTier.toLowerCase()) {
                return false;
            }
            if (activeTab !== 'all' && p.riskLevel.toLowerCase() !== activeTab.toLowerCase()) {
                return false;
            }
            // Sector Filter
            if (selectedSector !== 'all' && p.sector !== selectedSector) {
                return false;
            }
            // Search
            if (searchTerm) {
                const q = searchTerm.toLowerCase();
                const matchesName = p.name.toLowerCase().includes(q);
                const matchesCode = p.code.toLowerCase().includes(q);
                const matchesState = p.state.toLowerCase().includes(q);
                const matchesMinistry = p.ministry.toLowerCase().includes(q);
                if (!matchesName && !matchesCode && !matchesState && !matchesMinistry)
                    return false;
            }
            return true;
        });
    }, [projects, selectedRiskTier, selectedSector, searchTerm, activeTab]);
    // High-level KPI Computations
    const stats = useMemo(() => {
        const criticalProjects = projects.filter((p) => p.riskLevel === 'critical');
        const highRiskProjects = projects.filter((p) => p.riskLevel === 'high');
        const totalHighRisk = criticalProjects.length + highRiskProjects.length;
        const criticalOutlay = criticalProjects.reduce((sum, p) => sum + p.revisedCost, 0) +
            highRiskProjects.reduce((sum, p) => sum + p.revisedCost, 0);
        const highestDelaySector = [...sectorSummaryList].sort((a, b) => b.delayRiskAvg - a.delayRiskAvg)[0];
        const highestDriftSector = [...sectorSummaryList].sort((a, b) => b.costGrowthPct - a.costGrowthPct)[0];
        return {
            totalHighRisk,
            criticalCount: criticalProjects.length,
            highCount: highRiskProjects.length,
            criticalOutlayCr: (criticalOutlay / 1000).toFixed(2),
            highestDelaySectorName: highestDelaySector ? highestDelaySector.sector : 'Urban Dev',
            highestDelayPct: highestDelaySector ? highestDelaySector.delayRiskAvg : 72,
            highestDriftSectorName: highestDriftSector ? highestDriftSector.sector : 'Railways',
            highestDriftPct: highestDriftSector ? highestDriftSector.costGrowthPct : 26.8
        };
    }, [projects]);
    const handleExport = () => {
        showNotification('Generating Risk Surveillance Dossier (PDF/Excel)...');
    };
    const resetFilters = () => {
        setSelectedRiskTier('all');
        setSelectedSector('all');
        setSearchTerm('');
        setActiveTab('all');
    };
    return (<div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '30px' }}>
      {/* 1. Executive Page Hero Header */}
      <div style={{
            background: 'linear-gradient(135deg, #EBF4FD 0%, #F4F8FC 60%, #FFFFFF 100%)',
            borderRadius: '16px',
            padding: '24px 28px',
            color: '#0F172A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            border: '1px solid #E2E8F0'
        }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 9px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            background: '#FEE2E2',
            color: '#DC2626',
            border: '1px solid #FECACA'
        }}>
              <Flame size={13}/>
              MoSPI SENTINEL RISK AI
            </span>
            <span style={{
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            background: '#E0F2FE',
            color: '#0284C7',
            border: '1px solid #BAE6FD'
        }}>
              Cycle: {reportingMonth}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', color: '#0F172A' }}>
            National Risk Surveillance Monitor
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
            Automated multi-factor risk scoring, sector delay vulnerability curves, cost-drift surveillance, and early-warning containment clusters across central infrastructure projects.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleExport} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '9px 15px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 600,
            background: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
            transition: 'all 0.15s ease'
        }}>
            <Download size={14}/>
            Export Dossier
          </button>
        </div>
      </div>

      {/* 2. Top 4 High-Impact KPI Metric Cards */}
      <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
        }}>
        {/* Card 1: Critical & High Risk Projects */}
        <div style={{
            background: 'linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%)',
            border: '1px solid #FEB2B2',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(229, 62, 62, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#9B2C2C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              High & Critical Projects
            </span>
            <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#E53E3E',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
              <AlertTriangle size={17}/>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#742A2A', lineHeight: 1 }}>
              {stats.totalHighRisk}
            </div>
            <div style={{ fontSize: '11.5px', color: '#9B2C2C', marginTop: '6px', fontWeight: 600 }}>
              <span style={{ color: '#C53030', fontWeight: 800 }}>{stats.criticalCount} Critical</span> + {stats.highCount} High Alert
            </div>
          </div>
        </div>

        {/* Card 2: Risk-Exposed Outlay */}
        <div style={{
            background: 'linear-gradient(135deg, #FFFDF5 0%, #FEEBC8 100%)',
            border: '1px solid #FBD38D',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(221, 107, 32, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#9C4221', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Risk-Exposed Outlay
            </span>
            <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#DD6B20',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
              <DollarSign size={17}/>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7B341E', lineHeight: 1 }}>
              ₹{stats.criticalOutlayCr} <span style={{ fontSize: '16px', fontWeight: 600 }}>k Cr</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#9C4221', marginTop: '6px', fontWeight: 600 }}>
              Capital at risk of timeline and cost overshoot
            </div>
          </div>
        </div>

        {/* Card 3: Max Delay Risk Sector */}
        <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #BAE6FD 100%)',
            border: '1px solid #7DD3FC',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Highest Delay Exposure
            </span>
            <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#0284C7',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
              <Clock size={17}/>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#0C4A6E', lineHeight: 1.2 }}>
              {stats.highestDelaySectorName}
            </div>
            <div style={{ fontSize: '11.5px', color: '#0369A1', marginTop: '6px', fontWeight: 700 }}>
              {stats.highestDelayPct}% Average Delay Probability
            </div>
          </div>
        </div>

        {/* Card 4: Highest Cost Drift Sector */}
        <div style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #E9D8FD 100%)',
            border: '1px solid #D6BCFA',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 2px 6px rgba(128, 90, 213, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#6B46C1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Max Cost Growth Drift
            </span>
            <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#805AD5',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
              <TrendingUp size={17}/>
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#44337A', lineHeight: 1.2 }}>
              {stats.highestDriftSectorName}
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B46C1', marginTop: '6px', fontWeight: 700 }}>
              +{stats.highestDriftPct}% Average Outlay Inflation
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sector-Wise Risk Exposure & Outlay Breakdown Matrix */}
      <div style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
        }}>
        {/* Header Bar */}
        <div style={{
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            color: '#0F172A',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284C7'
        }}>
              <ShieldAlert size={16}/>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>
                Sector-Wise Risk Exposure & Outlay Matrix
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Cross-sector vulnerability index, delay risk curves, and budget outlay drift
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
            fontSize: '11px',
            fontWeight: 600,
            background: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '6px',
            color: '#475569',
            border: '1px solid #E2E8F0'
        }}>
              {sectorSummaryList.length} Central Sectors Monitored
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '12px 18px', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sector Name
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Projects
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Critical Risk
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '160px', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Delay Risk Ratio
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Cost Drift
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'right', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sector Outlay
                </th>
                <th style={{ padding: '12px 18px', textAlign: 'center', fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Vulnerability Index
                </th>
              </tr>
            </thead>
            <tbody>
              {sectorSummaryList.map((sec, idx) => {
            const isHighRisk = sec.delayRiskAvg >= 60 || sec.criticalCount >= 20;
            const isMediumRisk = sec.delayRiskAvg >= 40 && sec.delayRiskAvg < 60;
            return (<tr key={sec.sector} style={{
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF',
                    transition: 'background-color 0.15s ease'
                }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#F0F7FF')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFCFF')}>
                    {/* Sector Name */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isHighRisk ? '#EF4444' : isMediumRisk ? '#F59E0B' : '#10B981'
                }}/>
                        <strong style={{ color: '#0F172A', fontSize: '13px' }}>{sec.sector}</strong>
                      </div>
                    </td>

                    {/* Total Projects */}
                    <td style={{ padding: '14px 14px', textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                      {sec.totalProjects}
                    </td>

                    {/* Critical Count */}
                    <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                      <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    backgroundColor: sec.criticalCount > 0 ? '#FEE2E2' : '#F1F5F9',
                    color: sec.criticalCount > 0 ? '#DC2626' : '#64748B',
                    border: sec.criticalCount > 0 ? '1px solid #FCA5A5' : '1px solid #E2E8F0'
                }}>
                        {sec.criticalCount}
                      </span>
                    </td>

                    {/* Delay Risk Ratio with Progress Bar */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                    flex: 1,
                    height: '7px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                          <div style={{
                    width: `${sec.delayRiskAvg}%`,
                    height: '100%',
                    backgroundColor: isHighRisk ? '#EF4444' : isMediumRisk ? '#F59E0B' : '#10B981',
                    borderRadius: '4px'
                }}/>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', width: '36px', textAlign: 'right' }}>
                          {sec.delayRiskAvg}%
                        </span>
                      </div>
                    </td>

                    {/* Cost Growth Drift */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{
                    fontWeight: 700,
                    fontSize: '12.5px',
                    color: sec.costGrowthPct > 15 ? '#DC2626' : sec.costGrowthPct > 8 ? '#D97706' : '#16A34A'
                }}>
                        +{sec.costGrowthPct}%
                      </span>
                    </td>

                    {/* Sector Outlay */}
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                      ₹{sec.budgetLakhCr} L Cr
                    </td>

                    {/* Vulnerability Index */}
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: isHighRisk ? '#FEF2F2' : isMediumRisk ? '#FFFBEB' : '#ECFDF5',
                    color: isHighRisk ? '#B91C1C' : isMediumRisk ? '#B45309' : '#047857',
                    border: isHighRisk
                        ? '1px solid #FECACA'
                        : isMediumRisk
                            ? '1px solid #FDE68A'
                            : '1px solid #A7F3D0'
                }}>
                        {isHighRisk ? 'Critical / High' : isMediumRisk ? 'Moderate' : 'Stable'}
                      </span>
                    </td>
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active Risk Hotspots Section with Controls */}
      <div style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden'
        }}>
        {/* Header & Filter Controls Strip */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '14px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
                <Flame size={15}/>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Active Critical Risk Hotspots & Vulnerable Projects
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Showing {filteredProjects.length} filtered projects under active surveillance
                </span>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#E2E8F0', padding: '3px', borderRadius: '8px' }}>
              <button onClick={() => setActiveTab('all')} style={{
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 600,
            border: 'none',
            background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'all' ? '#0F172A' : '#64748B',
            boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer'
        }}>
                All ({projects.length})
              </button>
              <button onClick={() => setActiveTab('critical')} style={{
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 600,
            border: 'none',
            background: activeTab === 'critical' ? '#EF4444' : 'transparent',
            color: activeTab === 'critical' ? '#FFFFFF' : '#64748B',
            boxShadow: activeTab === 'critical' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer'
        }}>
                Critical Risk ({projects.filter((p) => p.riskLevel === 'critical').length})
              </button>
              <button onClick={() => setActiveTab('high')} style={{
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 600,
            border: 'none',
            background: activeTab === 'high' ? '#F97316' : 'transparent',
            color: activeTab === 'high' ? '#FFFFFF' : '#64748B',
            boxShadow: activeTab === 'high' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer'
        }}>
                High Risk ({projects.filter((p) => p.riskLevel === 'high').length})
              </button>
              <button onClick={() => setActiveTab('moderate')} style={{
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11.5px',
            fontWeight: 600,
            border: 'none',
            background: activeTab === 'moderate' ? '#EAB308' : 'transparent',
            color: activeTab === 'moderate' ? '#FFFFFF' : '#64748B',
            boxShadow: activeTab === 'moderate' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            cursor: 'pointer'
        }}>
                Moderate ({projects.filter((p) => p.riskLevel === 'medium' || p.riskLevel === 'moderate').length})
              </button>
            </div>
          </div>

          {/* Interactive Search & Sector Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}/>
              <input type="text" placeholder="Search by project name, code, state, or ministry..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{
            width: '100%',
            padding: '8px 12px 8px 32px',
            fontSize: '12.5px',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            outline: 'none',
            background: '#FFFFFF'
        }}/>
            </div>

            {/* Sector Selector */}
            <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)} style={{
            padding: '8px 12px',
            fontSize: '12.5px',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            background: '#FFFFFF',
            color: '#1E293B',
            cursor: 'pointer'
        }}>
              <option value="all">All Sectors</option>
              {sectorSummaryList.map((s) => (<option key={s.sector} value={s.sector}>
                  {s.sector}
                </option>))}
            </select>

            {/* Risk Tier Select */}
            <select value={selectedRiskTier} onChange={(e) => setSelectedRiskTier(e.target.value)} style={{
            padding: '8px 12px',
            fontSize: '12.5px',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            background: '#FFFFFF',
            color: '#1E293B',
            cursor: 'pointer'
        }}>
              <option value="all">All Risk Tiers</option>
              <option value="critical">Critical Risk (Score &gt; 80)</option>
              <option value="high">High Risk (Score 60 - 80)</option>
              <option value="medium">Moderate Risk (Score 35 - 60)</option>
              <option value="low">Low Risk (Score &lt; 35)</option>
            </select>

            {/* Reset Button */}
            {(searchTerm || selectedSector !== 'all' || selectedRiskTier !== 'all' || activeTab !== 'all') && (<button onClick={resetFilters} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748B',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                cursor: 'pointer'
            }}>
                <RotateCcw size={13}/>
                Reset
              </button>)}
          </div>
        </div>

        {/* Project Hotspot Cards Grid */}
        <div style={{
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px',
            background: '#F8FAFC'
        }}>
          {filteredProjects.length === 0 ? (<div style={{
                gridColumn: '1 / -1',
                padding: '40px 20px',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px dashed #CBD5E1'
            }}>
              <Info size={32} color="#94A3B8" style={{ margin: '0 auto 10px auto' }}/>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>No projects match your filter criteria</div>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 12px 0' }}>
                Try selecting "All Risk Tiers" or clear your search keyword to view projects.
              </p>
              <button onClick={resetFilters} style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                background: '#0084C7',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer'
            }}>
                Reset All Filters
              </button>
            </div>) : (filteredProjects.map((p) => {
            const isCritical = p.riskLevel.toLowerCase() === 'critical';
            const isHigh = p.riskLevel.toLowerCase() === 'high';
            return (<div key={p.id} style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: isCritical
                        ? '1.5px solid #FCA5A5'
                        : isHigh
                            ? '1.5px solid #FDBA74'
                            : '1px solid #E2E8F0',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
                }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.04)';
                }}>
                  {/* Top Header */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: '#F1F5F9',
                    color: '#475569',
                    letterSpacing: '0.04em'
                }}>
                        {p.code}
                      </span>
                      <StatusBadge level={p.riskLevel} size="sm"/>
                    </div>

                    <h4 style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 6px 0',
                    lineHeight: 1.4,
                    cursor: 'pointer'
                }} onClick={() => navigateToProject(p.id)}>
                      {p.name}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#64748B', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Building2 size={12}/>
                        {p.ministry}
                      </span>
                      <span>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12}/>
                        {p.state}
                      </span>
                    </div>
                  </div>

                  {/* Mid Stats Strip */}
                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '8px',
                    border: '1px solid #F1F5F9'
                }}>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>Outlay</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                        ₹{p.revisedCost.toLocaleString('en-IN')} Cr
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>Progress</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0284C7', marginTop: '2px' }}>
                        {p.physicalProgress}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>Est. Delay</div>
                      <div style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: p.expectedDelayMonths > 12 ? '#DC2626' : '#D97706',
                    marginTop: '2px'
                }}>
                        +{p.expectedDelayMonths} Mos
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '10px'
                }}>
                    <span style={{
                    fontSize: '11px',
                    color: '#64748B',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                      <Layers size={12}/>
                      {p.sector}
                    </span>

                    <button onClick={() => navigateToProject(p.id)} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#0084C7',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '4px'
                }} onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}>
                      Inspect Dossier
                      <ChevronRight size={13}/>
                    </button>
                  </div>
                </div>);
        }))}
        </div>
      </div>
    </div>);
};
