import React from 'react';
import { ArrowUpRight, ArrowDownRight, Cpu } from 'lucide-react';
export const SHAPExplanationChart = ({ contributors, projectRiskScore, modelVersion = 'LightGBM / TreeSHAP v2.4' }) => {
    const rows = contributors || [];
    return (<div className="shx">
      <div className="shx-head">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Cpu size={14} aria-hidden="true" style={{ color: 'var(--ui-accent)' }}/>
          Attribution model: <strong>{modelVersion}</strong>
        </span>
        <span>
          Additive feature importance (TreeSHAP)
          {typeof projectRiskScore === 'number' ? ` ? project risk score ${projectRiskScore}/100` : ''}
        </span>
      </div>

      {rows.length === 0 && (<p className="pd-empty">No model attribution has been published for this project yet.</p>)}

      {rows.map((c, idx) => {
            const isWorsening = c.direction === 'increase' || c.direction === 'increases_risk';
            const impactVal = Math.abs(c.contribution ?? c.impact ?? 0);
            const maxImpact = Math.max(...rows.map((r) => Math.abs(r.contribution ?? r.impact ?? 0)), 1);
            const barWidth = Math.max(2, Math.round((impactVal / maxImpact) * 100));
            const factor = c.factor || c.feature;
            return (<div className="shx-item" key={idx} data-tone={isWorsening ? 'up' : 'down'}>
            <div className="shx-item-top">
              <div className="shx-factor">
                {isWorsening ? (<ArrowUpRight size={15} aria-hidden="true" style={{ color: '#B42318' }}/>) : (<ArrowDownRight size={15} aria-hidden="true" style={{ color: '#067647' }}/>)}
                <span>{factor || 'Unlabelled risk driver'}</span>
              </div>
              <span className={`shx-delta ${isWorsening ? 'up' : 'down'}`}>
                {isWorsening ? '+' : '-'}
                {impactVal} pts
              </span>
            </div>

            <div className="shx-bar" aria-hidden="true">
              <i style={{ width: `${barWidth}%` }}/>
            </div>

            <div className="shx-item-top" style={{ marginTop: 2 }}>
              <p className="shx-why">{c.explanation || c.description || 'No narrative available for this driver.'}</p>
              {c.category && <span className="shx-cat">{c.category}</span>}
            </div>
          </div>);
        })}
    </div>);
};
