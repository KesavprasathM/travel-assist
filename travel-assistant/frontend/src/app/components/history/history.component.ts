import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { BookingService } from '../../services/booking.service';
import { ReviewService } from '../../services/review.service';
import { TripPlan, Booking, Review } from '../../models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="history-page container">
    <div class="history-header">
      <h1>My Travel History</h1>
      <p>All your past and upcoming trips in one place</p>
    </div>

    <div class="history-tabs">
      <button [class.active]="activeTab==='trips'" (click)="activeTab='trips'">✈ Trip Plans ({{trips.length}})</button>
      <button [class.active]="activeTab==='bookings'" (click)="activeTab='bookings'">🎟 Bookings ({{bookings.length}})</button>
      <button [class.active]="activeTab==='reviews'" (click)="activeTab='reviews'">⭐ My Reviews ({{reviews.length}})</button>
    </div>

    <!-- Trips Tab -->
    <div *ngIf="activeTab==='trips'">
      <div class="loading-spinner" *ngIf="loadingTrips"><div class="spinner"></div></div>
      <div class="empty-state" *ngIf="!loadingTrips && trips.length===0">
        <div class="es-icon">🗺</div>
        <h3>No trips planned yet</h3>
        <p>Start planning your dream trip!</p>
        <a routerLink="/planner" class="btn btn-primary">Plan a Trip</a>
      </div>
      <div class="trips-grid" *ngIf="!loadingTrips && trips.length>0">
        <div class="trip-card" *ngFor="let t of trips">
          <div class="tc-status-bar" [class]="'status-'+t.status?.toLowerCase()"></div>
          <div class="tc-body">
            <div class="tc-route">{{t.source}} <span>→</span> {{t.destination}}</div>
            <div class="tc-dates">📅 {{t.startDate | date}} – {{t.endDate | date}}</div>
            <div class="tc-meta">
              <span class="badge" [class]="'badge-'+t.budgetType?.toLowerCase()">{{t.budgetType}}</span>
              <span>👥 {{t.numberOfPeople}} people</span>
              <span>🌙 {{t.durationDays}} days</span>
            </div>
            <div class="tc-budget">Total Budget: <strong>₹{{t.totalBudget | number}}</strong></div>
            <div class="tc-footer">
              <span class="status-badge" [class]="'sb-'+t.status?.toLowerCase()">{{t.status}}</span>
              <a [routerLink]="['/trips', t.id]" class="btn btn-secondary btn-xs">View Plan →</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bookings Tab -->
    <div *ngIf="activeTab==='bookings'">
      <div class="loading-spinner" *ngIf="loadingBookings"><div class="spinner"></div></div>
      <div class="empty-state" *ngIf="!loadingBookings && bookings.length===0">
        <div class="es-icon">🎟</div>
        <h3>No bookings yet</h3>
        <p>Book your first transport!</p>
        <a routerLink="/booking" class="btn btn-primary">Book Transport</a>
      </div>
      <div class="bookings-list" *ngIf="!loadingBookings && bookings.length>0">
        <div class="booking-item" *ngFor="let b of bookings">
          <div class="bi-type-icon">{{getBookingIcon(b.bookingType)}}</div>
          <div class="bi-info">
            <div class="bi-route">{{b.fromLocation}} → {{b.toLocation}}</div>
            <div class="bi-details">
              <span>{{b.operatorName}}</span>
              <span>{{b.seatClass}}</span>
              <span>📅 {{b.travelDate | date}}</span>
              <span>🕐 {{b.departureTime}}</span>
            </div>
            <div class="bi-ref">Ref: {{b.bookingReference}}</div>
          </div>
          <div class="bi-right">
            <div class="bi-amount">₹{{b.totalAmount | number}}</div>
            <span class="badge" [class]="'badge-'+b.paymentStatus?.toLowerCase()">{{b.paymentStatus}}</span>
            <span class="status-badge" [class]="'sb-'+b.status?.toLowerCase()">{{b.status}}</span>
            <button class="btn btn-secondary btn-xs" *ngIf="b.status==='CONFIRMED'" (click)="cancelBooking(b.id)">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Tab -->
    <div *ngIf="activeTab==='reviews'">
      <div class="loading-spinner" *ngIf="loadingReviews"><div class="spinner"></div></div>
      <div class="empty-state" *ngIf="!loadingReviews && reviews.length===0">
        <div class="es-icon">⭐</div>
        <h3>No reviews written yet</h3>
        <p>Share your travel experiences</p>
      </div>
      <div class="reviews-grid" *ngIf="!loadingReviews && reviews.length>0">
        <div class="review-item" *ngFor="let r of reviews">
          <div class="ri-header">
            <strong>{{r.destinationName}}</strong>
            <div class="ri-stars">
              <span class="star" *ngFor="let s of getStars(r.rating)">★</span>
            </div>
            <span class="ri-date">{{r.createdAt | date:'MMM y'}}</span>
          </div>
          <h4>{{r.title}}</h4>
          <p>{{r.content}}</p>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .history-page { padding: 40px 0 80px; }
    .history-header { margin-bottom: 32px; }
    .history-header h1 { font-size: 2rem; color: #1a1a2e; margin-bottom: 6px; }
    .history-header p { color: #6c7293; }
    .history-tabs { display: flex; gap: 8px; margin-bottom: 32px; background: #f8f9ff; padding: 6px; border-radius: 16px; width: fit-content; }
    .history-tabs button { padding: 10px 20px; border: none; background: transparent; border-radius: 10px; font-family: 'DM Sans',sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; color: #6c7293; transition: all 0.2s; }
    .history-tabs button.active { background: white; color: #e94560; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .empty-state { text-align: center; padding: 80px 20px; }
    .es-icon { font-size: 60px; margin-bottom: 16px; }
    .empty-state h3 { font-size: 1.3rem; color: #1a1a2e; margin-bottom: 8px; }
    .empty-state p { color: #6c7293; margin-bottom: 24px; }
    .trips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 20px; }
    .trip-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
    .tc-status-bar { height: 4px; }
    .status-planned .tc-status-bar { background: #2196f3; }
    .status-ongoing .tc-status-bar { background: #f0a500; }
    .status-completed .tc-status-bar { background: #4caf50; }
    .status-cancelled .tc-status-bar { background: #f44336; }
    .tc-body { padding: 20px; }
    .tc-route { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
    .tc-route span { color: #e94560; }
    .tc-dates { font-size: 13px; color: #6c7293; margin-bottom: 12px; }
    .tc-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; font-size: 13px; color: #6c7293; margin-bottom: 10px; }
    .tc-budget { font-size: 14px; color: #6c7293; margin-bottom: 14px; }
    .tc-budget strong { color: #1a1a2e; }
    .tc-footer { display: flex; justify-content: space-between; align-items: center; }
    .status-badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 50px; }
    .sb-confirmed, .sb-planned { background: #e3f2fd; color: #1565c0; }
    .sb-completed { background: #e8f5e9; color: #2e7d32; }
    .sb-cancelled { background: #ffebee; color: #c62828; }
    .sb-ongoing { background: #fff8e1; color: #e65100; }
    .sb-paid { background: #e8f5e9; color: #2e7d32; }
    .sb-pending { background: #fff8e1; color: #e65100; }
    .bookings-list { display: flex; flex-direction: column; gap: 14px; }
    .booking-item { background: white; border-radius: 16px; padding: 20px; display: flex; gap: 16px; align-items: center; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .bi-type-icon { font-size: 32px; flex-shrink: 0; }
    .bi-info { flex: 1; }
    .bi-route { font-size: 1rem; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
    .bi-details { display: flex; gap: 12px; font-size: 13px; color: #6c7293; flex-wrap: wrap; margin-bottom: 4px; }
    .bi-ref { font-size: 12px; color: #6c7293; }
    .bi-right { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; flex-shrink: 0; }
    .bi-amount { font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
    .reviews-grid { display: flex; flex-direction: column; gap: 16px; }
    .review-item { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .ri-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .ri-header strong { font-size: 1rem; color: #1a1a2e; }
    .ri-stars { color: #f0a500; }
    .ri-date { margin-left: auto; font-size: 12px; color: #6c7293; }
    .review-item h4 { font-size: 15px; margin-bottom: 6px; }
    .review-item p { font-size: 14px; color: #6c7293; }
  `]
})
export class HistoryComponent implements OnInit {
  activeTab = 'trips';
  trips: TripPlan[] = []; bookings: Booking[] = []; reviews: Review[] = [];
  loadingTrips = true; loadingBookings = true; loadingReviews = true;

  constructor(private tripService: TripService, private bookingService: BookingService, private reviewService: ReviewService) {}

  ngOnInit() {
    this.tripService.getMyPlans().subscribe({ next: r => { this.trips = r.data||[]; this.loadingTrips = false; }, error: () => this.loadingTrips = false });
    this.bookingService.getMyBookings().subscribe({ next: r => { this.bookings = r.data||[]; this.loadingBookings = false; }, error: () => this.loadingBookings = false });
    this.reviewService.getMyReviews().subscribe({ next: r => { this.reviews = r.data||[]; this.loadingReviews = false; }, error: () => this.loadingReviews = false });
  }

  getBookingIcon(type: string): string {
    const icons: any = {FLIGHT:'✈️',TRAIN:'🚂',BUS:'🚌',CAB:'🚕',HOTEL:'🏨'};
    return icons[type] || '🎟';
  }

  getStars(n: number): number[] { return Array(n).fill(0); }

  cancelBooking(id: number) {
    if (!confirm('Cancel this booking?')) return;
    this.bookingService.cancelBooking(id).subscribe({
      next: () => { const b = this.bookings.find(x => x.id === id); if (b) b.status = 'CANCELLED'; },
      error: () => {}
    });
  }
}
