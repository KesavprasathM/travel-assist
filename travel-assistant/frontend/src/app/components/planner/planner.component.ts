import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { DestinationService } from '../../services/destination.service';
import { Destination, TripPlan } from '../../models';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="planner-page container">
    <div class="planner-header">
      <h1>Plan Your Perfect Trip</h1>
      <p>Let AI build a personalized day-by-day itinerary for you</p>
    </div>

    <div class="planner-layout" *ngIf="!generatedPlan">
      <!-- Step 1: Route -->
      <div class="planner-card" [class.active]="step>=1">
        <div class="step-header"><div class="step-badge">1</div><h2>Choose Route & Dates</h2></div>
        <div class="grid-2">
          <div class="form-group">
            <label>📍 From (Source)</label>
            <input type="text" [(ngModel)]="form.source" placeholder="e.g. Bengaluru" list="source-list">
            <datalist id="source-list">
              <option *ngFor="let c of cities" [value]="c"></option>
            </datalist>
          </div>
          <div class="form-group">
            <label>🏖 To (Destination)</label>
            <select [(ngModel)]="form.destination" (change)="onDestinationChange()">
              <option value="">-- Select Destination --</option>
              <option *ngFor="let d of destinations" [value]="d.name">{{d.name}}, {{d.state}}</option>
            </select>
          </div>
          <div class="form-group">
            <label>📅 Start Date</label>
            <input type="date" [(ngModel)]="form.startDate" [min]="today" (change)="calcDays()">
          </div>
          <div class="form-group">
            <label>📅 End Date</label>
            <input type="date" [(ngModel)]="form.endDate" [min]="form.startDate" (change)="calcDays()">
          </div>
        </div>
        <div class="duration-badge" *ngIf="durationDays>0">
          🌙 {{durationDays}} nights {{durationDays+1}} days trip
        </div>
      </div>

      <!-- Step 2: People & Budget -->
      <div class="planner-card" [class.active]="step>=2">
        <div class="step-header"><div class="step-badge">2</div><h2>Travellers & Budget</h2></div>
        <div class="form-group">
          <label>👥 Number of Travellers</label>
          <div class="people-selector">
            <button (click)="form.numberOfPeople=max(1,form.numberOfPeople-1)">−</button>
            <span>{{form.numberOfPeople}} {{form.numberOfPeople===1?'Person':'People'}}</span>
            <button (click)="form.numberOfPeople=form.numberOfPeople+1">+</button>
          </div>
        </div>
        <div class="form-group">
          <label>💰 Budget Preference</label>
          <div class="budget-selector">
            <div *ngFor="let b of budgets" class="budget-option" [class.active]="form.budgetType===b.key"
              (click)="form.budgetType=b.key">
              <div class="bo-icon">{{b.icon}}</div>
              <div class="bo-label">{{b.label}}</div>
              <div class="bo-price" *ngIf="selectedDest">₹{{getBudgetPrice(b.key) | number}}/day</div>
            </div>
          </div>
        </div>
        <div class="total-budget-estimate" *ngIf="durationDays>0 && selectedDest">
          <div class="tbe-content">
            <span>💡 Estimated Total Budget</span>
            <strong>₹{{getTotalEstimate() | number}}</strong>
            <span>for {{form.numberOfPeople}} people × {{durationDays}} days</span>
          </div>
        </div>
      </div>

      <!-- Step 3: Transport -->
      <div class="planner-card" [class.active]="step>=3">
        <div class="step-header"><div class="step-badge">3</div><h2>Preferred Transport</h2></div>
        <div class="transport-selector">
          <div *ngFor="let t of transports" class="transport-option" [class.active]="form.transportMode===t.key"
            (click)="form.transportMode=t.key">
            <div class="to-icon">{{t.icon}}</div>
            <div class="to-label">{{t.label}}</div>
            <div class="to-info">{{t.info}}</div>
          </div>
        </div>
        <div class="ai-recommendation" *ngIf="selectedDest">
          <div class="air-icon">🤖</div>
          <div>
            <strong>AI Recommendation</strong>
            <p>Based on distance and your budget, we recommend <strong>{{getRecommendedTransport()}}</strong> for this trip.</p>
          </div>
        </div>
      </div>

      <div class="error-msg" *ngIf="error">⚠️ {{error}}</div>

      <button class="btn btn-primary btn-generate" [disabled]="loading" (click)="generatePlan()">
        {{loading ? '🤖 Generating Your Plan...' : '🚀 Generate AI Trip Plan'}}
        <span *ngIf="loading" class="btn-spinner"></span>
      </button>
    </div>

    <!-- Generated Plan -->
    <div *ngIf="generatedPlan" class="generated-plan fade-in-up">
      <div class="plan-header">
        <div>
          <div class="plan-route">✈ {{generatedPlan.source}} → {{generatedPlan.destination}}</div>
          <h2>Your {{generatedPlan.durationDays}}-Day Itinerary</h2>
          <div class="plan-meta">
            <span>📅 {{generatedPlan.startDate | date}} – {{generatedPlan.endDate | date}}</span>
            <span>👥 {{generatedPlan.numberOfPeople}} {{generatedPlan.numberOfPeople===1?'Person':'People'}}</span>
            <span class="badge" [class]="'badge-'+generatedPlan.budgetType?.toLowerCase()">{{generatedPlan.budgetType}}</span>
            <span>💰 ₹{{generatedPlan.totalBudget | number}} total</span>
          </div>
        </div>
        <div class="plan-actions">
          <button class="btn btn-secondary" (click)="generatedPlan=null">← Re-plan</button>
          <button class="btn btn-primary" (click)="goToBooking()">Book Transport →</button>
        </div>
      </div>

      <div class="day-plans">
        <div class="day-card" *ngFor="let day of parsedDayPlan">
          <div class="day-header">
            <div class="day-num">Day {{day.day}}</div>
            <div class="day-title">{{day.title}}</div>
            <div class="day-cost">₹{{day.estimatedCost | number}}</div>
          </div>
          <div class="schedule">
            <div class="schedule-item" *ngFor="let s of day.schedule" [class]="'type-'+s.type?.toLowerCase()">
              <div class="si-time">{{s.time}}</div>
              <div class="si-dot"></div>
              <div class="si-activity">
                <span class="si-icon">{{getActivityIcon(s.type)}}</span>
                {{s.activity}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-cta">
        <div class="pct-info">
          <h3>Ready to book your trip?</h3>
          <p>Secure your transport and hotels before they fill up!</p>
        </div>
        <div class="pct-buttons">
          <button class="btn btn-secondary" [routerLink]="['/trips', generatedPlan.id]">📋 View Full Plan</button>
          <button class="btn btn-primary" (click)="goToBooking()">🎟 Book Now</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .planner-page { padding: 40px 0 80px; }
    .planner-header { text-align: center; margin-bottom: 40px; }
    .planner-header h1 { font-size: 2.2rem; color: #1a1a2e; margin-bottom: 8px; }
    .planner-header p { color: #6c7293; }
    .planner-layout { display: flex; flex-direction: column; gap: 24px; max-width: 820px; margin: 0 auto; }
    .planner-card { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); border: 2px solid transparent; transition: border-color 0.3s; }
    .planner-card.active { border-color: rgba(233,69,96,0.2); }
    .step-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .step-badge { width: 36px; height: 36px; border-radius: 50%; background: #e94560; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
    .step-header h2 { font-size: 1.2rem; color: #1a1a2e; }
    .duration-badge { background: linear-gradient(135deg,rgba(233,69,96,0.1),rgba(15,52,96,0.1)); padding: 12px 20px; border-radius: 12px; font-weight: 600; color: #e94560; margin-top: 12px; text-align: center; }
    .people-selector { display: flex; align-items: center; gap: 20px; }
    .people-selector button { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #e94560; background: transparent; color: #e94560; font-size: 22px; cursor: pointer; font-weight: 700; transition: all 0.2s; }
    .people-selector button:hover { background: #e94560; color: white; }
    .people-selector span { font-size: 1.1rem; font-weight: 600; min-width: 100px; text-align: center; }
    .budget-selector { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
    .budget-option { border: 2px solid #e8ecf4; border-radius: 16px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .budget-option.active { border-color: #e94560; background: rgba(233,69,96,0.05); }
    .bo-icon { font-size: 28px; margin-bottom: 8px; }
    .bo-label { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
    .bo-price { font-size: 13px; color: #6c7293; }
    .total-budget-estimate { background: linear-gradient(135deg,#1a1a2e,#0f3460); border-radius: 16px; padding: 20px; color: white; margin-top: 16px; }
    .tbe-content { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .tbe-content strong { font-size: 1.8rem; font-family: 'Playfair Display',serif; color: #f0a500; }
    .transport-selector { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
    .transport-option { border: 2px solid #e8ecf4; border-radius: 16px; padding: 20px 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .transport-option.active { border-color: #e94560; background: rgba(233,69,96,0.05); }
    .to-icon { font-size: 30px; margin-bottom: 8px; }
    .to-label { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .to-info { font-size: 11px; color: #6c7293; }
    .ai-recommendation { display: flex; gap: 14px; align-items: flex-start; background: #f8f9ff; padding: 16px; border-radius: 12px; margin-top: 16px; border-left: 4px solid #e94560; }
    .air-icon { font-size: 24px; }
    .ai-recommendation strong { display: block; margin-bottom: 4px; }
    .ai-recommendation p { font-size: 14px; color: #6c7293; }
    .btn-generate { width: 100%; justify-content: center; padding: 18px; font-size: 1.1rem; border-radius: 16px; background: linear-gradient(135deg,#e94560,#0f3460); }
    .btn-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .error-msg { background: #ffebee; color: #c62828; padding: 14px 20px; border-radius: 12px; border-left: 4px solid #f44336; }
    .generated-plan { max-width: 900px; margin: 0 auto; }
    .plan-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .plan-route { font-size: 14px; color: #e94560; font-weight: 600; margin-bottom: 6px; }
    .plan-header h2 { font-size: 1.8rem; color: #1a1a2e; margin-bottom: 10px; }
    .plan-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 14px; color: #6c7293; align-items: center; }
    .plan-actions { display: flex; gap: 10px; flex-shrink: 0; }
    .day-plans { display: flex; flex-direction: column; gap: 20px; }
    .day-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .day-header { display: flex; align-items: center; gap: 16px; padding: 18px 24px; background: linear-gradient(135deg,#1a1a2e,#16213e); color: white; }
    .day-num { background: #e94560; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .day-title { flex: 1; font-weight: 600; }
    .day-cost { font-size: 14px; color: #f0a500; font-weight: 600; }
    .schedule { padding: 20px 24px; display: flex; flex-direction: column; gap: 2px; }
    .schedule-item { display: flex; align-items: center; gap: 14px; padding: 10px 0; border-bottom: 1px solid #f8f9ff; }
    .si-time { font-size: 12px; font-weight: 600; color: #6c7293; min-width: 70px; }
    .si-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; background: #e8ecf4; }
    .type-sightseeing .si-dot { background: #2196f3; }
    .type-food .si-dot { background: #ff9800; }
    .type-leisure .si-dot { background: #4caf50; }
    .si-activity { font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .si-icon { font-size: 16px; }
    .plan-cta { background: linear-gradient(135deg,#e94560,#0f3460); border-radius: 20px; padding: 32px; color: white; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; flex-wrap: wrap; gap: 20px; }
    .pct-info h3 { font-size: 1.3rem; margin-bottom: 6px; }
    .pct-info p { opacity: 0.85; font-size: 14px; }
    .pct-buttons { display: flex; gap: 12px; }
    @media(max-width:768px) { .transport-selector{grid-template-columns:repeat(2,1fr);} .budget-selector{grid-template-columns:1fr;} }
  `]
})
export class PlannerComponent implements OnInit {
  destinations: Destination[] = [];
  selectedDest: Destination | null = null;
  generatedPlan: TripPlan | null = null;
  loading = false; error = '';
  durationDays = 0; step = 1;
  today = new Date().toISOString().split('T')[0];
  cities = ['Bengaluru','Mumbai','Delhi','Chennai','Hyderabad','Pune','Kolkata','Ahmedabad','Jaipur','Goa'];
  form = { source: '', destination: '', startDate: '', endDate: '', numberOfPeople: 2, budgetType: 'MID', transportMode: 'TRAIN' };
  budgets = [{key:'LOW',icon:'💰',label:'Budget'},{key:'MID',icon:'💳',label:'Mid-Range'},{key:'LUXURY',icon:'💎',label:'Luxury'}];
  transports = [{key:'FLIGHT',icon:'✈️',label:'Flight',info:'Fastest'},{key:'TRAIN',icon:'🚂',label:'Train',info:'Economical'},{key:'BUS',icon:'🚌',label:'Bus',info:'Budget'},{key:'CAB',icon:'🚗',label:'Cab',info:'Flexible'}];

  constructor(private tripService: TripService, private destService: DestinationService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.destService.getAll().subscribe(res => { this.destinations = res.data; });
    this.route.queryParams.subscribe(p => {
      if (p['from']) this.form.source = p['from'];
      if (p['to']) this.form.destination = p['to'];
      if (p['date']) this.form.startDate = p['date'];
      if (p['people']) this.form.numberOfPeople = +p['people'];
      if (p['budget']) this.form.budgetType = p['budget'];
      if (this.form.destination) this.onDestinationChange();
    });
  }

  onDestinationChange() { this.selectedDest = this.destinations.find(d => d.name === this.form.destination) || null; }

  calcDays() {
    if (this.form.startDate && this.form.endDate) {
      const s = new Date(this.form.startDate), e = new Date(this.form.endDate);
      this.durationDays = Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000));
    }
  }

  getBudgetPrice(type: string): number {
    if (!this.selectedDest) return 0;
    return type === 'LOW' ? this.selectedDest.lowBudgetPerDay : type === 'MID' ? this.selectedDest.midBudgetPerDay : this.selectedDest.luxuryBudgetPerDay;
  }
  getTotalEstimate(): number { return this.getBudgetPrice(this.form.budgetType) * this.durationDays * this.form.numberOfPeople; }
  getRecommendedTransport(): string { return this.durationDays <= 2 ? 'Flight (saves time)' : this.form.budgetType === 'LOW' ? 'Train (most economical)' : 'Train or Flight'; }
  max(a: number, b: number): number { return Math.max(a, b); }

  generatePlan() {
    if (!this.form.source || !this.form.destination || !this.form.startDate || !this.form.endDate) {
      this.error = 'Please fill all required fields.'; return;
    }
    this.loading = true; this.error = '';
    this.tripService.createPlan(this.form).subscribe({
      next: res => { this.generatedPlan = res.data; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Failed to generate plan'; this.loading = false; }
    });
  }

  get parsedDayPlan(): any[] {
    try { return JSON.parse(this.generatedPlan?.dayWisePlan || '[]'); } catch { return []; }
  }

  getActivityIcon(type: string): string {
    const icons: any = {SIGHTSEEING:'🏛',FOOD:'🍽',LEISURE:'😎',TRANSPORT:'🚗'};
    return icons[type] || '📌';
  }

  goToBooking() {
    this.router.navigate(['/booking'], { queryParams: { from: this.form.source, to: this.form.destination, tripId: this.generatedPlan?.id } });
  }
}
