import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletMapComponent } from '../map/map.component';
import { WeatherWidgetComponent } from '../weather/weather-widget.component';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletMapComponent, WeatherWidgetComponent],
  template: `
  <section class="page-shell">
    <div class="page-header">
      <h1>Actions</h1>
      <p>Run intelligent actions that help you organize, analyze, and boost productivity instantly.</p>
    </div>

    <div class="actions-grid">
      <div class="action-card" *ngFor="let action of actions">
        <h2>{{ action.title }}</h2>
        <p>{{ action.description }}</p>
        <div class="action-controls">
          <button class="btn btn-primary" (click)="execute(action)">{{ action.status === 'Completed' ? 'Done' : action.status === 'Running' ? 'Running...' : 'Execute' }}</button>
          <span class="status">{{ action.status }}</span>
        </div>
      </div>
    </div>

    <div class="action-bottom-grid">
      <div class="info-card map-card">
        <div class="card-header">
          <div>
            <h2>Interactive map preview</h2>
            <p>Choose a live route and watch the map update instantly.</p>
          </div>
          <select [(ngModel)]="selectedRouteKey" (ngModelChange)="updateRoute()">
            <option *ngFor="let route of routes" [value]="route.key">{{ route.label }}</option>
          </select>
        </div>
        <app-leaflet-map [lat]="mapCenter[0]" [lon]="mapCenter[1]" [name]="mapName" [pois]="pois"></app-leaflet-map>
        <div class="route-summary">
          <div><strong>Distance</strong> {{selectedRoute?.distance}}</div>
          <div><strong>Estimated time</strong> {{selectedRoute?.duration}}</div>
          <div><strong>Route note</strong> {{selectedRoute?.tip}}</div>
        </div>
      </div>

      <div class="info-card climate-card">
        <div class="card-header">
          <div>
            <h2>Climate outlook</h2>
            <p>Live local weather and travel recommendations from the project data sources.</p>
          </div>
          <select [(ngModel)]="climateCity" (ngModelChange)="updateClimateCity($event)">
            <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
          </select>
        </div>
        <app-weather-widget [city]="climateCity"></app-weather-widget>
        <div class="climate-details">
          <div><strong>Local advisory</strong> {{climateSummary.advisory}}</div>
          <div><strong>Wardrobe</strong> {{climateSummary.wardrobe}}</div>
          <div><strong>Packing tip</strong> {{climateSummary.pack}}</div>
        </div>
      </div>

      <div class="checklist-panel">
        <h2>Travel checklist</h2>
        <p>Tap each item to mark it ready while planning.</p>
        <div class="checklist-stats">{{ checkedCount }} of {{ checklist.length }} ready</div>
        <ul id="checklist">
          <li *ngFor="let item of checklist" [class.checked]="item.checked" (click)="toggleChecklist(item)">
            <span class="checkbox">{{ item.checked ? '✔' : '' }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .page-shell { padding: 80px 80px; color: #101010; }
    .page-header h1 { font-size: 3rem; margin-bottom: 14px; font-family: var(--font-display); }
    .page-header p { max-width: 720px; color: #505050; }
    .actions-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-bottom: 32px; }
    .action-card { padding: 28px; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); display: flex; flex-direction: column; gap: 20px; }
    .action-card h2 { font-size: 1.75rem; margin: 0; }
    .action-card p { color: #505050; line-height: 1.8; }
    .action-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .status { color: #505050; font-size: 14px; }
    .action-bottom-grid { display: grid; gap: 24px; grid-template-columns: repeat(3, minmax(320px, 1fr)); }
    .info-card { background: #ffffff; border-radius: 24px; padding: 28px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); }
    .card-header { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
    .card-header h2 { margin: 0; font-size: 1.6rem; }
    .card-header p { color: #556b87; margin: 6px 0 0; }
    .card-header select { border: 1px solid #e2e8f0; border-radius: 14px; padding: 10px 14px; background: white; color: #1f2937; font-weight: 600; }
    .map-card app-leaflet-map { border-radius: 24px; overflow: hidden; }
    .route-summary { display: grid; gap: 10px; margin-top: 18px; color: #334155; }
    .climate-details { display: grid; gap: 12px; margin-top: 18px; color: #374151; }
    .checklist-panel { background: #f8fafc; border-radius: 24px; padding: 28px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05); }
    .checklist-panel h2 { margin-bottom: 10px; }
    .checklist-panel p { color: #4b5563; margin-bottom: 8px; line-height: 1.75; }
    .checklist-stats { margin-bottom: 16px; color: #556b87; font-size: 13px; }
    #checklist { list-style: none; margin: 0; padding: 0; }
    #checklist li { display: flex; gap: 16px; padding: 18px 18px 18px 46px; margin-bottom: 14px; border-radius: 18px; background: #ffffff; box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.18); position: relative; cursor: pointer; transition: background 0.2s, transform 0.2s; }
    #checklist li:hover { background: #eef2ff; transform: translateY(-1px); }
    #checklist li.checked { background: #ecfdf5; border-color: #34d399; }
    .checkbox { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; border-radius: 50%; border: 2px solid #cbd5e1; display: inline-flex; align-items: center; justify-content: center; color: #10b981; font-weight: 700; background: white; }
    #checklist li.checked .checkbox { border-color: #10b981; background: #10b981; color: white; }
    #checklist li p { margin: 6px 0 0; color: #64748b; font-size: 14px; line-height: 1.75; }
    @media (max-width: 960px) { .action-bottom-grid { grid-template-columns: 1fr; } }
  `]
})
export class ActionsComponent {
  actions = [
    { title: 'Auto-Tag Data', description: 'Automatically categorize uploaded records for easier analysis.', status: 'Ready' },
    { title: 'Generate Summary', description: 'Create concise action plans from your uploaded information.', status: 'Idle' },
    { title: 'Optimize Workflow', description: 'Run a productivity check and receive improvement suggestions.', status: 'Waiting' }
  ];

  checklist = [
    { title: 'Passport / visa documents', description: 'Confirm all travel documents and visa approvals.', checked: false },
    { title: 'Vaccination certificates', description: 'Keep vaccine records and health clearances handy.', checked: false },
    { title: 'Flight tickets and boarding passes', description: 'Verify flight bookings, seat assignments, and check-in details.', checked: false },
    { title: 'Accommodation confirmations', description: 'Save hotel or resort booking references and arrival instructions.', checked: false },
    { title: 'Local travel insurance', description: 'Purchase or confirm insurance for the destination and dates.', checked: false },
    { title: 'Emergency contacts', description: 'List local contacts, embassy numbers, and travel support.', checked: false },
    { title: 'Weather-specific packing list', description: 'Prepare clothing and gear for the expected climate.', checked: false }
  ];

  cities = ['Bengaluru', 'Mumbai', 'Delhi', 'Goa', 'Jaipur'];
  climateCity = 'Bengaluru';
  climateSummary = this.getClimateSummary(this.climateCity);

  routes = [
    { key: 'BLR-GOA', label: 'Bengaluru → Goa', center: [15.2993, 74.1240], name: 'Goa', distance: '560 km', duration: '10h', tip: 'Expect coastal humidity and brighter skies.', pois: [
      { name: 'Bengaluru Airport', type: 'ATTRACTION', lat: 12.9539, lon: 77.4903 },
      { name: 'Goa Resort', type: 'HOTEL', lat: 15.2993, lon: 74.1240 }
    ] },
    { key: 'DEL-JAI', label: 'Delhi → Jaipur', center: [26.9124, 75.7873], name: 'Jaipur', distance: '280 km', duration: '5h', tip: 'Carry sun protection for the desert route.', pois: [
      { name: 'Delhi Bus Stand', type: 'ATTRACTION', lat: 28.6448, lon: 77.2167 },
      { name: 'Jaipur Palace Hotel', type: 'HOTEL', lat: 26.9124, lon: 75.7873 }
    ] },
    { key: 'MUM-UTR', label: 'Mumbai → Udaipur', center: [24.5854, 73.7125], name: 'Udaipur', distance: '760 km', duration: '12h', tip: 'Plan an early start for cooler morning travel.', pois: [
      { name: 'Mumbai Terminal', type: 'ATTRACTION', lat: 19.0760, lon: 72.8777 },
      { name: 'Udaipur Lake Resort', type: 'HOTEL', lat: 24.5854, lon: 73.7125 }
    ] }
  ];

  selectedRouteKey = this.routes[0].key;
  mapCenter = this.routes[0].center;
  mapName = this.routes[0].name;
  pois = this.routes[0].pois;

  get selectedRoute() {
    return this.routes.find(r => r.key === this.selectedRouteKey);
  }

  get checkedCount() {
    return this.checklist.filter(item => item.checked).length;
  }

  updateRoute() {
    const route = this.selectedRoute;
    if (route) {
      this.mapCenter = route.center;
      this.mapName = route.name;
      this.pois = route.pois;
    }
  }

  updateClimateCity(city: string) {
    this.climateCity = city;
    this.climateSummary = this.getClimateSummary(city);
  }

  toggleChecklist(item: any) {
    item.checked = !item.checked;
  }

  getClimateSummary(city: string) {
    const data: any = {
      Bengaluru: { advisory: 'Light showers are common, carry an umbrella.', wardrobe: 'Breathable layers with a rain jacket.', pack: 'Umbrella, quick-dry clothes, insect repellent.' },
      Mumbai: { advisory: 'High humidity with coastal winds.', wardrobe: 'Light fabrics and waterproof shoes.', pack: 'Sunhat, sunscreen, water bottle.' },
      Delhi: { advisory: 'Hot days and cool nights; expect dry heat.', wardrobe: 'Cotton shirts and a light jacket for evenings.', pack: 'Sunglasses, reusable water bottle, light scarf.' },
      Goa: { advisory: 'Warm and humid with possible sea breeze.', wardrobe: 'Beachwear and light, airy fabrics.', pack: 'Swimwear, sandals, reef-safe sunscreen.' },
      Jaipur: { advisory: 'Dry and sunny with sharp daytime sun.', wardrobe: 'Loose cottons and sun protection.', pack: 'Hat, sunscreen, comfortable walking shoes.' }
    };
    return data[city] || data['Bengaluru'];
  }

  execute(action: any) {
    action.status = 'Running';
    setTimeout(() => action.status = 'Completed', 1200);
  }
}
