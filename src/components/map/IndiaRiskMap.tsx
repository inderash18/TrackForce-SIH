import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Project, RiskLevel } from '../../types/project';
import { useApp } from '../../context/AppContext';
import { Layers } from 'lucide-react';

interface IndiaRiskMapProps {
  height?: string;
  filteredProjects?: Project[];
  showFiltersBar?: boolean;
}

export const IndiaRiskMap: React.FC<IndiaRiskMapProps> = ({
  height = '480px',
  filteredProjects,
  showFiltersBar = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { projects, navigateToProject, selectedProjectId } = useApp();

  // Local filter controls for the map view
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('all');

  const displayProjects = (filteredProjects || projects).filter(p => {
    if (selectedRiskFilter !== 'all' && p.riskLevel !== selectedRiskFilter) return false;
    if (selectedSectorFilter !== 'all' && p.sector !== selectedSectorFilter) return false;
    return true;
  });

  const getMarkerColor = (level: RiskLevel) => {
    switch (level) {
      case 'critical':
        return '#D92D20';
      case 'high':
        return '#F04438';
      case 'medium':
        return '#F79009';
      case 'low':
        return '#12B76A';
      default:
        return '#1E5EFF';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered on India
      const map = L.map(mapContainerRef.current, {
        center: [22.3511148, 78.6677428],
        zoom: 4.8,
        minZoom: 4,
        maxZoom: 12,
        scrollWheelZoom: false,
        attributionControl: false
      });

      // CartoDB Positron / OSM clean enterprise tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix: 'PAIMANA GIS Sentinel • OpenStreetMap'
        })
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on full unmount if needed
    };
  }, []);

  // Update markers whenever displayProjects changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    displayProjects.forEach(project => {
      const color = getMarkerColor(project.riskLevel);
      const isCritical = project.riskLevel === 'critical';
      const isSelected = project.id === selectedProjectId;

      // Custom HTML Marker icon
      const customIcon = L.divIcon({
        className: 'custom-risk-pin',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '24px' : '18px'};
            height: ${isSelected ? '24px' : '18px'};
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${
              isCritical
                ? `<div style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: ${color};
                    opacity: 0.4;
                    animation: pulseRing 1.8s infinite;
                  "></div>`
                : ''
            }
            <div style="
              width: ${isSelected ? '16px' : '12px'};
              height: ${isSelected ? '16px' : '12px'};
              border-radius: 50%;
              background-color: ${color};
              border: 2.5px solid #FFFFFF;
              box-shadow: 0 2px 5px rgba(0,0,0,0.35);
              transition: transform 120ms ease;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([project.lat, project.lng], { icon: customIcon });

      // Build popup content
      const popupHtml = `
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #182230; min-width: 230px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; color: #667085; text-transform: uppercase;">${project.code}</span>
            <span style="
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              padding: 2px 6px;
              border-radius: 4px;
              background-color: ${
                project.riskLevel === 'critical'
                  ? '#FEF3F2'
                  : project.riskLevel === 'high'
                  ? '#FFF4ED'
                  : project.riskLevel === 'medium'
                  ? '#FFFAEB'
                  : '#ECFDF3'
              };
              color: ${
                project.riskLevel === 'critical'
                  ? '#B42318'
                  : project.riskLevel === 'high'
                  ? '#C4320A'
                  : project.riskLevel === 'medium'
                  ? '#B54708'
                  : '#027A48'
              };
            ">${project.riskLevel} Risk</span>
          </div>

          <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0F2747; line-height: 1.3;">
            ${project.name}
          </h4>

          <div style="font-size: 11px; color: #667085; margin-bottom: 8px;">
            <strong>${project.sector}</strong> • ${project.state}
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; margin-bottom: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <div>
              <span style="font-size: 10px; color: #64748B;">Risk Score:</span>
              <div style="font-size: 13px; font-weight: 700; color: ${color};">${project.riskScore} / 100</div>
            </div>
            <div>
              <span style="font-size: 10px; color: #64748B;">Physical Progress:</span>
              <div style="font-size: 13px; font-weight: 700; color: #1E293B;">${project.physicalProgress}%</div>
            </div>
            <div>
              <span style="font-size: 10px; color: #64748B;">Cost Risk:</span>
              <div style="font-size: 11.5px; font-weight: 600; color: #334155;">${project.costOverrunProbability}%</div>
            </div>
            <div>
              <span style="font-size: 10px; color: #64748B;">Delay Prob:</span>
              <div style="font-size: 11.5px; font-weight: 600; color: #334155;">${project.scheduleDelayProbability}%</div>
            </div>
          </div>

          <button
            id="btn-view-project-${project.id}"
            style="
              width: 100%;
              background-color: #1E5EFF;
              color: #ffffff;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 11.5px;
              font-weight: 600;
              cursor: pointer;
              text-align: center;
            "
          >
            View Project Intelligence →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-project-${project.id}`);
        if (btn) {
          btn.onclick = () => {
            navigateToProject(project.id);
          };
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [displayProjects, selectedProjectId, navigateToProject]);

  return (
    <div className="gov-card" style={{ overflow: 'hidden' }}>
      {/* Map Card Header / Filters */}
      {showFiltersBar && (
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid var(--color-border-grey)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            background: 'var(--color-white)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--color-royal-blue)" />
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-dark)' }}>
              National Geospatial Risk Intelligence
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              ({displayProjects.length} Central Sector Sites Plotted)
            </span>
          </div>

          {/* Quick Map Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              className="gov-select"
              value={selectedRiskFilter}
              onChange={e => setSelectedRiskFilter(e.target.value)}
              style={{ fontSize: '11.5px', padding: '4px 8px' }}
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical Risk Only</option>
              <option value="high">High Risk Only</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk / Safe</option>
            </select>

            <select
              className="gov-select"
              value={selectedSectorFilter}
              onChange={e => setSelectedSectorFilter(e.target.value)}
              style={{ fontSize: '11.5px', padding: '4px 8px' }}
            >
              <option value="all">All Sectors</option>
              <option value="Railways">Railways</option>
              <option value="Roads & Highways">Roads & Highways</option>
              <option value="Power & Renewable Energy">Power & Energy</option>
              <option value="Urban Development">Urban Metro</option>
              <option value="Petroleum & Natural Gas">Petroleum</option>
              <option value="Ports & Shipping">Ports</option>
            </select>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{ position: 'relative', width: '100%', height: height }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Floating Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-grey)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '11.5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Risk Status Legend
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--status-critical-dot)' }} />
              <span style={{ fontWeight: 500 }}>Critical</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--status-high-dot)' }} />
              <span style={{ fontWeight: 500 }}>High</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--status-medium-dot)' }} />
              <span style={{ fontWeight: 500 }}>Medium</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: 'var(--status-low-dot)' }} />
              <span style={{ fontWeight: 500 }}>Low</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.8; }
          70% { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
