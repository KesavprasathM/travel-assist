import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinationService } from '../../services/destination.service';
import { ReviewService } from '../../services/review.service';
import { RecommendationService } from '../../services/recommendation.service';
import { AuthService } from '../../services/auth.service';
import { ChatContextService } from '../../services/chat-context.service';
import { Destination, Review } from '../../models';
import { WeatherWidgetComponent } from '../weather/weather-widget.component';
import { LeafletMapComponent } from '../map/map.component';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, WeatherWidgetComponent, LeafletMapComponent],
  template: `
  <div *ngIf="loading" class="loading-spinner"><div class="spinner"></div></div>
  <div *ngIf="dest && !loading">
    <!-- Hero -->
    <div class="dest-hero" [style.background-image]="'url('+dest.imageUrl+')'">
      <div class="dest-hero-overlay">
        <div class="container">
          <div class="breadcrumb">🏠 Home → {{dest.state}} → <strong>{{dest.name}}</strong></div>
          <h1>{{dest.name}}</h1>
          <p>{{dest.state}}, {{dest.country}}</p>
          <div class="hero-meta">
            <span>⭐ {{dest.rating}} ({{dest.reviewCount | number}} reviews)</span>
            <span>🌤 {{dest.climate}}</span>
            <span>🗣 {{dest.language}}</span>
            <span class="open-source-badge">📡 Live data: Open-Meteo + OSM</span>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary" (click)="planTrip()">✈ Plan Trip Here</button>
            <button class="btn btn-outline" (click)="activeTab='weather'">🌤 Live Weather</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container dest-body">
      <!-- Budget Cards -->
      <div class="budget-cards">
        <div class="budget-card low" [class.selected]="selectedBudget==='LOW'" (click)="setSelectedBudget('LOW')">
          <div class="bc-icon">💰</div><div class="bc-label">Budget</div>
          <div class="bc-price">₹{{dest.lowBudgetPerDay | number}}<span>/day</span></div>
          <ul class="bc-features"><li>✓ Hostel</li><li>✓ Local Transport</li><li>✓ Street Food</li></ul>
        </div>
        <div class="budget-card mid" [class.selected]="selectedBudget==='MID'" (click)="setSelectedBudget('MID')">
          <div class="bc-popular">Most Popular</div>
          <div class="bc-icon">💳</div><div class="bc-label">Mid-Range</div>
          <div class="bc-price">₹{{dest.midBudgetPerDay | number}}<span>/day</span></div>
          <ul class="bc-features"><li>✓ 3-Star Hotel</li><li>✓ Cab/Train</li><li>✓ Restaurants</li></ul>
        </div>
        <div class="budget-card luxury" [class.selected]="selectedBudget==='LUXURY'" (click)="setSelectedBudget('LUXURY')">
          <div class="bc-icon">💎</div><div class="bc-label">Luxury</div>
          <div class="bc-price">₹{{dest.luxuryBudgetPerDay | number}}<span>/day</span></div>
          <ul class="bc-features"><li>✓ 5-Star Resort</li><li>✓ Private Car</li><li>✓ Fine Dining</li></ul>
        </div>
      </div>

      <!-- Tabs -->
      <div class="dest-tabs">
        <button *ngFor="let t of tabs" [class.active]="activeTab===t.key" (click)="activeTab=t.key">{{t.icon}} {{t.label}}</button>
      </div>

      <!-- Overview -->
      <div *ngIf="activeTab==='overview'" class="tab-content fade-in-up">
        <div class="grid-2">
          <div>
            <h2>About {{dest.name}}</h2>
            <p class="about-text">{{dest.description}}</p>
            <div class="info-chips">
              <div class="info-chip"><span>📅</span><div><strong>Best Season</strong><br>{{dest.bestSeason}}</div></div>
              <div class="info-chip"><span>🌡</span><div><strong>Climate</strong><br>{{dest.climate}}</div></div>
              <div class="info-chip"><span>🗣</span><div><strong>Language</strong><br>{{dest.language}}</div></div>
              <div class="info-chip"><span>💱</span><div><strong>Currency</strong><br>₹ Indian Rupee</div></div>
            </div>
          </div>
          <div>
            <h3>Famous Places</h3>
            <div class="places-list">
              <div class="place-item" *ngFor="let p of parsedFamousPlaces; let i=index">
                <div class="place-num">{{i+1}}</div><span>{{p}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Recommendation Panel -->
        <div class="rec-panel" *ngIf="recommendation">
          <div class="rec-header">
            <h3>🤖 AI Recommendations for {{dest.name}}</h3>
            <span class="rec-badge">Rule-Based Engine · No External API</span>
          </div>
          <div class="rec-grid">
            <div class="rec-card">
              <div class="rc-title">✈ Best Transport</div>
              <div class="rc-value">{{recommendation.transportRecommendation?.recommended}}</div>
              <div class="rc-reason">{{recommendation.transportRecommendation?.reason}}</div>
            </div>
            <div class="rec-card">
              <div class="rc-title">🎒 Trip Type</div>
              <div class="rc-value">{{recommendation.tripType}}</div>
            </div>
            <div class="rec-card">
              <div class="rc-title">📅 Best Time</div>
              <div class="rc-value" [style.color]="recommendation.bestTimeToVisit?.advice?.includes('EXCELLENT')?'#2e7d32':'#e65100'">
                {{recommendation.bestTimeToVisit?.bestSeason}}
              </div>
              <div class="rc-reason">{{recommendation.bestTimeToVisit?.advice}}</div>
            </div>
            <div class="rec-card">
              <div class="rc-title">💰 Budget (5 Days, 2 People)</div>
              <div class="rc-value">₹{{recommendation.budgetBreakdown?.totalForTrip | number}}</div>
              <div class="rc-reason">Incl. stay, food & activities</div>
            </div>
          </div>
          <div class="packing-list">
            <h4>🧳 What to Pack</h4>
            <div class="pack-items">
              <span class="pack-item" *ngFor="let p of recommendation.packingChecklist">{{p}}</span>
            </div>
          </div>
          <div class="safety-tips" *ngIf="recommendation.safetyTips?.length">
            <h4>🛡 Safety Tips</h4>
            <ul><li *ngFor="let t of recommendation.safetyTips">{{t}}</li></ul>
          </div>
        </div>
      </div>

      <!-- Live Weather Tab -->
      <div *ngIf="activeTab==='weather'" class="tab-content fade-in-up">
        <div class="grid-2">
          <div>
            <h2>Live Weather — {{dest.name}}</h2>
            <p class="data-source">📡 Data: Open-Meteo API (free, no API key) + OpenStreetMap Nominatim geocoding</p>
            <app-weather-widget [city]="dest.name"></app-weather-widget>
          </div>
          <div>
            <h3>📅 Best Months to Visit</h3>
            <div class="weather-months">
              <div class="wm-card" *ngFor="let m of weatherMonths" [class.best]="isGoodMonth(m.key)">
                <div class="wmc-month">{{m.key}}</div>
                <div class="wmc-temp">{{m.val?.temp}}</div>
                <div class="wmc-rain">🌧 {{m.val?.rainfall}}</div>
                <div class="wmc-desc">{{m.val?.description}}</div>
                <div class="wmc-badge" *ngIf="isGoodMonth(m.key)">✈ Best time</div>
              </div>
            </div>
            <div class="dress-guide">
              <h4>👗 Recommended Clothing</h4>
              <div class="dress-items">
                <span class="dress-item" *ngFor="let d of parsedDresses">{{d}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Tab -->
      <div *ngIf="activeTab==='map'" class="tab-content fade-in-up">
        <h2>📍 {{dest.name}} on Map</h2>
        <p class="data-source">🗺 Powered by Leaflet.js + OpenStreetMap — 100% open source, no API key</p>
        <div class="map-controls">
          <button *ngFor="let pt of poiTypes" (click)="loadPois(pt.key)" [class.active]="activePoi===pt.key" class="poi-btn">
            {{pt.icon}} {{pt.label}}
          </button>
        </div>
        <app-leaflet-map [lat]="dest.latitude" [lon]="dest.longitude" [name]="dest.name" [pois]="pois"></app-leaflet-map>
        <div class="poi-list" *ngIf="pois.length>0">
          <h4>Nearby {{activePoi}}s (from OpenStreetMap)</h4>
          <div class="poi-grid">
            <div class="poi-card" *ngFor="let p of pois">
              <div class="poc-name">{{p.name}}</div>
              <div class="poc-info" *ngIf="p.openingHours">⏰ {{p.openingHours}}</div>
              <div class="poc-info" *ngIf="p.phone">📞 {{p.phone}}</div>
              <div class="poc-stars" *ngIf="p.stars">{{getStarStr(p.stars)}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Food Tab -->
      <div *ngIf="activeTab==='food'" class="tab-content fade-in-up">
        <h2>Local Cuisine</h2>
        <div class="food-grid">
          <div class="food-card" *ngFor="let f of parsedFood; let i=index">
            <div class="food-emoji">{{foodEmojis[i % foodEmojis.length]}}</div>
            <div class="food-name">{{f}}</div>
          </div>
        </div>
        <h3 style="margin-top:40px">Hotels & Stays</h3>
        <div class="hotel-grid">
          <div class="hotel-card" *ngFor="let h of parsedHotels">
            <div class="hotel-stars"><span class="star" *ngFor="let s of getStars(h.stars)">★</span></div>
            <h4>{{h.name}}</h4>
            <div class="hotel-price">₹{{h.pricePerNight | number}}/night</div>
            <span class="badge" [class]="'badge-'+h.type?.toLowerCase()">{{h.type}}</span>
          </div>
        </div>
      </div>

      <!-- Festivals -->
      <div *ngIf="activeTab==='festivals'" class="tab-content fade-in-up">
        <h2>Culture & Festivals</h2>
        <div class="festival-grid">
          <div class="festival-card" *ngFor="let f of parsedFestivals">
            <div class="festival-month">{{f.month}}</div>
            <h3>{{f.name}}</h3><p>{{f.description}}</p>
          </div>
        </div>
      </div>

      <!-- Transport -->
      <div *ngIf="activeTab==='transport'" class="tab-content fade-in-up">
        <h2>How to Reach {{dest.name}}</h2>
        <div class="transport-options">
          <ng-container *ngFor="let from of transportKeys">
            <div class="transport-from">
              <h3>From {{from}}</h3>
              <div class="transport-modes">
                <div class="transport-mode" *ngFor="let mode of getTransportModes(from)">
                  <div class="tm-icon">{{getTransportIcon(mode.key)}}</div>
                  <div class="tm-info">
                    <strong>{{mode.key}}</strong>
                    <span>⏱ {{mode.val?.duration}}</span>
                    <span>💰 ₹{{mode.val?.price}}</span>
                    <span>🔁 {{mode.val?.frequency}}</span>
                  </div>
                  <button class="btn btn-primary btn-xs" (click)="searchTransport(from, mode.key)">Book Now</button>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Reviews -->
      <div *ngIf="activeTab==='reviews'" class="tab-content fade-in-up">
        <div class="reviews-header">
          <h2>Traveller Reviews</h2>
          <button class="btn btn-primary" *ngIf="auth.isLoggedIn" (click)="showReviewForm=!showReviewForm">+ Write Review</button>
        </div>
        <div class="review-form card" *ngIf="showReviewForm" style="padding:24px;margin-bottom:24px;">
          <div class="star-rating">
            <span *ngFor="let s of [1,2,3,4,5]" (click)="newReview.rating=s" [class.active]="newReview.rating>=s" class="rating-star">★</span>
          </div>
          <div class="form-group"><label>Title</label><input type="text" [(ngModel)]="newReview.title" placeholder="Trip was amazing!"></div>
          <div class="form-group"><label>Review</label><textarea [(ngModel)]="newReview.content" placeholder="Share your experience..."></textarea></div>
          <button class="btn btn-primary" (click)="submitReview()">Submit Review</button>
        </div>
        <div class="reviews-list">
          <div class="review-card" *ngFor="let r of reviews">
            <div class="review-header">
              <div class="reviewer-avatar">{{r.user?.name?.[0] || 'T'}}</div>
              <div><strong>{{r.user?.name || 'Traveller'}}</strong><div class="review-stars"><span class="star" *ngFor="let s of getStars(r.rating)">★</span></div></div>
              <div style="margin-left:auto;font-size:12px;color:#6c7293">{{r.createdAt | date:'MMM d, y'}}</div>
            </div>
            <h4>{{r.title}}</h4><p>{{r.content}}</p>
            <div *ngIf="r.verified" style="font-size:12px;color:#2e7d32;margin-top:6px">✅ Verified Trip</div>
          </div>
          <div *ngIf="reviews.length===0" style="text-align:center;padding:40px;color:#6c7293">No reviews yet. Be the first!</div>
        </div>
      </div>
    </div>

    <!-- Sticky Bar -->
    <div class="sticky-book-bar">
      <div class="container sbb-inner">
        <div><strong>{{dest.name}}</strong><span>{{selectedBudget}} · ₹{{getBudgetPrice() | number}}/day/person</span></div>
        <div class="sbb-actions">
          <button class="btn btn-secondary" (click)="activeTab='weather'">🌤 Weather</button>
          <button class="btn btn-secondary" (click)="activeTab='map'">🗺 Map</button>
          <button class="btn btn-primary" (click)="planTrip()">Plan Trip →</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .dest-hero{height:500px;background-size:cover;background-position:center;position:relative}
    .dest-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 60%,transparent 100%);display:flex;align-items:flex-end;padding-bottom:48px}
    .breadcrumb{color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:12px}
    .dest-hero-overlay h1{color:white;font-size:3rem;margin-bottom:4px}
    .dest-hero-overlay p{color:rgba(255,255,255,0.8);font-size:1.1rem;margin-bottom:12px}
    .hero-meta{display:flex;gap:20px;color:rgba(255,255,255,0.85);font-size:13px;margin-bottom:20px;flex-wrap:wrap}
    .open-source-badge{background:rgba(76,175,80,0.2);border:1px solid rgba(76,175,80,0.4);padding:2px 10px;border-radius:50px}
    .hero-actions{display:flex;gap:12px}
    .dest-body{padding:40px 0 120px}
    .budget-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:40px}
    .budget-card{padding:24px;border-radius:20px;border:2px solid #e8ecf4;cursor:pointer;transition:all 0.3s;position:relative;text-align:center;background:white}
    .budget-card.low.selected{border-color:#4caf50;background:#f1f8e9}
    .budget-card.mid.selected{border-color:#e94560;background:#fff5f7}
    .budget-card.luxury.selected{border-color:#f0a500;background:#fffde7}
    .bc-popular{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#e94560;color:white;padding:4px 16px;border-radius:50px;font-size:12px;font-weight:700;white-space:nowrap}
    .bc-icon{font-size:28px;margin-bottom:6px}
    .bc-label{font-size:12px;color:#6c7293;font-weight:600;text-transform:uppercase;letter-spacing:1px}
    .bc-price{font-size:1.8rem;font-weight:700;color:#1a1a2e;font-family:'Playfair Display',serif}
    .bc-price span{font-size:13px;font-weight:400;color:#6c7293}
    .bc-features{list-style:none;text-align:left;font-size:13px;color:#6c7293;margin-top:10px}
    .bc-features li{padding:3px 0}
    .dest-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:32px;background:#f8f9ff;padding:6px;border-radius:16px}
    .dest-tabs button{padding:9px 18px;border:none;background:transparent;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;color:#6c7293;transition:all 0.2s}
    .dest-tabs button.active{background:white;color:#e94560;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
    .about-text{color:#6c7293;line-height:1.8;margin:16px 0 20px}
    .data-source{font-size:12px;color:#4caf50;background:#e8f5e9;padding:6px 12px;border-radius:8px;margin-bottom:16px;display:inline-block}
    .info-chips{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .info-chip{display:flex;align-items:center;gap:12px;background:#f8f9ff;padding:12px;border-radius:12px;font-size:13px}
    .info-chip span{font-size:20px}
    .places-list{display:flex;flex-direction:column;gap:8px;margin-top:12px}
    .place-item{display:flex;align-items:center;gap:12px;background:#f8f9ff;padding:10px 14px;border-radius:10px;font-size:14px}
    .place-num{width:22px;height:22px;border-radius:50%;background:#e94560;color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
    .rec-panel{background:linear-gradient(135deg,#f8f9ff,#fff5f7);border-radius:20px;padding:28px;margin-top:32px;border:2px solid rgba(233,69,96,0.15)}
    .rec-header{display:flex;align-items:center;gap:14px;margin-bottom:20px;flex-wrap:wrap}
    .rec-header h3{font-size:1.1rem;color:#1a1a2e}
    .rec-badge{font-size:11px;background:rgba(76,175,80,0.1);color:#2e7d32;padding:4px 12px;border-radius:50px;font-weight:600;border:1px solid rgba(76,175,80,0.2)}
    .rec-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:20px}
    .rec-card{background:white;border-radius:14px;padding:16px;border:1px solid #e8ecf4}
    .rc-title{font-size:12px;color:#6c7293;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}
    .rc-value{font-size:1.1rem;font-weight:700;color:#1a1a2e;margin-bottom:4px}
    .rc-reason{font-size:12px;color:#6c7293}
    .packing-list{margin-top:16px}
    .packing-list h4{margin-bottom:10px;font-size:15px}
    .pack-items{display:flex;flex-wrap:wrap;gap:8px}
    .pack-item{background:white;padding:6px 14px;border-radius:50px;font-size:13px;border:1px solid #e8ecf4}
    .safety-tips{margin-top:16px;background:#fff8e1;border-radius:12px;padding:16px}
    .safety-tips h4{margin-bottom:10px;color:#e65100}
    .safety-tips ul{list-style:none;display:flex;flex-direction:column;gap:6px}
    .safety-tips li{font-size:13px;color:#4a4a6a;padding-left:16px;position:relative}
    .safety-tips li::before{content:'→';position:absolute;left:0;color:#e65100}
    .weather-months{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
    .wm-card{background:white;border-radius:12px;padding:12px;border:2px solid #e8ecf4;text-align:center;font-size:13px}
    .wm-card.best{border-color:#4caf50;background:#f1f8e9}
    .wmc-month{font-weight:700;margin-bottom:4px;color:#1a1a2e}
    .wmc-temp{color:#e94560;font-weight:600;font-size:12px}
    .wmc-rain{font-size:11px;color:#6c7293}
    .wmc-desc{font-size:11px;color:#9e9e9e;margin-top:2px}
    .wmc-badge{font-size:10px;color:#2e7d32;font-weight:700;margin-top:4px}
    .dress-guide{background:#f8f9ff;padding:16px;border-radius:12px}
    .dress-guide h4{margin-bottom:10px}
    .dress-items{display:flex;flex-wrap:wrap;gap:8px}
    .dress-item{background:white;padding:6px 12px;border-radius:50px;font-size:13px;border:1px solid #e8ecf4}
    .map-controls{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
    .poi-btn{padding:8px 16px;border-radius:50px;border:2px solid #e8ecf4;background:white;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;color:#6c7293;transition:all 0.2s}
    .poi-btn.active{background:#e94560;border-color:#e94560;color:white}
    .poi-list{margin-top:20px}
    .poi-list h4{margin-bottom:12px}
    .poi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
    .poi-card{background:white;border-radius:12px;padding:14px;border:1px solid #e8ecf4;font-size:13px}
    .poc-name{font-weight:600;margin-bottom:4px;color:#1a1a2e}
    .poc-info{color:#6c7293;font-size:12px}
    .poc-stars{color:#f0a500;margin-top:4px}
    .food-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:14px}
    .food-card{background:white;border-radius:14px;padding:20px 12px;text-align:center;border:2px solid #e8ecf4;transition:border-color 0.2s}
    .food-card:hover{border-color:#e94560}
    .food-emoji{font-size:32px;margin-bottom:8px}
    .food-name{font-size:13px;font-weight:600;color:#2d2d44}
    .hotel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;margin-top:16px}
    .hotel-card{background:white;border-radius:14px;padding:18px;border:2px solid #e8ecf4}
    .hotel-stars{color:#f0a500;margin-bottom:6px}
    .hotel-card h4{font-size:14px;margin-bottom:4px}
    .hotel-price{font-size:1.1rem;font-weight:700;color:#e94560;margin-bottom:8px}
    .festival-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
    .festival-card{background:white;border-radius:14px;padding:22px;border-left:4px solid #e94560;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
    .festival-month{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#e94560;margin-bottom:6px}
    .festival-card h3{font-size:1rem;margin-bottom:6px;color:#1a1a2e}
    .festival-card p{font-size:13px;color:#6c7293}
    .transport-from{margin-bottom:28px}
    .transport-from h3{font-size:1rem;margin-bottom:12px;color:#1a1a2e}
    .transport-modes{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
    .transport-mode{display:flex;align-items:center;gap:14px;background:white;padding:18px;border-radius:14px;border:2px solid #e8ecf4}
    .tm-icon{font-size:28px;flex-shrink:0}
    .tm-info{flex:1;display:flex;flex-direction:column;gap:3px;font-size:13px;color:#6c7293}
    .tm-info strong{font-size:14px;color:#1a1a2e}
    .reviews-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .star-rating{display:flex;gap:6px;margin-bottom:16px}
    .rating-star{font-size:28px;color:#e8ecf4;cursor:pointer;transition:color 0.1s}
    .rating-star.active{color:#f0a500}
    .reviews-list{display:flex;flex-direction:column;gap:14px}
    .review-card{background:white;border-radius:14px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
    .review-header{display:flex;align-items:center;gap:12px;margin-bottom:10px}
    .reviewer-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#e94560,#0f3460);color:white;display:flex;align-items:center;justify-content:center;font-weight:700}
    .review-stars{color:#f0a500;font-size:13px}
    .review-card h4{font-size:14px;margin-bottom:4px;color:#1a1a2e}
    .review-card p{font-size:13px;color:#6c7293}
    .sticky-book-bar{position:fixed;bottom:0;left:0;right:0;background:white;box-shadow:0 -4px 24px rgba(0,0,0,0.1);z-index:500;padding:14px 0}
    .sbb-inner{display:flex;justify-content:space-between;align-items:center}
    .sbb-inner>div{display:flex;flex-direction:column;font-size:13px;color:#6c7293}
    .sbb-inner>div strong{font-size:1rem;color:#1a1a2e}
    .sbb-actions{display:flex;gap:10px}
    @media(max-width:768px){.budget-cards{grid-template-columns:1fr}.rec-grid{grid-template-columns:1fr}.weather-months{grid-template-columns:repeat(2,1fr)}}
  `]
})
export class DestinationDetailComponent implements OnInit {
  dest: Destination | null = null;
  loading = true;
  activeTab = 'overview';
  selectedBudget = 'MID';
  reviews: Review[] = [];
  showReviewForm = false;
  newReview = { rating: 5, title: '', content: '' };
  recommendation: any = null;
  pois: any[] = [];
  activePoi = 'HOTEL';
  tabs = [
    {key:'overview',icon:'ℹ️',label:'Overview'},
    {key:'weather',icon:'🌤',label:'Live Weather'},
    {key:'map',icon:'🗺',label:'Map & POIs'},
    {key:'food',icon:'🍛',label:'Food & Hotels'},
    {key:'festivals',icon:'🎉',label:'Festivals'},
    {key:'transport',icon:'✈',label:'Transport'},
    {key:'reviews',icon:'⭐',label:'Reviews'}
  ];
  poiTypes = [{key:'HOTEL',icon:'🏨',label:'Hotels'},{key:'RESTAURANT',icon:'🍽',label:'Restaurants'},{key:'ATTRACTION',icon:'🏛',label:'Attractions'},{key:'HOSPITAL',icon:'🏥',label:'Hospitals'},{key:'ATM',icon:'🏧',label:'ATMs'}];
  foodEmojis = ['🍛','🥘','🍜','🥗','🍱','🥙','🍢','🫕'];

  get parsedFamousPlaces(): string[] { try { return JSON.parse(this.dest?.famousPlaces || '[]'); } catch { return []; } }
  get parsedFood(): string[] { try { return JSON.parse(this.dest?.localFood || '[]'); } catch { return []; } }
  get parsedHotels(): any[] { try { return JSON.parse(this.dest?.hotels || '[]'); } catch { return []; } }
  get parsedFestivals(): any[] { try { return JSON.parse(this.dest?.festivals || '[]'); } catch { return []; } }
  get parsedDresses(): string[] { try { return JSON.parse(this.dest?.recommendedDresses || '[]'); } catch { return []; } }
  get weatherMonths(): {key:string,val:any}[] {
    try { const w = JSON.parse(this.dest?.weatherByMonth||'{}'); return Object.keys(w).map(k=>({key:k,val:w[k]})); } catch { return []; }
  }
  get transportKeys(): string[] { try { return Object.keys(JSON.parse(this.dest?.transportOptions||'{}')); } catch { return []; } }

  constructor(private route: ActivatedRoute, private destService: DestinationService,
    private reviewService: ReviewService, private recService: RecommendationService,
    public auth: AuthService, private router: Router, private http: HttpClient,
    private chatContext: ChatContextService) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.destService.getById(+p['id']).subscribe({
        next: res => {
          this.dest = res.data;
          this.loading = false;
          this.loadReviews();
          this.loadRecommendations();
          this.syncChatContext();
        },
        error: () => this.loading = false
      });
    });
  }

  loadReviews() {
    if (this.dest) this.reviewService.getByDestination(this.dest.name).subscribe({ next: r => this.reviews = r.data||[], error: ()=>{} });
  }

  loadRecommendations() {
    if (!this.dest) return;
    this.recService.getRecommendations({ destination: this.dest.name, budget: this.selectedBudget, people: 2, days: 5, month: new Date().toLocaleString('default',{month:'long'}) })
      .subscribe({ next: r => this.recommendation = r.data, error: ()=>{} });
  }

  setSelectedBudget(value: string) {
    this.selectedBudget = value;
    this.loadRecommendations();
    this.syncChatContext();
  }

  syncChatContext() {
    if (!this.dest) return;
    this.chatContext.updateContext({
      destination: this.dest.name,
      durationDays: 5,
      budgetType: this.selectedBudget,
      transportMode: '',
      from: '',
      to: this.dest.name,
      people: 2
    });
  }

  loadPois(type: string) {
    this.activePoi = type;
    if (!this.dest) return;
    // Load via Overpass API through backend
    const params = `lat=${this.dest.latitude}&lon=${this.dest.longitude}&type=${type}&radius=3000`;
    this.http.get<any>(`http://localhost:8080/api/pois?${params}`).subscribe({
      next: (r) => this.pois = r.data || [],
      error: () => this.pois = []
    });
  }

  getStars(n: number): number[] { return Array(n).fill(0); }
  getStarStr(n: string): string { return '★'.repeat(parseInt(n)||0); }
  isGoodMonth(m: string): boolean { return this.dest?.bestSeason?.includes(m) || false; }
  getBudgetPrice(): number {
    if (!this.dest) return 0;
    return this.selectedBudget==='LOW'?this.dest.lowBudgetPerDay:this.selectedBudget==='MID'?this.dest.midBudgetPerDay:this.dest.luxuryBudgetPerDay;
  }
  getTransportModes(from: string): {key:string,val:any}[] {
    try { const t=JSON.parse(this.dest?.transportOptions||'{}'); const f=t[from]; return Object.keys(f).map(k=>({key:k,val:f[k]})); } catch { return []; }
  }
  getTransportIcon(mode: string): string {
    const icons:any={FLIGHT:'✈️',TRAIN:'🚂',BUS:'🚌',CAR:'🚗',METRO:'🚇',CAB:'🚕'}; return icons[mode]||'🚍';
  }
  searchTransport(from: string, mode: string) { this.router.navigate(['/booking'],{queryParams:{from,to:this.dest?.name,type:mode}}); }
  planTrip() {
    if (!this.auth.isLoggedIn) { this.router.navigate(['/auth/login']); return; }
    this.router.navigate(['/planner'],{queryParams:{to:this.dest?.name,budget:this.selectedBudget}});
  }
  submitReview() {
    if (!this.dest) return;
    this.reviewService.addReview({destination:this.dest.name,...this.newReview}).subscribe({
      next:()=>{this.loadReviews();this.showReviewForm=false;this.newReview={rating:5,title:'',content:''};}, error:()=>{}
    });
  }
}
