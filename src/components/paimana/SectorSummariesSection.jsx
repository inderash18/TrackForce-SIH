import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sectorSummaryList, nationalSummaryMetrics, stateRiskBreakdown } from '../../data/nationalMetrics';
import { TrendingUp, Layers, IndianRupee, AlertCircle, Building2, MapPin, RefreshCw, ArrowUpRight } from 'lucide-react';
export const SectorSummariesSection = () => {
    const { navigateTo, setSelectedSector, setSelectedState } = useApp();
    const [activeTab, setActiveTab] = useState('sectors');
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleRetry = () => {
        setIsLoading(true);
        setHasError(false);
        setTimeout(() => {
            setIsLoading(false);
        }, 600);
    };
    const handleSectorClick = (sector) => {
        setSelectedSector(sector);
        navigateTo('projects');
    };
    const handleStateClick = (state) => {
        setSelectedState(state);
        navigateTo('map');
    };
    return (<section className="paimana-metrics-section" aria-labelledby="metrics-heading">
      <div className="paimana-section-container">
        {/* National Portfolio Key Indicators Header */}
        <div className="paimana-section-header-center">
          <div className="paimana-reporting-period-pill">
            <span className="dot"></span>
            Reporting Period: {nationalSummaryMetrics.reportingMonth} Flash Report
          </div>
          <h2 id="metrics-heading" className="paimana-section-title">
            National Infrastructure Portfolio Summary
          </h2>
          <p className="paimana-section-subtitle">
            Consolidated data for Central Sector Infrastructure Projects costing ₹ 150 Crore and above across India.
          </p>
        </div>

        {/* 4 Macro Indicator Metric Cards */}
        <div className="paimana-macro-cards-grid">
          {/* Total Projects */}
          <div className="paimana-macro-card">
            <div className="paimana-macro-icon blue">
              <Layers size={22}/>
            </div>
            <div className="paimana-macro-content">
              <span className="paimana-macro-label">Total Projects Monitored</span>
              <div className="paimana-macro-value tnum">
                {nationalSummaryMetrics.totalProjects.toLocaleString('en-IN')}
              </div>
              <span className="paimana-macro-sub">Central Sector & Mega Schemes</span>
            </div>
          </div>

          {/* Original Approved Cost */}
          <div className="paimana-macro-card">
            <div className="paimana-macro-icon navy">
              <IndianRupee size={22}/>
            </div>
            <div className="paimana-macro-content">
              <span className="paimana-macro-label">Original Approved Cost</span>
              <div className="paimana-macro-value tnum">
                ₹ {nationalSummaryMetrics.originalCostTotalLakhCr.toFixed(2)} <span className="unit">Lakh Cr</span>
              </div>
              <span className="paimana-macro-sub">Sanctioned Capital Outlay</span>
            </div>
          </div>

          {/* Anticipated Revised Cost */}
          <div className="paimana-macro-card">
            <div className="paimana-macro-icon orange">
              <TrendingUp size={22}/>
            </div>
            <div className="paimana-macro-content">
              <span className="paimana-macro-label">Anticipated Revised Cost</span>
              <div className="paimana-macro-value tnum">
                ₹ {nationalSummaryMetrics.revisedCostTotalLakhCr.toFixed(2)} <span className="unit">Lakh Cr</span>
              </div>
              <span className="paimana-macro-sub">Net Escalation: +15.2%</span>
            </div>
          </div>

          {/* Cumulative Expenditure */}
          <div className="paimana-macro-card">
            <div className="paimana-macro-icon green">
              <Building2 size={22}/>
            </div>
            <div className="paimana-macro-content">
              <span className="paimana-macro-label">Cumulative Expenditure</span>
              <div className="paimana-macro-value tnum">
                ₹ {nationalSummaryMetrics.cumulativeExpenditureLakhCr.toFixed(2)} <span className="unit">Lakh Cr</span>
              </div>
              <span className="paimana-macro-sub">47.6% of revised outlay</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Sector Breakdown vs State Overview */}
        <div className="paimana-summary-tabs-wrapper">
          <div className="paimana-summary-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={activeTab === 'sectors'} className={`paimana-sum-tab ${activeTab === 'sectors' ? 'active' : ''}`} onClick={() => setActiveTab('sectors')}>
              <Building2 size={16}/>
              Sector Breakdown ({sectorSummaryList.length})
            </button>
            <button type="button" role="tab" aria-selected={activeTab === 'states'} className={`paimana-sum-tab ${activeTab === 'states' ? 'active' : ''}`} onClick={() => setActiveTab('states')}>
              <MapPin size={16}/>
              State-Level Distribution ({stateRiskBreakdown.length})
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (<div className="paimana-loading-state">
            <RefreshCw size={24} className="spin-icon"/>
            <span>Updating sector indicators from MoSPI pipeline...</span>
          </div>)}

        {hasError && (<div className="paimana-error-state">
            <AlertCircle size={24} color="#e53935"/>
            <p>Unable to load live sector metrics. Please check connection.</p>
            <button type="button" className="paimana-btn-orange-pill" onClick={handleRetry}>
              <RefreshCw size={14}/> Retry
            </button>
          </div>)}

        {/* Tab Content: Sector Cards Grid */}
        {!isLoading && !hasError && activeTab === 'sectors' && (<div className="paimana-sectors-table-grid">
            {sectorSummaryList.map((sector) => (<div key={sector.sector} className="paimana-sector-summary-card" onClick={() => handleSectorClick(sector.sector)} role="button" tabIndex={0} title={`Filter projects for ${sector.sector}`}>
                <div className="paimana-sec-card-header">
                  <h3 className="paimana-sec-card-title">{sector.sector}</h3>
                  <ArrowUpRight size={16} className="paimana-sec-card-arrow"/>
                </div>

                <div className="paimana-sec-stats-row">
                  <div>
                    <span className="paimana-sec-stat-label">Projects</span>
                    <span className="paimana-sec-stat-val tnum">{sector.totalProjects}</span>
                  </div>
                  <div>
                    <span className="paimana-sec-stat-label">Capital Outlay</span>
                    <span className="paimana-sec-stat-val tnum">₹ {sector.budgetLakhCr} L Cr</span>
                  </div>
                  <div>
                    <span className="paimana-sec-stat-label">Delayed / Stagnant</span>
                    <span className="paimana-sec-stat-val text-warning tnum">{sector.criticalCount}</span>
                  </div>
                </div>
              </div>))}
          </div>)}

        {/* Tab Content: State Overview Grid */}
        {!isLoading && !hasError && activeTab === 'states' && (<div className="paimana-states-table-grid">
            {stateRiskBreakdown.map((st) => (<div key={st.state} className="paimana-state-summary-card" onClick={() => handleStateClick(st.state)} role="button" tabIndex={0} title={`View ${st.state} in GIS Map`}>
                <div className="paimana-st-header">
                  <div className="paimana-st-name">
                    <MapPin size={14} color="#0084c7"/>
                    <span>{st.state}</span>
                  </div>
                  <span className="paimana-st-badge tnum">{st.projects} Projects</span>
                </div>
                <div className="paimana-st-metric">
                  <span>Critical Risk Projects:</span>
                  <span className="paimana-st-crit tnum">{st.criticalCount}</span>
                </div>
              </div>))}
          </div>)}
      </div>
    </section>);
};
