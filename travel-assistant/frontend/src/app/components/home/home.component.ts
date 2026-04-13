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
        <span class="eyebrow">Trusted by 500,000+ trusted planners</span>
        <h1>Plan better journeys with intuitive, intelligent workflows.</h1>
        <p>From fast itinerary ideas to seamless bookings, every step is designed to help you move quicker and deliver exceptional travel support.</p>
      </div>
      <div class="hero-actions">
        <button class="boton-elegante btn-get-started" (click)="startPlanning()">Get Started</button>
        <a routerLink="/destinations" class="boton-elegante btn-explore">Explore</a>
        <a routerLink="/actions" class="boton-elegante btn-action">Open Action Center</a>
      </div>
      <div class="hero-pill-row">
        <div class="pill">Smart itinerary planning</div>
        <div class="pill">Instant booking actions</div>
        <div class="pill">Secure planning workflow</div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; overflow: hidden; }
    .hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 0; }
    .hero::before { content: ''; position: absolute; inset: 0; background: rgba(10, 14, 25, 0.55); }
    .hero-content { position: relative; z-index: 2; color: white; max-width: 960px; padding: 60px 24px; display: grid; gap: 22px; text-align: center; }
    .hero-headline { max-width: 720px; margin: 0 auto; }
    .eyebrow { display: inline-block; text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.85rem; color: #8b96ff; margin-bottom: 18px; font-weight: 700; }
    .hero-headline h1 { font-size: clamp(2.8rem, 5vw, 4.8rem); line-height: 1.02; margin-bottom: 18px; letter-spacing: -0.03em; }
    .hero-headline p { font-size: 1.05rem; max-width: 650px; margin: 0 auto; color: rgba(255,255,255,0.9); line-height: 1.75; }
    .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 18px; margin-top: 12px; }
    .boton-elegante { padding: 15px 30px; border: 2px solid #2c2c2c; background-color: #1a1a1a; color: #ffffff; font-size: 1.15rem; cursor: pointer; border-radius: 30px; transition: all 0.4s ease; outline: none; position: relative; overflow: hidden; font-weight: bold; text-decoration: none; min-width: 190px; }
    .boton-elegante::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 70%); transform: scale(0); transition: transform 0.5s ease; }
    .boton-elegante:hover::after { transform: scale(4); }
    .boton-elegante:hover { border-color: #666666; background: #292929; }
    .btn-get-started { border-color: #f59e0b; background-color: #f59e0b; color: #111827; }
    .btn-get-started:hover { background-color: #d97706; border-color: #d97706; color: #fff; }
    .btn-explore { border-color: transparent; background: linear-gradient(135deg, #4f46e5, #0ea5e9); color: #ffffff; }
    .btn-explore:hover { background: linear-gradient(135deg, #4338ca, #0284c7); }
    .btn-action { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.12); color: #ffffff; }
    .btn-action:hover { background: rgba(255,255,255,0.22); }
    .hero-pill-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
    .pill { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; padding: 14px 20px; font-size: 0.95rem; color: #e0e7ff; text-align: center; }
    .hero-headline h1, .hero-headline p, .eyebrow { user-select: none; }
    @media (max-width: 1024px) {
      .hero { min-height: 100vh; }
      .hero-pill-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 768px) {
      .hero { min-height: 100vh; padding-bottom: 40px; }
      .hero-content { padding: 40px 18px; }
      .hero-headline h1 { font-size: 2.8rem; }
      .hero-actions { flex-direction: column; align-items: stretch; }
      .hero-pill-row { grid-template-columns: 1fr; }
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

  applyThemeFilter(theme: string) {
    this.selectedTheme = theme;
    const themeMap: Record<string,string> = { Beach: 'BEACH', Mountain: 'MOUNTAIN', Heritage: 'HERITAGE', City: 'CITY' };
    const key = themeMap[theme] || '';
    this.activeType = key;
    this.filteredDestinations = key ? this.destinations.filter(d => d.type === key) : this.destinations;
  }

  viewDestination(d: Destination) { this.router.navigate(['/destinations', d.id]); }

  startPlanning() {
    if (!this.auth.isLoggedIn) { this.router.navigate(['/auth/login']); return; }
    this.router.navigate(['/planner'], { queryParams: { from: this.searchFrom, to: this.searchTo, date: this.searchDate, people: this.searchPeople } });
  }
}
