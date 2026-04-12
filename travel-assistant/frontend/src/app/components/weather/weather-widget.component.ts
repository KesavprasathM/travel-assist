import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherApiService } from '../../services/weather.service';
import { DisasterService } from '../../services/disaster.service';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="weather-widget">
    <!-- Live Weather -->
    <div class="weather-card" *ngIf="weather">
      <div class="ww-header">
        <span class="ww-icon">{{weather.currentIcon || '🌤'}}</span>
        <div>
          <div class="ww-city">{{city}} — Live Weather</div>
          <div class="ww-temp">{{weather.currentTemp}}°C</div>
          <div class="ww-desc">{{weather.currentDescription}}</div>
        </div>
        <div class="ww-source">📡 Open-Meteo</div>
      </div>

      <!-- 7-day forecast -->
      <div class="forecast-strip" *ngIf="weather.forecast">
        <div class="forecast-day" *ngFor="let f of weather.forecast"
             [class]="'score-'+getScoreClass(f.travelScore)">
          <div class="fd-date">{{f.date | date:'EEE'}}</div>
          <div class="fd-icon">{{f.icon}}</div>
          <div class="fd-max">{{f.maxTemp | number:'1.0-0'}}°</div>
          <div class="fd-min">{{f.minTemp | number:'1.0-0'}}°</div>
          <div class="fd-rain" *ngIf="f.precipitation>0">💧{{f.precipitation | number:'1.0-0'}}mm</div>
          <div class="fd-score">Travel: {{f.travelScore}}/10</div>
        </div>
      </div>
    </div>

    <div class="weather-loading" *ngIf="loadingWeather">
      <div class="spinner-sm"></div> Fetching live weather from Open-Meteo...
    </div>

    <!-- Disaster Alerts -->
    <div class="alerts-section" *ngIf="alerts.length > 0">
      <h4>⚠️ Safety Alerts for {{city}}</h4>
      <div class="alert-item" *ngFor="let a of alerts"
           [class]="'sev-'+(a.severity||'INFO').toLowerCase()">
        <div class="ai-header">
          <span class="ai-type">{{getAlertIcon(a.type)}} {{a.type}}</span>
          <span class="ai-sev" [class]="'badge-'+(a.severity||'').toLowerCase()">{{a.severity}}</span>
          <span class="ai-active" *ngIf="a.activeNow">🔴 ACTIVE NOW</span>
        </div>
        <p class="ai-desc">{{a.description}}</p>
        <div class="ai-source">Source: {{a.source || 'GDACS/Tripx'}}</div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .weather-widget { display: flex; flex-direction: column; gap: 16px; }
    .weather-card { background: linear-gradient(135deg,#1a1a2e,#0f3460); border-radius: 16px; padding: 20px; color: white; }
    .ww-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
    .ww-icon { font-size: 40px; }
    .ww-city { font-size: 13px; opacity: 0.8; margin-bottom: 2px; }
    .ww-temp { font-size: 2.2rem; font-weight: 700; font-family: 'Playfair Display',serif; }
    .ww-desc { font-size: 14px; opacity: 0.85; }
    .ww-source { margin-left: auto; font-size: 11px; opacity: 0.6; }
    .forecast-strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
    .forecast-day { flex-shrink: 0; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 10px; text-align: center; min-width: 80px; }
    .score-good { border: 1px solid rgba(76,175,80,0.4); }
    .score-ok { border: 1px solid rgba(255,152,0,0.4); }
    .score-bad { border: 1px solid rgba(244,67,54,0.4); }
    .fd-date { font-size: 12px; opacity: 0.8; margin-bottom: 4px; font-weight: 600; }
    .fd-icon { font-size: 22px; margin-bottom: 4px; }
    .fd-max { font-size: 15px; font-weight: 700; }
    .fd-min { font-size: 12px; opacity: 0.7; }
    .fd-rain { font-size: 11px; opacity: 0.8; margin-top: 2px; }
    .fd-score { font-size: 10px; opacity: 0.7; margin-top: 4px; }
    .weather-loading { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #6c7293; padding: 16px; background: #f8f9ff; border-radius: 12px; }
    .spinner-sm { width: 18px; height: 18px; border: 2px solid #e8ecf4; border-top-color: #e94560; border-radius: 50%; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .alerts-section h4 { font-size: 15px; margin-bottom: 12px; color: #1a1a2e; }
    .alert-item { border-radius: 12px; padding: 14px; margin-bottom: 10px; }
    .sev-high { background: #fff3e0; border-left: 4px solid #f44336; }
    .sev-medium { background: #fff8e1; border-left: 4px solid #ff9800; }
    .sev-low, .sev-info { background: #e3f2fd; border-left: 4px solid #2196f3; }
    .ai-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .ai-type { font-weight: 700; font-size: 14px; }
    .badge-high { background: #ffebee; color: #c62828; font-size: 11px; padding: 2px 8px; border-radius: 50px; font-weight: 700; }
    .badge-medium { background: #fff8e1; color: #e65100; font-size: 11px; padding: 2px 8px; border-radius: 50px; font-weight: 700; }
    .badge-low, .badge-info { background: #e3f2fd; color: #1565c0; font-size: 11px; padding: 2px 8px; border-radius: 50px; font-weight: 700; }
    .ai-active { font-size: 11px; font-weight: 700; }
    .ai-desc { font-size: 13px; color: #4a4a6a; margin-bottom: 4px; }
    .ai-source { font-size: 11px; color: #9e9e9e; }
  `]
})
export class WeatherWidgetComponent implements OnInit, OnChanges {
  @Input() city = '';
  weather: any = null;
  alerts: any[] = [];
  loadingWeather = false;

  constructor(private weatherSvc: WeatherApiService, private disasterSvc: DisasterService) {}

  ngOnInit() { this.load(); }
  ngOnChanges() { if (this.city) this.load(); }

  load() {
    if (!this.city) return;
    this.loadingWeather = true;
    this.weatherSvc.getForecast(this.city).subscribe({
      next: res => { this.weather = res.data; this.loadingWeather = false; },
      error: () => this.loadingWeather = false
    });
    this.disasterSvc.getAlerts(this.city).subscribe({
      next: res => this.alerts = (res.data || []).filter((a: any) => a.activeNow || a.severity === 'HIGH'),
      error: () => {}
    });
  }

  getScoreClass(score: number): string {
    if (score >= 7) return 'good';
    if (score >= 5) return 'ok';
    return 'bad';
  }

  getAlertIcon(type: string): string {
    const icons: any = {CYCLONE:'🌀',FLOOD:'🌊',EARTHQUAKE:'🫨',LANDSLIDE:'⛰️',SNOWSTORM:'❄️',HEATWAVE:'🥵',TSUNAMI:'🌊'};
    return icons[type] || '⚠️';
  }
}
