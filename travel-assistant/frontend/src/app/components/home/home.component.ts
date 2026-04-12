import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { AuthService } from '../../services/auth.service';
import { Destination } from '../../models';
import { VideoBackgroundComponent } from '../video-background/video-background.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, VideoBackgroundComponent],
  template: `
  <!-- Hero -->
  <section class="hero">
    <app-video-background></app-video-background>
    <div class="hero-content container">
      <div class="hero-headline">
        <span class="eyebrow">Built for teams who need a simple way to create powerful travel experiences fast.</span>
        <h1>Plan better journeys with intuitive, intelligent workflows.</h1>
        <p>From fast itinerary ideas to seamless bookings, every step is designed to help you move quicker and deliver exceptional travel support.</p>
      </div>
      <div class="hero-actions">
        <a routerLink="/auth/register" class="btn btn-primary">Get Started</a>
        <a routerLink="/events" class="btn btn-outline">Explore Events</a>
        <a routerLink="/actions" class="btn btn-secondary">Open Action Center</a>
      </div>
      <div class="hero-controls">
        <div class="control-card">
          <label>Destination type</label>
          <select [(ngModel)]="selectedTheme">
            <option *ngFor="let theme of themes" [value]="theme">{{theme}}</option>
          </select>
        </div>
        <div class="control-card">
          <div class="metric-label">Trusted by</div>
          <div class="metric-value">50,000+ travel planners</div>
        </div>
      </div>
      <div class="hero-pill-row">
        <div class="pill">Smart itinerary planning</div>
        <div class="pill">Instant booking actions</div>
        <div class="pill">Event and community hubs</div>
        <div class="pill">Secure account access</div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="stats-bar">
    <div class="container">
      <div class="stats-grid">
        <div class="stat" *ngFor="let s of stats">
          <div class="stat-num">{{s.num}}</div>
          <div class="stat-label">{{s.label}}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Destination Types -->
  <section class="types-section container">
    <div class="section-header">
      <h2>Explore by Experience</h2>
      <p>Find your perfect getaway</p>
    </div>
    <div class="types-grid">
      <div class="type-card" *ngFor="let t of types" (click)="filterByType(t.key)"
        [style.background]="t.bg" [class.active]="activeType===t.key">
        <span class="type-label">{{t.label}}</span>
      </div>
    </div>
  </section>

  <!-- Featured Destinations -->
  <section class="destinations-section container">
    <div class="section-header">
      <h2>Popular Destinations</h2>
      <p>Hand-picked gems across India</p>
    </div>
    <div class="loading-spinner" *ngIf="loading"><div class="spinner"></div></div>
    <div class="destinations-grid" *ngIf="!loading">
      <div class="dest-card" *ngFor="let d of filteredDestinations" (click)="viewDestination(d)">
        <div class="dest-img-wrap">
          <img [src]="d.imageUrl" [alt]="d.name" loading="lazy">
          <div class="dest-type-badge">{{d.type}}</div>
          <div class="dest-budget-info">
            <span>₹{{d.lowBudgetPerDay | number}}/day</span>
          </div>
        </div>
        <div class="dest-info">
          <div class="dest-header">
            <div>
              <h3>{{d.name}}</h3>
              <p class="dest-state">{{d.state}}</p>
            </div>
            <div class="dest-rating">
              <span class="star">★</span> {{d.rating}}
              <span class="review-count">({{d.reviewCount | number}})</span>
            </div>
          </div>
          <p class="dest-desc">{{d.description | slice:0:100}}...</p>
          <div class="dest-tags">
            <span class="tag" *ngFor="let t of d.tags?.split(',')?.slice(0,3)">{{t.trim()}}</span>
          </div>
          <div class="dest-footer">
            <div class="budget-range">
              <span class="badge badge-low">₹{{d.lowBudgetPerDay/1000 | number:'1.0-0'}}K</span>
              <span class="badge badge-mid">₹{{d.midBudgetPerDay/1000 | number:'1.0-0'}}K</span>
              <span class="badge badge-luxury">₹{{d.luxuryBudgetPerDay/1000 | number:'1.0-0'}}K</span>
            </div>
            <button class="btn btn-primary btn-xs">Explore →</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section class="how-it-works">
    <div class="container">
      <div class="section-header">
        <h2>How Tripx Works</h2>
        <p>4 simple steps to your perfect trip</p>
      </div>
      <div class="steps-grid">
        <div class="step" *ngFor="let s of steps; let i=index">
          <div class="step-num">{{i+1}}</div>
          <h3>{{s.title}}</h3>
          <p>{{s.desc}}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section" *ngIf="!auth.isLoggedIn">
    <div class="container">
      <h2>Ready to Explore?</h2>
      <p>Join 50,000+ travellers planning smarter trips with Tripx</p>
      <a routerLink="/auth/register" class="btn btn-gold">Start Planning Free →</a>
    </div>
  </section>
  `,
  styles: [`
    .hero { position: relative; min-height: 92vh; display: flex; align-items: center; overflow: hidden; }
    .hero-content { position: relative; z-index: 2; color: white; max-width: 1080px; padding: 80px 24px; display: grid; gap: 24px; }
    .hero-headline { max-width: 720px; }
    .eyebrow { display: inline-block; text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.82rem; color: #a5b4fc; margin-bottom: 22px; }
    .hero-headline h1 { font-size: clamp(2.7rem, 5vw, 4.4rem); line-height: 1.02; margin-bottom: 20px; letter-spacing: -0.03em; }
    .hero-headline p { font-size: 1.05rem; max-width: 640px; color: rgba(255,255,255,0.88); line-height: 1.8; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin-top: 4px; }
    .btn-secondary { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.18); }
    .btn-secondary:hover { background: rgba(255,255,255,0.2); }
    .btn-outline { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.6); }
    .btn-outline:hover { background: rgba(255,255,255,0.08); }
    .hero-controls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; max-width: 720px; }
    .control-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); border-radius: 18px; padding: 22px; }
    .control-card label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.12em; }
    .control-card select { width: 100%; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); color: white; }
    .metric-label { font-size: 0.82rem; color: rgba(255,255,255,0.72); margin-bottom: 10px; }
    .metric-value { font-size: 1.25rem; color: white; font-weight: 700; }
    .hero-pill-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 14px; }
    .pill { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; padding: 14px 18px; font-size: 0.92rem; color: #e0e7ff; text-align: center; }
    .stats-bar { background: rgba(255,255,255,0.06); backdrop-filter: blur(18px); padding: 32px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; text-align: center; }
    .stat-num { font-size: 2.1rem; font-weight: 700; color: white; font-family: var(--font-display); }
    .stat-label { color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 6px; }
    .types-section { padding: 64px 0 32px; }
    .types-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
    .type-card { padding: 24px; border-radius: 22px; transition: all 0.2s ease; text-align: center; min-height: 120px; display: flex; align-items: center; justify-content: center; }
    .type-label { font-size: 0.95rem; font-weight: 700; color: #1f2937; }
    .type-card:hover, .type-card.active { transform: translateY(-4px); box-shadow: 0 14px 42px rgba(15,23,42,0.12); }
    .destinations-section { padding: 32px 0 64px; }
    .destinations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 28px; }
    .dest-card { background: white; border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 30px rgba(15,23,42,0.08); }
    .dest-card:hover { transform: translateY(-6px); box-shadow: 0 20px 55px rgba(15,23,42,0.14); }
    .dest-img-wrap { position: relative; height: 220px; overflow: hidden; }
    .dest-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .dest-card:hover .dest-img-wrap img { transform: scale(1.04); }
    .dest-type-badge { position: absolute; top: 14px; left: 14px; background: rgba(15,23,42,0.82); color: white; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    .dest-budget-info { position: absolute; bottom: 14px; right: 14px; background: rgba(249,115,22,0.9); color: white; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    .dest-info { padding: 22px; }
    .dest-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 16px; }
    .dest-header h3 { font-size: 1.25rem; color: #111827; margin-bottom: 4px; }
    .dest-state { font-size: 13px; color: #6b7280; }
    .dest-rating { text-align: right; font-weight: 700; font-size: 15px; color: #111827; }
    .review-count { font-size: 12px; color: #6b7280; font-weight: 400; }
    .dest-desc { color: #4b5563; font-size: 14px; margin-bottom: 12px; line-height: 1.7; }
    .dest-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
    .budget-range { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-xs { padding: 8px 16px; font-size: 13px; }
    .how-it-works { background: #0f172a; padding: 80px 0; }
    .how-it-works .section-header h2, .how-it-works .section-header p { color: white !important; }
    .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
    .step { padding: 24px; background: rgba(255,255,255,0.05); border-radius: 24px; text-align: left; color: white; }
    .step-num { width: 38px; height: 38px; border-radius: 50%; background: #2563eb; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
    .step h3 { font-size: 1rem; margin-bottom: 10px; }
    .step p { font-size: 0.95rem; opacity: 0.86; line-height: 1.8; }
    .cta-section { background: linear-gradient(135deg, #2563eb, #111827); padding: 80px 0; text-align: center; color: white; }
    .cta-section h2 { font-size: 2.5rem; margin-bottom: 12px; }
    .cta-section p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 32px; }
    @media (max-width: 1024px) {
      .hero { min-height: 88vh; }
      .hero-controls { grid-template-columns: 1fr; }
      .hero-pill-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .stats-grid { grid-template-columns: repeat(2,1fr); }
      .steps-grid { grid-template-columns: repeat(2,1fr); }
    }
    @media (max-width: 768px) {
      .hero { min-height: auto; padding-bottom: 40px; }
      .hero-content { padding: 56px 18px 40px; }
      .hero-headline h1 { font-size: 2.5rem; }
      .hero-actions { flex-direction: column; align-items: stretch; }
      .hero-pill-row { grid-template-columns: 1fr; }
      .types-grid { grid-template-columns: 1fr; }
      .destinations-grid { grid-template-columns: 1fr; }
      .how-it-works .section-header { text-align: left; }
    }
  `]
})
export class HomeComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  loading = true;
  searchFrom = ''; searchTo = ''; searchDate = ''; searchPeople = 2;
  activeBudget = ''; activeType = '';
  today = new Date().toISOString().split('T')[0];

  cities = ['Bengaluru','Mumbai','Delhi','Chennai','Hyderabad','Pune','Kolkata','Ahmedabad'];
  selectedTheme = 'City';
  themes = ['City', 'Beach', 'Mountain', 'Heritage'];
  budgets = [{key:'LOW',label:'Budget'},{key:'MID',label:'Mid-Range'},{key:'LUXURY',label:'Luxury'}];
  types = [
    {key:'BEACH',label:'Beach',bg:'#e3f2fd'},
    {key:'MOUNTAIN',label:'Mountain',bg:'#e8f5e9'},
    {key:'HERITAGE',label:'Heritage',bg:'#fff8e1'},
    {key:'NATURE',label:'Nature',bg:'#f3e5f5'},
    {key:'CITY',label:'City',bg:'#fce4ec'},
    {key:'WILDLIFE',label:'Wildlife',bg:'#fff3e0'},
  ];
  stats = [{num:'500+',label:'Destinations'},{num:'50K+',label:'Happy Travellers'},{num:'1M+',label:'Trips Planned'},{num:'4.8 / 5',label:'Average Rating'}];
  steps = [
    {title:'Choose Destination',desc:'Select from curated, highly rated travel experiences.'},
    {title:'Set Your Dates',desc:'Pick your schedule and traveller count with ease.'},
    {title:'Pick Budget',desc:'Filter for budget-friendly, premium, or luxury stays.'},
    {title:'Book & Travel',desc:'Confirm transport, hotel, and services in a single flow.'}
  ];

  constructor(private destService: DestinationService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.destService.getAll().subscribe({
      next: res => { this.destinations = res.data; this.filteredDestinations = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  filterByType(type: string) {
    this.activeType = this.activeType === type ? '' : type;
    this.filteredDestinations = this.activeType ? this.destinations.filter(d => d.type === this.activeType) : this.destinations;
  }

  viewDestination(d: Destination) { this.router.navigate(['/destinations', d.id]); }

  startPlanning() {
    if (!this.auth.isLoggedIn) { this.router.navigate(['/auth/login']); return; }
    this.router.navigate(['/planner'], { queryParams: { from: this.searchFrom, to: this.searchTo, date: this.searchDate, people: this.searchPeople } });
  }
}
