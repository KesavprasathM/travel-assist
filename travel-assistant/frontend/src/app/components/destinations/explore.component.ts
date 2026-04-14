import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { DestinationService } from '../../services/destination.service';
import { AuthService } from '../../services/auth.service';
import { Destination } from '../../models';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <section class="explore-shell container">
    <div class="section-header">
      <h1>Explore by Experience</h1>
      <p>Choose the style of trip that fits your taste and discover the best destinations for it.</p>
    </div>
    <div class="types-grid">
      <button *ngFor="let t of types" (click)="filterByType(t.key)" [class.active]="activeType===t.key" [style.background]="t.bg">
        {{t.label}}
      </button>
    </div>

    <section class="destinations-section">
      <div class="section-title-row">
        <div>
          <h2>Recommended Destinations</h2>
          <p>Top destinations tailored for the travel style you selected.</p>
        </div>
        <button class="btn btn-primary" *ngIf="auth.isLoggedIn" routerLink="/planner">Plan trip now</button>
      </div>

      <div class="loading-spinner" *ngIf="loading"><div class="spinner"></div></div>
      <div class="destinations-grid" *ngIf="!loading">
        <div class="dest-card" *ngFor="let d of filteredDestinations" (click)="viewDestination(d)">
          <div class="dest-img-wrap">
            <img [src]="d.imageUrl" [alt]="d.name" loading="lazy">
            <div class="dest-type-badge">{{d.type}}</div>
            <div class="dest-budget-info">₹{{d.lowBudgetPerDay | number}}/day</div>
          </div>
          <div class="dest-info">
            <div class="dest-header">
              <div>
                <h3>{{d.name}}</h3>
                <p class="dest-state">{{d.state}}</p>
              </div>
              <div class="dest-rating">★ {{d.rating}} <span class="review-count">({{d.reviewCount | number}})</span></div>
            </div>
            <p class="dest-desc">{{d.description | slice:0:100}}...</p>
            <div class="dest-tags">
              <span class="tag" *ngFor="let tag of d.tags?.split(',')?.slice(0,3)">{{tag.trim()}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
  `,
  styles: [`
    .explore-shell { padding: 80px 24px; }
    .section-header { max-width: 760px; margin: 0 auto 32px; text-align: center; }
    .section-header h1 { font-size: clamp(2.4rem, 4vw, 3.4rem); margin-bottom: 14px; }
    .section-header p { color: #556b87; max-width: 620px; margin: 0 auto; font-size: 1.05rem; }
    .types-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 42px; }
    .types-grid button { border: none; border-radius: 18px; padding: 18px 22px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .types-grid button:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(15,23,42,0.12); }
    .types-grid button.active { box-shadow: 0 20px 50px rgba(233,69,96,0.18); }
    .destinations-section { margin-top: 24px; }
    .section-title-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
    .section-title-row h2 { margin: 0; font-size: 2rem; }
    .section-title-row p { margin: 6px 0 0; color: #556b87; }
    .destinations-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; align-items: start; }
    .dest-card { display: flex; flex-direction: column; justify-content: space-between; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(15,23,42,0.08); overflow: hidden; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; min-height: 100%; }
    .dest-card:hover { transform: translateY(-4px); }
    .dest-img-wrap { position: relative; height: 260px; overflow: hidden; }
    .dest-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; display: block; }
    .dest-card:hover .dest-img-wrap img { transform: scale(1.03); }
    .dest-type-badge { position: absolute; top: 18px; left: 18px; background: rgba(15,23,42,0.82); color: white; padding: 8px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    .dest-budget-info { position: absolute; bottom: 18px; right: 18px; background: rgba(249,115,22,0.95); color: white; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    .dest-info { padding: 24px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
    .dest-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
    .dest-header h3 { margin: 0; font-size: 1.4rem; }
    .dest-state { color: #6b7280; margin: 6px 0 0; font-size: 13px; }
    .dest-rating { font-weight: 700; color: #1f2937; min-width: 92px; text-align: right; }
    .review-count { font-size: 12px; color: #6b7280; font-weight: 400; }
    .dest-desc { color: #475569; line-height: 1.8; margin: 0; flex: 1; }
    .dest-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { background: #eef2ff; color: #2563eb; padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; }
    @media (max-width: 760px) {
      .section-title-row { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class ExploreComponent implements OnInit {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  loading = true;
  activeType = '';

  types = [
    {key:'BEACH', label:'Beach', bg:'#dbeafe'},
    {key:'MOUNTAIN', label:'Mountain', bg:'#dcfce7'},
    {key:'HERITAGE', label:'Heritage', bg:'#fef3c7'},
    {key:'CITY', label:'City', bg:'#fde68a'},
    {key:'NATURE', label:'Nature', bg:'#ede9fe'},
    {key:'WILDLIFE', label:'Wildlife', bg:'#ffedd5'}
  ];

  constructor(private destService: DestinationService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.destService.getAll().subscribe({
      next: res => { this.destinations = res.data; this.filteredDestinations = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterByType(type: string) {
    this.activeType = this.activeType === type ? '' : type;
    this.filteredDestinations = this.activeType ? this.destinations.filter(d => d.type === this.activeType) : this.destinations;
  }

  viewDestination(d: Destination) {
    this.router.navigate(['/destinations', d.id]);
  }
}
