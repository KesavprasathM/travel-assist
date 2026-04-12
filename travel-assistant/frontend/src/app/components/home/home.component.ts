import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { AuthService } from '../../services/auth.service';
import { Destination } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <!-- Hero -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content container">
      <div class="hero-badge">🤖 AI-Powered Travel Planning</div>
      <h1>Discover India's<br><span class="accent">Magic Destinations</span></h1>
      <p>Personalized itineraries, smart booking & AI recommendations — all in one place</p>
      <!-- Search Box -->
      <div class="search-box">
        <div class="search-field">
          <span class="search-icon">📍</span>
          <input type="text" [(ngModel)]="searchFrom" placeholder="From (your city)" list="cities-from">
          <datalist id="cities-from">
            <option *ngFor="let c of cities" [value]="c"></option>
          </datalist>
        </div>
        <div class="search-divider">→</div>
        <div class="search-field">
          <span class="search-icon">🏖</span>
          <input type="text" [(ngModel)]="searchTo" placeholder="Where to?" list="cities-to">
          <datalist id="cities-to">
            <option *ngFor="let d of destinations" [value]="d.name"></option>
          </datalist>
        </div>
        <div class="search-field">
          <span class="search-icon">📅</span>
          <input type="date" [(ngModel)]="searchDate" [min]="today">
        </div>
        <div class="search-field">
          <span class="search-icon">👥</span>
          <select [(ngModel)]="searchPeople">
            <option *ngFor="let n of [1,2,3,4,5,6,7,8,9,10]" [value]="n">{{n}} {{n===1?'Person':'People'}}</option>
          </select>
        </div>
        <button class="btn btn-primary search-btn" (click)="startPlanning()">Plan My Trip ✈</button>
      </div>
      <!-- Budget Filter -->
      <div class="budget-filter">
        <span>Budget:</span>
        <button *ngFor="let b of budgets" [class.active]="activeBudget===b.key"
          (click)="activeBudget=b.key" class="budget-btn">
          {{b.icon}} {{b.label}}
        </button>
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
        <span class="type-icon">{{t.icon}}</span>
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
              <p class="dest-state">📍 {{d.state}}</p>
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
          <div class="step-icon">{{s.icon}}</div>
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
    .hero { position: relative; min-height: 85vh; display: flex; align-items: center; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg,#1a1a2e 0%,#16213e 45%,#0f3460 100%); }
    .hero-bg::after { content:''; position:absolute; inset:0; background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600') center/cover; opacity:0.12; }
    .hero-content { position: relative; z-index: 1; color: white; max-width: 900px; padding: 80px 24px; }
    .hero-badge { display: inline-block; background: rgba(233,69,96,0.2); border: 1px solid rgba(233,69,96,0.4); padding: 6px 16px; border-radius: 50px; font-size: 14px; margin-bottom: 24px; }
    .hero-content h1 { font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.15; margin-bottom: 16px; }
    .accent { color: #f0a500; }
    .hero-content p { font-size: 1.2rem; opacity: 0.85; margin-bottom: 40px; }
    .search-box { background: white; border-radius: 20px; padding: 16px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .search-field { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 160px; background: #f8f9ff; border-radius: 12px; padding: 10px 14px; }
    .search-field input, .search-field select { border: none; background: transparent; font-size: 14px; outline: none; width: 100%; font-family: 'DM Sans',sans-serif; color: #2d2d44; }
    .search-icon { font-size: 16px; flex-shrink: 0; }
    .search-divider { font-size: 20px; color: #e94560; font-weight: 700; }
    .search-btn { flex-shrink: 0; padding: 14px 28px; white-space: nowrap; }
    .budget-filter { display: flex; align-items: center; gap: 10px; margin-top: 20px; flex-wrap: wrap; }
    .budget-filter span { color: rgba(255,255,255,0.7); font-size: 14px; }
    .budget-btn { padding: 6px 16px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.3); background: transparent; color: white; font-size: 13px; cursor: pointer; transition: all 0.2s; }
    .budget-btn.active, .budget-btn:hover { background: #e94560; border-color: #e94560; }
    .stats-bar { background: #1a1a2e; padding: 32px 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; text-align: center; }
    .stat-num { font-size: 2rem; font-weight: 700; color: #f0a500; font-family: 'Playfair Display',serif; }
    .stat-label { color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 4px; }
    .types-section { padding: 64px 0 32px; }
    .types-grid { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .type-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 24px; border-radius: 16px; cursor: pointer; transition: all 0.2s; min-width: 100px; }
    .type-icon { font-size: 28px; }
    .type-label { font-size: 13px; font-weight: 600; color: #2d2d44; }
    .type-card:hover, .type-card.active { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .destinations-section { padding: 32px 0 64px; }
    .destinations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 28px; }
    .dest-card { background: white; border-radius: 20px; overflow: hidden; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .dest-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.14); }
    .dest-img-wrap { position: relative; height: 220px; overflow: hidden; }
    .dest-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
    .dest-card:hover .dest-img-wrap img { transform: scale(1.06); }
    .dest-type-badge { position: absolute; top: 14px; left: 14px; background: rgba(26,26,46,0.75); color: white; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; backdrop-filter: blur(4px); }
    .dest-budget-info { position: absolute; bottom: 14px; right: 14px; background: rgba(240,165,0,0.9); color: #1a1a2e; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; }
    .dest-info { padding: 20px; }
    .dest-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
    .dest-header h3 { font-size: 1.25rem; color: #1a1a2e; margin-bottom: 2px; }
    .dest-state { font-size: 13px; color: #6c7293; }
    .dest-rating { text-align: right; font-weight: 700; font-size: 15px; color: #1a1a2e; }
    .review-count { font-size: 12px; color: #6c7293; font-weight: 400; }
    .dest-desc { color: #6c7293; font-size: 14px; margin-bottom: 12px; line-height: 1.5; }
    .dest-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; }
    .budget-range { display: flex; gap: 6px; }
    .btn-xs { padding: 6px 16px; font-size: 13px; }
    .how-it-works { background: #1a1a2e; padding: 80px 0; }
    .how-it-works .section-header h2, .how-it-works .section-header p { color: white !important; }
    .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; }
    .step { text-align: center; color: white; }
    .step-num { width: 36px; height: 36px; border-radius: 50%; background: #e94560; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .step-icon { font-size: 40px; margin-bottom: 12px; }
    .step h3 { font-size: 1.05rem; margin-bottom: 8px; }
    .step p { font-size: 14px; opacity: 0.75; }
    .cta-section { background: linear-gradient(135deg,#e94560,#0f3460); padding: 80px 0; text-align: center; color: white; }
    .cta-section h2 { font-size: 2.5rem; margin-bottom: 12px; }
    .cta-section p { font-size: 1.1rem; opacity: 0.9; margin-bottom: 32px; }
    @media(max-width:768px) { .stats-grid{grid-template-columns:repeat(2,1fr);} .steps-grid{grid-template-columns:1fr;} }
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
  budgets = [{key:'LOW',icon:'💰',label:'Budget'},{key:'MID',icon:'💳',label:'Mid-Range'},{key:'LUXURY',icon:'💎',label:'Luxury'}];
  types = [
    {key:'BEACH',icon:'🏖',label:'Beach',bg:'#e3f2fd'},
    {key:'MOUNTAIN',icon:'🏔',label:'Mountain',bg:'#e8f5e9'},
    {key:'HERITAGE',icon:'🏛',label:'Heritage',bg:'#fff8e1'},
    {key:'NATURE',icon:'🌿',label:'Nature',bg:'#f3e5f5'},
    {key:'CITY',icon:'🏙',label:'City',bg:'#fce4ec'},
    {key:'WILDLIFE',icon:'🐅',label:'Wildlife',bg:'#fff3e0'},
  ];
  stats = [{num:'500+',label:'Destinations'},{num:'50K+',label:'Happy Travellers'},{num:'1M+',label:'Trips Planned'},{num:'4.8★',label:'Avg Rating'}];
  steps = [
    {icon:'🗺',title:'Choose Destination',desc:'Pick from 500+ curated destinations across India'},
    {icon:'📅',title:'Set Your Dates',desc:'Select travel dates and number of travellers'},
    {icon:'💰',title:'Pick Budget',desc:'Choose Low, Mid or Luxury budget preferences'},
    {icon:'✈',title:'Book & Travel',desc:'Book transport, hotel and pay securely'}
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
