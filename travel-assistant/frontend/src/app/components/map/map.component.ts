import { Component, Input, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var L: any; // Leaflet.js loaded via CDN

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="map-container">
    <div id="travel-map-{{mapId}}" class="map-div"></div>
    <div class="map-legend">
      <span>🗺 OpenStreetMap — Open Source, No API Key</span>
    </div>
  </div>
  `,
  styles: [`
    .map-container { border-radius: 16px; overflow: hidden; border: 2px solid #e8ecf4; }
    .map-div { height: 380px; width: 100%; }
    .map-legend { background: #f8f9ff; padding: 8px 16px; font-size: 12px; color: #6c7293; }
  `]
})
export class LeafletMapComponent implements AfterViewInit, OnChanges {
  @Input() lat = 20.5937;
  @Input() lon = 78.9629;
  @Input() name = 'India';
  @Input() pois: any[] = [];
  @Input() routePath: [number, number][] = [];
  mapId = Math.random().toString(36).substring(2, 8);
  private map: any = null;
  private mainMarker: any = null;
  private poiLayer: any = null;
  private routeLayer: any = null;

  ngAfterViewInit() { this.initMap(); }
  ngOnChanges() { if (this.map) this.updateMap(); }

  initMap() {
    // Load Leaflet from CDN if not already loaded
    if (typeof L === 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => this.createMap();
      document.head.appendChild(script);
    } else {
      this.createMap();
    }
  }

  createMap() {
    setTimeout(() => {
      const el = document.getElementById(`travel-map-${this.mapId}`);
      if (!el || this.map) return;
      this.map = L.map(`travel-map-${this.mapId}`).setView([this.lat, this.lon], 12);

      // OpenStreetMap tiles — completely free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
      }).addTo(this.map);

      // Main destination marker
      const mainIcon = L.divIcon({
        html: `<div style="background:#e94560;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 4px 12px rgba(233,69,96,0.4);">📍</div>`,
        iconSize: [36, 36], iconAnchor: [18, 18], className: ''
      });
      this.mainMarker = L.marker([this.lat, this.lon], { icon: mainIcon })
        .addTo(this.map)
        .bindPopup(`<strong>${this.name}</strong><br>📍 ${this.lat.toFixed(4)}, ${this.lon.toFixed(4)}`)
        .openPopup();

      this.poiLayer = L.layerGroup().addTo(this.map);
      this.routeLayer = L.layerGroup().addTo(this.map);
      this.addRoute();
      this.addPois();
    }, 200);
  }

  updateMap() {
    if (!this.map) return;
    this.map.setView([this.lat, this.lon], 12);
    if (this.mainMarker) {
      this.mainMarker.setLatLng([this.lat, this.lon]);
      this.mainMarker.setPopupContent(`<strong>${this.name}</strong><br>📍 ${this.lat.toFixed(4)}, ${this.lon.toFixed(4)}`);
    }
    if (!this.poiLayer) {
      this.poiLayer = L.layerGroup().addTo(this.map);
    }
    if (!this.routeLayer) {
      this.routeLayer = L.layerGroup().addTo(this.map);
    }
    this.addRoute();
    this.addPois();
  }

  addPois() {
    if (!this.map || !this.pois) return;
    if (this.poiLayer) {
      this.poiLayer.clearLayers();
    } else {
      this.poiLayer = L.layerGroup().addTo(this.map);
    }
    const icons: any = {HOTEL:'🏨',RESTAURANT:'🍽',ATTRACTION:'🏛',HOSPITAL:'🏥',ATM:'🏧'};
    this.pois.forEach(poi => {
      if (!poi.lat || !poi.lon) return;
      const icon = L.divIcon({
        html: `<div style="background:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">${icons[poi.type]||'📍'}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14], className: ''
      });
      L.marker([poi.lat, poi.lon], { icon })
        .addTo(this.poiLayer)
        .bindPopup(`<strong>${poi.name}</strong><br>${poi.type}${poi.openingHours ? '<br>⏰ ' + poi.openingHours : ''}`);
    });
  }

  addRoute() {
    if (!this.map) return;
    if (!this.routeLayer) {
      this.routeLayer = L.layerGroup().addTo(this.map);
    }
    this.routeLayer.clearLayers();
    if (!this.routePath || this.routePath.length < 2) return;
    const routeLine = L.polyline(this.routePath, { color: '#2563eb', weight: 4, opacity: 0.75 });
    routeLine.addTo(this.routeLayer);
    const start = this.routePath[0];
    const end = this.routePath[this.routePath.length - 1];
    const markerIcon = (symbol: string) => L.divIcon({
      html: `<div style="background:#2563eb;color:white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">${symbol}</div>`,
      iconSize: [30, 30], iconAnchor: [15, 15], className: ''
    });
    L.marker(start, { icon: markerIcon('S') }).addTo(this.routeLayer).bindPopup('Start');
    L.marker(end, { icon: markerIcon('E') }).addTo(this.routeLayer).bindPopup('End');
  }
}
