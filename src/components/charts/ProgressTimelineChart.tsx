import React, { useState } from 'react';
import type { MonthlyProgressPoint } from '../../types/project';
import { TrendingDown, TrendingUp, Calendar, CircleAlert, Sparkles } from 'lucide-react';

interface ProgressTimelineChartProps {
  history: MonthlyProgressPoint[];
  originalDate: string;
  revisedDate: string;
  aiPredictedDate: string;
}

const NOT_AVAILABLE = 'Not available';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const METRICS = [
  { id: 'progress', label: 'Physical progress' },
  { id: 'expenditure', label: 'Expenditure' },
  { id: 'risk', label: 'Risk score' }
] as const;

type MetricId = (typeof METRICS)[number]['id'];

/** Draws one value series on the shared 0-100 scale. */
const seriesFor = (history: MonthlyProgressPoint[], metric: MetricId) =>
  history.map((h) => {
    if (metric === 'expenditure') return h.expenditure;
    if (metric === 'risk') return h.riskScore;
    return h.actualProgress;
  });

export const ProgressTimelineChart: React.FC<ProgressTimelineChartProps> = ({
  history,
  originalDate,
  revisedDate,
  aiPredictedDate
}) => {
  const [activeMetric, setActiveMetric] = useState<MetricId>('progress');

  if (!history || history.length === 0) return null;

  const maxExpenditure = Math.max(...history.map((h) => (isNum(h.expenditure) ? h.expenditure : 0)), 1);
  const scaleMax = activeMetric === 'expenditure' ? maxExpenditure : 100;

  // Chart geometry - the SVG is a fixed viewBox that scales to its container.
  const W = 620;
  const H = 220;
  const padL = 46;
  const padR = 12;
  const padT = 14;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const baseY = padT + plotH;

  const xAt = (i: number) => padL + (i / Math.max(history.length - 1, 1)) * plotW;
  const yAt = (v: number) => baseY - (Math.max(0, Math.min(scaleMax, v)) / scaleMax) * plotH;
  const toPoints = (values: number[]) => values.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(' ');

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * scaleMax);
  const tickLabel = (v: number) =>
    activeMetric === 'expenditure' ? `\u20B9${Math.round(v).toLocaleString('en-IN')}` : `${Math.round(v)}%`;

  // Live progress gap, derived from the recorded returns (never a hard-coded figure).
  const last = history[history.length - 1];
  const gap = isNum(last.actualProgress) && isNum(last.expectedProgress) ? last.expectedProgress - last.actualProgress : null;

  const actualValues = seriesFor(history, activeMetric);
  const stroke = activeMetric === 'risk' ? '#B42318' : '#0284C7';

  return (
    <div className="ptc">
      <div className="ptc-head">
        <div className="ptc-seg" role="group" aria-label="Chart metric">
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`ui-btn ${activeMetric === m.id ? 'ui-btn-primary' : 'ui-btn-secondary'}`}
              aria-pressed={activeMetric === m.id}
              onClick={() => setActiveMetric(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {gap !== null && (
          <span className="ptc-gap" data-tone={gap > 0 ? 'alert' : 'ok'}>
            {gap > 0 ? <TrendingDown size={14} aria-hidden="true" /> : <TrendingUp size={14} aria-hidden="true" />}
            {gap > 0
              ? `${gap.toFixed(1)} pts behind the scheduled milestone`
              : gap < 0
                ? `${Math.abs(gap).toFixed(1)} pts ahead of schedule`
                : 'On the scheduled milestone'}
          </span>
        )}
      </div>

      <div className="ptc-plot">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${activeMetric === 'risk' ? 'Risk score' : activeMetric === 'expenditure' ? 'Expenditure' : 'Physical progress'} trend from ${history[0]?.month ?? ''} to ${last?.month ?? ''}`}
        >
          {ticks.map((v, i) => (
            <g key={i}>
              <line
                x1={padL}
                y1={yAt(v)}
                x2={W - padR}
                y2={yAt(v)}
                stroke="var(--ui-divider)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={padL - 8}
                y={yAt(v) + 4}
                textAnchor="end"
                fontSize={10.5}
                fill="var(--ui-text-2)"
                fontFamily="var(--font-sans)"
              >
                {tickLabel(v)}
              </text>
            </g>
          ))}

          <line
            x1={padL}
            y1={baseY}
            x2={W - padR}
            y2={baseY}
            stroke="var(--ui-border)"
            strokeWidth={1}
          />

          {/* Expected milestone baseline - only meaningful for the progress view */}
          {activeMetric === 'progress' && (
            <polyline
              fill="none"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="5 4"
              points={toPoints(history.map((h) => (isNum(h.expectedProgress) ? h.expectedProgress : 0)))}
            />
          )}

          <polyline fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" points={toPoints(actualValues)} />

          {actualValues.map((v, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(v)} r={3.5} fill={stroke} stroke="#FFFFFF" strokeWidth={1.5} />
          ))}

          {history.map((h, i) => (
            <text
              key={`${h.month}-${i}`}
              x={xAt(i)}
              y={H - 12}
              textAnchor="middle"
              fontSize={10.5}
              fill="var(--ui-text-2)"
              fontFamily="var(--font-sans)"
            >
              {h.month}
            </text>
          ))}
        </svg>

        <div className="ptc-legend">
          <span style={{ color: stroke }}>
            <i />
            {activeMetric === 'risk' ? 'Recorded risk score' : activeMetric === 'expenditure' ? 'Cumulative expenditure' : 'Recorded physical progress'}
          </span>
          {activeMetric === 'progress' && (
            <span style={{ color: '#94A3B8' }}>
              <i className="dashed" />
              Scheduled milestone
            </span>
          )}
        </div>
      </div>

      <dl className="ptc-milestones">
        <div>
          <dt>Original sanctioned target</dt>
          <dd>
            <Calendar size={14} aria-hidden="true" style={{ color: 'var(--ui-text-2)' }} />
            {originalDate || NOT_AVAILABLE}
          </dd>
        </div>
        <div>
          <dt>Official revised target</dt>
          <dd style={{ color: '#B42318' }}>
            <CircleAlert size={14} aria-hidden="true" />
            {revisedDate || NOT_AVAILABLE}
          </dd>
        </div>
        <div>
          <dt>Model predicted completion</dt>
          <dd style={{ color: 'var(--ui-accent-hover)' }}>
            <Sparkles size={14} aria-hidden="true" />
            {aiPredictedDate || NOT_AVAILABLE}
          </dd>
        </div>
      </dl>
    </div>
  );
};
