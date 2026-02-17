import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import html2canvas from 'html2canvas';
import { MapItem, ViewMode } from '../types';

interface MapCanvasProps {
  items: MapItem[];
  viewMode: ViewMode;
  onExport: (dataUrl: string) => void;
}

// Visitor System Types
interface Visitor {
  id: string;
  marker: L.Marker;
  targetId: string;
  currentLat: number;
  currentLng: number;
  targetLat: number;
  targetLng: number;
  speed: number;
  state: 'walking' | 'arrived';
  wobbleOffset: number; // Randomize path slightly
}

const VISITOR_COUNT_PER_ITEM = 8;
const SPAWN_RADIUS = 0.008; // Approx 800m
const ARRIVAL_RADIUS = 0.0005; // Approx 50m

// Helper to format currency for popup
const formatMoney = (amount: number) => {
  if (amount >= 100000000) return (amount / 100000000).toFixed(1) + '億円';
  if (amount >= 10000) return (amount / 10000).toFixed(0) + '万円';
  return amount.toLocaleString() + '円';
};

const MapCanvas: React.FC<MapCanvasProps> = ({ items, viewMode, onExport }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.TileLayer | null>(null);
  const itemMarkersRef = useRef<L.Marker[]>([]);
  
  // Visitor System Refs
  const visitorsRef = useRef<Visitor[]>([]);
  const animationFrameRef = useRef<number>(0);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [35.7208, 140.6453], // Center of Asahi City
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    const layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);
    
    layerRef.current = layer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle View Mode Changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerRef.current) return;
    
    const map = mapInstanceRef.current;
    map.removeLayer(layerRef.current);

    let url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'; 
    if (viewMode === 'blueprint') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
    }

    layerRef.current = L.tileLayer(url, { maxZoom: 19 }).addTo(map);
  }, [viewMode]);

  // Update Item Markers (Buildings/Landmarks)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing item markers
    itemMarkersRef.current.forEach(marker => marker.remove());
    itemMarkersRef.current = [];

    items.forEach(item => {
      const emojiIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="flex flex-col items-center">
            <div class="emoji-marker" style="font-size: ${24 * (item.size || 1)}px;">${item.emoji}</div>
            <div class="marker-label">${item.name}</div>
          </div>
        `,
        iconSize: [100, 60],
        iconAnchor: [50, 30]
      });

      const popStr = item.population ? `(+${item.population.toLocaleString()}人)` : '';
      const taxStr = item.taxRevenue ? `(+${formatMoney(item.taxRevenue)})` : '';

      const marker = L.marker([item.lat, item.lng], { icon: emojiIcon })
        .addTo(map)
        .bindPopup(`
          <div class="text-center min-w-[150px]">
            <div class="font-bold text-lg mb-1">${item.emoji} ${item.name}</div>
            <div class="text-sm text-gray-600 mb-2">${item.description || ''}</div>
            
            <div class="flex flex-col gap-1 items-center">
                ${item.population ? `<div class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-full">人口: +${item.population.toLocaleString()}人</div>` : ''}
                ${item.taxRevenue ? `<div class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-full">税収: +${formatMoney(item.taxRevenue)}</div>` : ''}
            </div>
          </div>
        `);

      itemMarkersRef.current.push(marker);
    });
  }, [items]);

  // Visitor System Logic
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Clean up visitors for items that no longer exist
    const activeItemIds = new Set(items.map(i => i.id));
    
    // Remove markers from map
    visitorsRef.current.forEach(v => {
      if (!activeItemIds.has(v.targetId)) {
        v.marker.remove();
      }
    });
    // Filter list
    visitorsRef.current = visitorsRef.current.filter(v => activeItemIds.has(v.targetId));

    // 2. Spawn new visitors for items
    items.forEach(item => {
      // Only spawn for interesting places
      if (item.type === 'nature' && item.name.includes('洋')) return; // Skip ocean

      const existingCount = visitorsRef.current.filter(v => v.targetId === item.id).length;
      const needed = VISITOR_COUNT_PER_ITEM - existingCount;

      if (needed > 0) {
        for (let i = 0; i < needed; i++) {
          // Random spawn position around target
          const angle = Math.random() * Math.PI * 2;
          const distance = SPAWN_RADIUS * (0.5 + Math.random() * 0.5);
          const startLat = item.lat + Math.sin(angle) * distance;
          const startLng = item.lng + Math.cos(angle) * distance;

          const peopleEmojis = ['🏃', '🚶', '🧍', '🧒', '👧'];
          const randomEmoji = peopleEmojis[Math.floor(Math.random() * peopleEmojis.length)];

          const icon = L.divIcon({
            className: 'visitor-icon',
            html: `<div class="visitor-inner walking" style="color: ${getRandomColor()}">${randomEmoji}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          const marker = L.marker([startLat, startLng], { 
            icon, 
            zIndexOffset: -100 // Keep behind main labels
          }).addTo(map);

          visitorsRef.current.push({
            id: Math.random().toString(36).substr(2, 9),
            marker,
            targetId: item.id,
            currentLat: startLat,
            currentLng: startLng,
            targetLat: item.lat,
            targetLng: item.lng,
            speed: 0.00003 + Math.random() * 0.00002, // Random speed
            state: 'walking',
            wobbleOffset: Math.random() * 100
          });
        }
      }
    });

  }, [items]);

  // Animation Loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      
      visitorsRef.current.forEach(v => {
        if (v.state === 'walking') {
          // Calculate vector to target
          const dLat = v.targetLat - v.currentLat;
          const dLng = v.targetLng - v.currentLng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);

          if (dist < ARRIVAL_RADIUS) {
            v.state = 'arrived';
            // Stop animation CSS
            const el = v.marker.getElement()?.querySelector('.visitor-inner');
            if (el) el.classList.remove('walking');
          } else {
            // Move
            v.currentLat += (dLat / dist) * v.speed;
            v.currentLng += (dLng / dist) * v.speed;
            
            // Add slight wobble
            const wobble = Math.sin(now / 200 + v.wobbleOffset) * 0.00005;
            
            v.marker.setLatLng([v.currentLat + wobble, v.currentLng]);
          }
        } else {
           // Arrived: maybe wander slightly around the target?
           // For now, just stay put or jump occasionally
           if (Math.random() < 0.01) {
              // Occasional jump
              const el = v.marker.getElement()?.querySelector('.visitor-inner');
              if (el) {
                  el.classList.add('walking');
                  setTimeout(() => el.classList.remove('walking'), 1000);
              }
           }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []); // Run once on mount, loop continues

  const getRandomColor = () => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const triggerExport = async () => {
    if (mapContainerRef.current) {
        try {
            const canvas = await html2canvas(mapContainerRef.current, {
                useCORS: true,
                allowTaint: true,
                logging: false,
                scale: 2 
            });
            const data = canvas.toDataURL('image/png');
            onExport(data);
        } catch (e) {
            console.error("Export failed", e);
            alert("Could not save map image. Ensure network allows tile access.");
        }
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Controls Overlay */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[500]">
        <button 
            onClick={handleZoomIn}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-gray-700 font-bold w-10 h-10 flex items-center justify-center transition-transform hover:scale-105"
        >
          +
        </button>
        <button 
            onClick={handleZoomOut}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-gray-700 font-bold w-10 h-10 flex items-center justify-center transition-transform hover:scale-105"
        >
          -
        </button>
        <button 
            onClick={triggerExport}
            className="bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 text-white mt-2 w-10 h-10 flex items-center justify-center transition-transform hover:scale-105"
            title="地図を保存"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
      </div>

      <div className="absolute bottom-1 left-1 text-[10px] text-gray-400 z-[400] px-1 bg-white/50 rounded">
        &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded shadow text-xs text-gray-600 pointer-events-none z-[500] border border-gray-200">
        地図: 千葉県旭市 (現在) <br/> ドラッグで移動 • スクロールで拡大縮小
      </div>
    </div>
  );
};

export default MapCanvas;