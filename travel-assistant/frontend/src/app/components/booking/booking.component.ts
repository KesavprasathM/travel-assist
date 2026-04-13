import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { TransportOption } from '../../models';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="booking-page container">
    <h1>Book Your Transport</h1>
    <p class="page-sub">Search and book flights, trains, buses and cabs</p>

    <!-- Search Panel -->
    <div class="search-panel">
      <div class="transport-type-tabs">
        <button *ngFor="let t of transportTypes" [class.active]="searchForm.type===t.key"
          (click)="searchForm.type=t.key">
          {{t.icon}} {{t.label}}
        </button>
      </div>
      <div class="search-row">
        <div class="form-group">
          <label>From</label>
          <input type="text" [(ngModel)]="searchForm.from" placeholder="Departure city">
        </div>
        <button class="swap-btn" (click)="swapLocations()">⇄</button>
        <div class="form-group">
          <label>To</label>
          <input type="text" [(ngModel)]="searchForm.to" placeholder="Destination city">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" [(ngModel)]="searchForm.date" [min]="today">
        </div>
        <div class="form-group">
          <label>Passengers</label>
          <input type="number" [(ngModel)]="searchForm.passengers" min="1" max="10">
        </div>
        <button class="btn btn-primary" (click)="searchTransports()" [disabled]="loading">
          {{loading ? 'Searching...' : 'Search'}}
        </button>
      </div>
    </div>

    <!-- Results -->
    <div *ngIf="searched">
      <div class="loading-spinner" *ngIf="loading"><div class="spinner"></div></div>
      <div *ngIf="!loading">
        <div class="results-header">
          <h3>{{results.length}} {{searchForm.type}}s Found</h3>
          <div class="sort-options">
            <span>Sort by:</span>
            <button [class.active]="sortBy==='price'" (click)="sortResults('price')">Price</button>
            <button [class.active]="sortBy==='duration'" (click)="sortResults('duration')">Duration</button>
            <button [class.active]="sortBy==='rating'" (click)="sortResults('rating')">Rating</button>
          </div>
        </div>

        <div class="results-list">
          <div class="transport-card" *ngFor="let r of results">
            <div class="tc-operator">
              <div class="tc-logo">{{r.operator[0]}}</div>
              <div>
                <strong>{{r.operator}}</strong>
                <div class="tc-type-badge">{{r.type}}</div>
              </div>
              <div class="tc-rating">⭐ {{r.rating | number:'1.1-1'}}</div>
            </div>
            <div class="tc-timing">
              <div class="tc-dep">
                <div class="tc-time">{{r.departure}}</div>
                <div class="tc-city">{{r.from}}</div>
              </div>
              <div class="tc-route">
                <div class="tc-duration">{{r.duration}}</div>
                <div class="tc-line"><span></span></div>
                <div class="tc-type-icon">{{getIcon(r.type)}}</div>
              </div>
              <div class="tc-arr">
                <div class="tc-time">{{r.arrival}}</div>
                <div class="tc-city">{{r.to}}</div>
              </div>
            </div>
            <div class="tc-amenities">
              <span *ngFor="let a of r.amenities">✓ {{a}}</span>
            </div>
            <div class="tc-classes">
              <div class="tc-class" *ngFor="let c of r.classes" [class.selected]="isClassSelected(r.id, c.name)">
                <div>
                  <div class="class-name">{{c.name}}</div>
                  <div class="class-avail">{{c.available}} seats</div>
                </div>
                <div class="class-price">₹{{c.price | number}}</div>
                <button class="btn btn-primary btn-xs" (click)="selectClass(r, c)">Select</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Form Modal -->
    <div class="modal-overlay" *ngIf="showBookingForm" (click)="showBookingForm=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Passenger Details</h2>
          <button class="modal-close" (click)="showBookingForm=false">✕</button>
        </div>
        <div class="booking-summary">
          <div class="bs-row"><span>Route</span><strong>{{selectedTransport?.from}} → {{selectedTransport?.to}}</strong></div>
          <div class="bs-row"><span>Operator</span><strong>{{selectedTransport?.operator}}</strong></div>
          <div class="bs-row"><span>Date</span><strong>{{searchForm.date}}</strong></div>
          <div class="bs-row"><span>Class</span><strong>{{selectedClass?.name}}</strong></div>
          <div class="bs-row"><span>Per Person</span><strong>₹{{selectedClass?.price | number}}</strong></div>
          <div class="bs-row total"><span>Total ({{searchForm.passengers}} pax)</span><strong>₹{{(selectedClass?.price || 0) * searchForm.passengers | number}}</strong></div>
        </div>
        <div class="passengers-form">
          <h3>Passenger Information</h3>
          <div *ngFor="let p of passengers; let i=index" class="passenger-row">
            <div class="pax-num">Pax {{i+1}}</div>
            <div class="form-group"><input type="text" [(ngModel)]="p.name" placeholder="Full Name"></div>
            <div class="form-group"><input type="number" [(ngModel)]="p.age" placeholder="Age" min="1" max="120"></div>
            <div class="form-group">
              <select [(ngModel)]="p.gender">
                <option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
              </select>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-full" (click)="proceedToPayment()" [disabled]="loading">
          {{loading ? 'Processing...' : 'Proceed to Payment →'}}
        </button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .booking-page { padding: 40px 0 80px; }
    h1 { font-size: 2rem; color: #1a1a2e; margin-bottom: 6px; }
    .page-sub { color: #6c7293; margin-bottom: 32px; }
    .search-panel { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); margin-bottom: 32px; }
    .transport-type-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .transport-type-tabs button { padding: 8px 20px; border-radius: 50px; border: 2px solid #e8ecf4; background: transparent; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; color: #6c7293; transition: all 0.2s; }
    .transport-type-tabs button.active { background: #e94560; border-color: #e94560; color: white; }
    .search-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
    .search-row .form-group { flex: 1; min-width: 140px; margin-bottom: 0; }
    .swap-btn { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #e8ecf4; background: white; font-size: 18px; cursor: pointer; flex-shrink: 0; margin-bottom: 2px; transition: all 0.2s; }
    .swap-btn:hover { background: #e94560; color: white; border-color: #e94560; }
    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .results-header h3 { color: #1a1a2e; }
    .sort-options { display: flex; gap: 8px; align-items: center; font-size: 14px; color: #6c7293; }
    .sort-options button { padding: 6px 14px; border-radius: 50px; border: 1px solid #e8ecf4; background: white; font-size: 13px; cursor: pointer; color: #6c7293; transition: all 0.15s; }
    .sort-options button.active { background: #e94560; border-color: #e94560; color: white; }
    .results-list { display: flex; flex-direction: column; gap: 16px; }
    .transport-card { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.07); border: 2px solid #e8ecf4; transition: border-color 0.2s; }
    .transport-card:hover { border-color: rgba(233,69,96,0.3); }
    .tc-operator { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
    .tc-logo { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg,#e94560,#0f3460); color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; }
    .tc-type-badge { font-size: 11px; background: #f8f9ff; padding: 2px 8px; border-radius: 50px; color: #6c7293; margin-top: 2px; display: inline-block; }
    .tc-rating { margin-left: auto; font-weight: 600; font-size: 15px; }
    .tc-timing { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #f8f9ff; border-radius: 14px; margin-bottom: 16px; }
    .tc-dep, .tc-arr { text-align: center; }
    .tc-time { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; }
    .tc-city { font-size: 12px; color: #6c7293; margin-top: 4px; }
    .tc-route { flex: 1; text-align: center; padding: 0 20px; }
    .tc-duration { font-size: 13px; color: #6c7293; margin-bottom: 6px; }
    .tc-line { height: 2px; background: #e8ecf4; position: relative; margin: 6px 0; }
    .tc-line span { position: absolute; right: -4px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: #e94560; }
    .tc-type-icon { font-size: 18px; }
    .tc-amenities { display: flex; gap: 12px; flex-wrap: wrap; font-size: 12px; color: #4caf50; margin-bottom: 16px; }
    .tc-classes { display: flex; gap: 10px; flex-wrap: wrap; }
    .tc-class { display: flex; align-items: center; gap: 14px; border: 2px solid #e8ecf4; border-radius: 12px; padding: 12px 16px; flex: 1; min-width: 200px; transition: border-color 0.2s; }
    .tc-class.selected { border-color: #e94560; }
    .class-name { font-weight: 600; font-size: 14px; }
    .class-avail { font-size: 12px; color: #6c7293; }
    .class-price { font-size: 1.1rem; font-weight: 700; color: #e94560; margin-left: auto; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .modal { background: white; border-radius: 24px; padding: 32px; max-width: 560px; width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .modal-header h2 { font-size: 1.4rem; }
    .modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #6c7293; }
    .booking-summary { background: #f8f9ff; border-radius: 16px; padding: 20px; margin-bottom: 24px; }
    .bs-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e8ecf4; font-size: 14px; }
    .bs-row:last-child { border-bottom: none; }
    .bs-row.total { font-size: 16px; font-weight: 700; }
    .bs-row.total strong { color: #e94560; font-size: 1.2rem; }
    .passengers-form h3 { margin-bottom: 16px; }
    .passenger-row { display: flex; align-items: flex-end; gap: 12px; margin-bottom: 12px; }
    .pax-num { font-size: 12px; font-weight: 700; color: #e94560; min-width: 40px; padding-bottom: 14px; }
    .passenger-row .form-group { flex: 1; margin-bottom: 0; }
  `]
})
export class BookingComponent implements OnInit {
  searchForm = { type: 'FLIGHT', from: '', to: '', date: '', passengers: 1 };
  results: TransportOption[] = [];
  loading = false; searched = false; sortBy = 'price';
  selectedTransport: TransportOption | null = null;
  selectedClass: any = null;
  selectedClassMap: {[key: string]: string} = {};
  showBookingForm = false;
  passengers: any[] = [];
  today = new Date().toISOString().split('T')[0];
  transportTypes = [{key:'FLIGHT',icon:'✈',label:'Flight'},{key:'TRAIN',icon:'🚂',label:'Train'},{key:'BUS',icon:'🚌',label:'Bus'},{key:'CAB',icon:'🚗',label:'Cab'}];

  constructor(private bookingService: BookingService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['from']) this.searchForm.from = p['from'];
      if (p['to']) this.searchForm.to = p['to'];
      if (p['type']) this.searchForm.type = p['type'];
      this.searchForm.date = this.today;
      if (this.searchForm.from && this.searchForm.to) this.searchTransports();
    });
  }

  swapLocations() { [this.searchForm.from, this.searchForm.to] = [this.searchForm.to, this.searchForm.from]; }

  searchTransports() {
    if (!this.searchForm.from || !this.searchForm.to) return;
    this.loading = true; this.searched = true;
    this.bookingService.searchTransports(this.searchForm.from, this.searchForm.to, this.searchForm.date, this.searchForm.type).subscribe({
      next: res => { this.results = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  sortResults(by: string) {
    this.sortBy = by;
    if (by === 'price') this.results.sort((a, b) => (a.classes[0]?.price || 0) - (b.classes[0]?.price || 0));
    if (by === 'rating') this.results.sort((a, b) => b.rating - a.rating);
  }

  getIcon(type: string): string {
    const icons: any = {FLIGHT:'✈️',TRAIN:'🚂',BUS:'🚌',CAB:'🚕'};
    return icons[type] || '🚍';
  }

  isClassSelected(id: string, name: string): boolean { return this.selectedClassMap[id] === name; }

  selectClass(transport: TransportOption, cls: any) {
    this.selectedTransport = transport; this.selectedClass = cls;
    this.selectedClassMap = {[transport.id]: cls.name};
    this.passengers = Array(this.searchForm.passengers).fill(null).map(() => ({name:'',age:'',gender:'M'}));
    this.showBookingForm = true;
  }

  proceedToPayment() {
    if (!this.selectedTransport || !this.selectedClass) return;
    const bookingData = {
      bookingType: this.searchForm.type,
      fromLocation: this.searchForm.from,
      toLocation: this.searchForm.to,
      travelDate: this.searchForm.date,
      departureTime: this.selectedTransport.departure,
      arrivalTime: this.selectedTransport.arrival,
      operatorName: this.selectedTransport.operator,
      seatClass: this.selectedClass.name,
      passengers: this.searchForm.passengers,
      totalAmount: this.selectedClass.price * this.searchForm.passengers,
      passengerDetails: JSON.stringify(this.passengers)
    };
    this.loading = true;
    this.bookingService.createBooking(bookingData).subscribe({
      next: res => {
        this.showBookingForm = false; this.loading = false;
        this.router.navigate(['/payment'], { queryParams: { bookingId: res.data.id, amount: res.data.totalAmount } });
      },
      error: e => { this.loading = false; console.error(e); }
    });
  }
}