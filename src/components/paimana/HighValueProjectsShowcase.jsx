import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Train, Car, Zap, Flame, Ship, Building2, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
export const HighValueProjectsShowcase = () => {
    const { projects, navigateToProject, navigateTo } = useApp();
    const [startIndex, setStartIndex] = useState(0);
    const [activeModalProject, setActiveModalProject] = useState(null);
    // Filter for high value projects (cost >= 1000 Cr or highlighted)
    const highValueList = projects.filter((p) => p.originalCost >= 1000 || p.revisedCost >= 1000);
    const displayPool = highValueList.length >= 3 ? highValueList : projects;
    const visibleCardsCount = 3;
    const maxStartIndex = Math.max(0, displayPool.length - visibleCardsCount);
    const handlePrev = () => {
        setStartIndex((prev) => Math.max(0, prev - 1));
    };
    const handleNext = () => {
        setStartIndex((prev) => Math.min(maxStartIndex, prev + 1));
    };
    const getSectorIcon = (sector) => {
        const s = sector.toLowerCase();
        if (s.includes('rail'))
            return <Train size={32} className="paimana-sector-icon-svg"/>;
        if (s.includes('road') || s.includes('highway'))
            return <Car size={32} className="paimana-sector-icon-svg"/>;
        if (s.includes('power') || s.includes('energy') || s.includes('solar'))
            return <Zap size={32} className="paimana-sector-icon-svg"/>;
        if (s.includes('petroleum') || s.includes('gas') || s.includes('oil'))
            return <Flame size={32} className="paimana-sector-icon-svg"/>;
        if (s.includes('port') || s.includes('shipping') || s.includes('water'))
            return <Ship size={32} className="paimana-sector-icon-svg"/>;
        return <Building2 size={32} className="paimana-sector-icon-svg"/>;
    };
    const visibleProjects = displayPool.slice(startIndex, startIndex + visibleCardsCount);
    return (<section className="paimana-showcase-section" aria-labelledby="showcase-heading">
      <div className="paimana-section-container">
        {/* Section Header */}
        <div className="paimana-section-header-center">
          <span className="paimana-section-kicker">Mega Infrastructure Portfolio</span>
          <h2 id="showcase-heading" className="paimana-section-title">
            High Value Projects
          </h2>
          <p className="paimana-section-subtitle">
            Continuous milestone monitoring and delay mitigation across Central Sector projects costing ₹ 1,000 Crore & above.
          </p>
        </div>

        {/* Carousel / Cards Wrapper */}
        <div className="paimana-showcase-carousel-wrapper">
          {/* Previous Button */}
          <button type="button" className="paimana-showcase-nav-btn prev" onClick={handlePrev} disabled={startIndex === 0} aria-label="Previous Projects" title="Previous Projects">
            <ChevronLeft size={22}/>
          </button>

          {/* Cards Grid */}
          <div className="paimana-showcase-grid">
            {visibleProjects.map((project) => {
            const isDelayed = (project.expectedDelayMonths || 0) > 0 || project.status.toLowerCase().includes('delay') || project.status.toLowerCase().includes('critical');
            return (<div key={project.id} className="paimana-project-card" tabIndex={0} role="region" aria-label={`Project: ${project.name}`}>
                  {/* Card Top: Sector Icon, Sector Name, Agency */}
                  <div className="paimana-card-top">
                    <div className="paimana-card-sector-icon" aria-hidden="true">
                      {getSectorIcon(project.sector)}
                    </div>
                    <div className="paimana-card-sector-name">
                      {project.sector}
                    </div>
                    <div className="paimana-card-agency">
                      {project.implementingAgency}
                    </div>
                  </div>

                  {/* Card Title & Location */}
                  <div className="paimana-card-title-area">
                    <h3 className="paimana-card-project-title" title={project.name} onClick={() => navigateToProject(project.id)}>
                      {project.name}
                    </h3>
                    <div className="paimana-card-meta">
                      <span>{project.state}</span>
                      <span className="dot">·</span>
                      <span>Code: {project.code || project.id}</span>
                    </div>
                  </div>

                  {/* Thin Horizontal Separator */}
                  <div className="paimana-card-divider" aria-hidden="true"/>

                  {/* 2-Column, 2-Row Metric Grid */}
                  <div className="paimana-card-metric-grid">
                    {/* Top Left: Original Cost */}
                    <div className="paimana-metric-cell border-right border-bottom">
                      <span className="paimana-metric-label">Original Cost</span>
                      <span className="paimana-metric-val tnum">
                        ₹ {project.originalCost.toLocaleString('en-IN')} <span className="unit">Cr</span>
                      </span>
                    </div>

                    {/* Top Right: Physical Progress */}
                    <div className="paimana-metric-cell border-bottom">
                      <span className="paimana-metric-label">Physical Progress</span>
                      <span className="paimana-metric-val highlight tnum">
                        {project.physicalProgress.toFixed(1)}%
                      </span>
                    </div>

                    {/* Bottom Left: Latest Revised Cost */}
                    <div className="paimana-metric-cell border-right">
                      <span className="paimana-metric-label">Latest Revised Cost</span>
                      <span className="paimana-metric-val tnum">
                        ₹ {project.revisedCost.toLocaleString('en-IN')} <span className="unit">Cr</span>
                      </span>
                    </div>

                    {/* Bottom Right: Revised Completion Date */}
                    <div className="paimana-metric-cell">
                      <span className="paimana-metric-label">Revised Completion</span>
                      <span className="paimana-metric-val tnum">
                        {project.revisedCompletionDate || 'Under Review'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Status & Action */}
                  <div className="paimana-card-footer">
                    <div className="paimana-card-status-tag">
                      {isDelayed ? (<span className="tag-warning">
                          <AlertTriangle size={13}/> {project.expectedDelayMonths ? `+${project.expectedDelayMonths} Mo Delay` : project.status}
                        </span>) : (<span className="tag-success">
                          <CheckCircle2 size={13}/> {project.status || 'On Track'}
                        </span>)}
                    </div>

                    <button type="button" className="paimana-card-btn-view" onClick={() => navigateToProject(project.id)} title="Open full project dossier" aria-label={`View dossier for ${project.name}`}>
                      <span>View Dossier</span>
                      <ExternalLink size={13}/>
                    </button>
                  </div>
                </div>);
        })}
          </div>

          {/* Next Button */}
          <button type="button" className="paimana-showcase-nav-btn next" onClick={handleNext} disabled={startIndex >= maxStartIndex} aria-label="Next Projects" title="Next Projects">
            <ChevronRight size={22}/>
          </button>
        </div>

        {/* Bottom Registry Action */}
        <div className="paimana-showcase-bottom-action">
          <button type="button" className="paimana-btn-navy-pill" onClick={() => navigateTo('projects')}>
            View All {projects.length} Central Sector Projects
          </button>
        </div>
      </div>

      {/* Title Details / Expand Modal */}
      {activeModalProject && (<div className="paimana-modal-backdrop" onClick={() => setActiveModalProject(null)} role="dialog" aria-modal="true">
          <div className="paimana-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="paimana-modal-header">
              <h3 className="paimana-modal-title">Project Summary</h3>
              <button type="button" className="paimana-modal-close" onClick={() => setActiveModalProject(null)}>
                &times;
              </button>
            </div>
            <div className="paimana-modal-body">
              <div className="paimana-modal-sector">{activeModalProject.sector} · {activeModalProject.implementingAgency}</div>
              <h4 className="paimana-modal-name">{activeModalProject.name}</h4>
              <p className="paimana-modal-desc">
                {activeModalProject.mainRiskReason || 'Central Sector infrastructure project monitored under IPMD, Ministry of Statistics and Programme Implementation.'}
              </p>
            </div>
            <div className="paimana-modal-footer">
              <button type="button" className="paimana-btn-orange-pill" onClick={() => {
                navigateToProject(activeModalProject.id);
                setActiveModalProject(null);
            }}>
                Open Full Dossier
              </button>
            </div>
          </div>
        </div>)}
    </section>);
};
