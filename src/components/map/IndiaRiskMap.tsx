import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Project, RiskLevel } from '../../types/project';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, X, ArrowRight } from 'lucide-react';

interface IndiaRiskMapProps {
  height?: string;
  filteredProjects?: Project[];
  showFiltersBar?: boolean;
}

export const IndiaRiskMap: React.FC<IndiaRiskMapProps> = ({
  height = '520px',
  filteredProjects,
  showFiltersBar = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { projects, navigateToProject, selectedProjectId } = useApp();

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  const displayProjects = (filteredProjects || projects).filter((p) => {
    if (selectedRiskFilter !== 'all' && p.riskLevel !== selectedRiskFilter) return false;
    if (selectedSectorFilter !== 'all' && p.sector !== selectedSectorFilter) return false;
    return true;
  });

  const getMarkerColor = (level: RiskLevel | string) => {
    const l = (level || '').toLowerCase();
    if (l.includes('crit')) return '#EF4444';
    if (l.includes('high')) return '#F97316';
    if (l.includes('med') || l.includes('mod')) return '#F59E0B';
    return '#10B981';
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.3511148, 78.6677428],
        zoom: 4.8,
        minZoom: 4,
        maxZoom: 12,
        scrollWheelZoom: false,
        attributionControl: false
      });

      // OpenStreetMap standard tiles - reliable and key-free
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    displayProjects.forEach((project) => {
      if (!project.latitude || !project.longitude) return;

      const color = getMarkerColor(project.riskLevel);
      const isSelected = project.id === selectedProjectId || previewProject?.id === project.id;

      const markerHtml = `
        <div style="
          width: ${isSelected ? '28px' : '22px'};
          height: ${isSelected ? '28px' : '22px'};
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 12px ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 150ms ease;
        ">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'risk-map-marker',
        html: markerHtml,
        iconSize: [isSelected ? 28 : 22, isSelected ? 28 : 22],
        iconAnchor: [isSelected ? 14 : 11, isSelected ? 14 : 11]
      });

      const marker = L.marker([project.latitude, project.longitude], { icon: customIcon });

      marker.on('click', () => {
        setPreviewProject(project);
      });

      marker.bindTooltip(
        `<div style="font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; color: #FFFFFF; background: #111E31; padding: 4px 8px; border-radius: 6px; border: 1px solid #1E3A5F;">
          ${project.name} (${project.riskScore}/100)
        </div>`,
        { direction: 'top', offset: [0, -10], opacity: 0.95 }
      );

      markersGroup.addLayer(marker);
    });
  }, [displayProjects, selectedProjectId, previewProject]);

  return (
    <div
      className="gov-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Map Control Toolbar */}
      {showFiltersBar && (
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            background: 'var(--color-surface-nav)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={15} color="var(--color-action-primary)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              National Infrastructure Spatial Overlay
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-accent-cyan)',
                background: 'var(--color-action-subtle)',
                padding: '1px 7px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600
              }}
            >
              {displayProjects.length} Active Hotspots
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Risk Tier Filter */}
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="gov-select"
              style={{ fontSize: '11.5px', padding: '4px 8px', height: '28px' }}
            >
              <option value="all">All Risk Tiers</option>
              <option value="critical">Critical Risk</option>
              <option value="high">High Risk</option>
              <option value="medium">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>

            {/* Sector Filter */}
            <select
              value={selectedSectorFilter}
              onChange={(e) => setSelectedSectorFilter(e.target.value)}
              className="gov-select"
              style={{ fontSize: '11.5px', padding: '4px 8px', height: '28px' }}
            >
              <option value="all">All Sectors</option>
              <option value="Railways">Railways</option>
              <option value="Roads & Highways">Roads & Highways</option>
              <option value="Urban Infrastructure / Metro">Metro & Urban</option>
              <option value="Power & Renewable Energy">Power & Energy</option>
              <option value="Ports & Shipping">Ports & Shipping</option>
            </select>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ position: 'relative', width: '100%', height: height }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: 'rgba(11, 22, 40, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--color-text-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
            <span>Critical (&gt;80)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F97316' }} />
            <span>High (60-80)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
            <span>Moderate (35-60)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
            <span>Low (&lt;35)</span>
          </div>
        </div>

        {/* Project Preview Drawer (on marker click) */}
        {previewProject && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '320px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-elevated)',
              zIndex: 1001,
              padding: '16px',
              animation: 'slideInRight 180ms ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <StatusBadge level={previewProject.riskLevel} size="sm" />
              <button
                onClick={() => setPreviewProject(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px', lineHeight: 1.3 }}>
              {previewProject.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              {previewProject.ministry} · {previewProject.state}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <div style={{ padding: '8px', background: 'var(--color-surface-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Risk Index</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {previewProject.riskScore}/100
                </div>
              </div>
              <div style={{ padding: '8px', background: 'var(--color-surface-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Physical Progress</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {previewProject.physicalProgress}%
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateToProject(previewProject.id)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
            >
              Open Project Intelligence <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
