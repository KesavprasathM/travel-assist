import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { DestinationService } from '../../services/destination.service';
import { Destination } from '../../models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="payment-page container">
    <div class="payment-container" *ngIf="!success">
      <div class="payment-left">
        <h2>Complete Your Booking</h2>
        <div class="subheading">Choose a secure payment method to confirm your trip.</div>

        <div class="payment-card" *ngIf="dest">
          <div class="card-image" [ngStyle]="{'background-image': 'url(' + dest.imageUrl + ')'}"></div>
          <div class="card-body">
            <span class="tag">Destination</span>
            <h3>{{ dest.name }}</h3>
            <p>{{ dest.description }}</p>
            <div class="price-row">
              <span>Selected plan</span>
              <strong>₹{{ amount | number }}</strong>
            </div>
            <div class="price-breakdown">
              <div><span>Low budget</span><strong>₹{{ dest.lowBudgetPerDay }}</strong></div>
              <div><span>Mid budget</span><strong>₹{{ dest.midBudgetPerDay }}</strong></div>
              <div><span>Luxury</span><strong>₹{{ dest.luxuryBudgetPerDay }}</strong></div>
            </div>
          </div>
        </div>

        <div class="method-tabs">
          <button *ngFor="let m of methods" [class.active]="selectedMethod===m.key" (click)="selectedMethod=m.key">
            <span class="method-icon" [innerHTML]="m.icon"></span> {{m.label}}
          </button>
        </div>

        <div class="payment-form">
          <ng-container [ngSwitch]="selectedMethod">
            <div *ngSwitchCase="'CARD'">
              <div class="card-preview" [class.flipped]="showCardBack">
                <div class="card-front">
                  <div class="card-chip">
                    <!-- EMV Chip SVG -->
                    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="34" height="26" rx="4" fill="#D4A017" stroke="#B8860B" stroke-width="1"/>
                      <rect x="12" y="1" width="12" height="26" fill="#C8941A" stroke="#B8860B" stroke-width="0.5"/>
                      <rect x="1" y="9" width="34" height="10" fill="#C8941A" stroke="#B8860B" stroke-width="0.5"/>
                      <rect x="12" y="9" width="12" height="10" fill="#E8B820" stroke="#B8860B" stroke-width="0.5"/>
                    </svg>
                  </div>
                  <div class="card-number">{{ formatCardDisplay(card.number) }}</div>
                  <div class="card-bottom">
                    <div>
                      <div class="card-label">Card Holder</div>
                      <div class="card-val">{{ card.name || 'YOUR NAME' }}</div>
                    </div>
                    <div>
                      <div class="card-label">Expires</div>
                      <div class="card-val">{{ card.expiry || 'MM/YY' }}</div>
                    </div>
                  </div>
                </div>
                <div class="card-back">
                  <div class="card-strip"></div>
                  <div class="card-cvv-wrap">CVV: <span>{{ card.cvv || '•••' }}</span></div>
                </div>
              </div>
              <div class="form-group">
                <label>Card Number</label>
                <input type="text" [(ngModel)]="card.number" placeholder="1234 5678 9012 3456" maxlength="19"
                  (input)="formatCardNumber($event)" (focus)="showCardBack=false">
              </div>
              <div class="form-group">
                <label>Card Holder Name</label>
                <input type="text" [(ngModel)]="card.name" placeholder="Name as on card" (focus)="showCardBack=false">
              </div>
              <div class="grid-2">
                <div class="form-group">
                  <label>Expiry Date</label>
                  <input type="text" [(ngModel)]="card.expiry" placeholder="MM/YY" maxlength="5" (focus)="showCardBack=false">
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input type="password" [(ngModel)]="card.cvv" placeholder="•••" maxlength="3" (focus)="showCardBack=true" (blur)="showCardBack=false">
                </div>
              </div>
              <div class="card-types">
                <span class="card-type-logo">
                  <!-- Visa SVG -->
                  <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="16" rx="2" fill="#1A1F71"/>
                    <path d="M20.5 11.5H18.1L19.6 4.5H22L20.5 11.5Z" fill="white"/>
                    <path d="M16.2 4.5L14 9.3L13.7 7.9L13.7 7.9L12.9 5.2C12.9 5.2 12.8 4.5 11.9 4.5H8.1L8 4.7C8 4.7 9.1 4.9 10.4 5.7L12.5 11.5H15L18.8 4.5H16.2Z" fill="white"/>
                    <path d="M37.4 11.5H39.5L37.7 4.5H35.7C34.9 4.5 34.7 5.1 34.7 5.1L31.1 11.5H33.5L34 10.1H36.9L37.4 11.5ZM34.7 8.4L35.9 5.2L36.6 8.4H34.7Z" fill="white"/>
                    <path d="M31.5 6.3L31.8 4.7C31.8 4.7 30.8 4.4 29.7 4.4C28.5 4.4 25.7 4.9 25.7 7.3C25.7 9.5 28.7 9.5 28.7 10.7C28.7 11.9 26 11.6 25.1 10.9L24.8 12.6C24.8 12.6 25.8 13 27.3 13C28.8 13 31.8 12.3 31.8 9.8C31.8 7.5 28.7 7.3 28.7 6.2C28.7 5.1 30.9 5.3 31.5 6.3Z" fill="white"/>
                  </svg>
                </span>
                <span class="card-type-logo">
                  <!-- Mastercard SVG -->
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="10" r="8" fill="#EB001B"/>
                    <circle cx="20" cy="10" r="8" fill="#F79E1B"/>
                    <path d="M16 4.27C17.56 5.42 18.6 7.1 18.6 10C18.6 12.9 17.56 14.58 16 15.73C14.44 14.58 13.4 12.9 13.4 10C13.4 7.1 14.44 5.42 16 4.27Z" fill="#FF5F00"/>
                  </svg>
                </span>
                <span class="card-type-logo">
                  <!-- RuPay SVG -->
                  <svg width="44" height="18" viewBox="0 0 44 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="44" height="18" rx="2" fill="#006B3E"/>
                    <text x="5" y="13" font-family="Arial" font-weight="bold" font-size="9" fill="white">Ru</text>
                    <text x="19" y="13" font-family="Arial" font-weight="bold" font-size="9" fill="#FF9933">Pay</text>
                  </svg>
                </span>
                <span class="card-type-logo">
                  <!-- Amex SVG -->
                  <svg width="42" height="16" viewBox="0 0 42 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="42" height="16" rx="2" fill="#2E77BC"/>
                    <text x="4" y="12" font-family="Arial" font-weight="bold" font-size="8" fill="white">AMEX</text>
                    <path d="M30 4L34 8L30 12M34 8H24" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            <div *ngSwitchCase="'UPI'">
              <div class="upi-apps">
                <div *ngFor="let a of upiApps" class="upi-app" [class.active]="upiApp===a.id" (click)="upiApp=a.id">
                  <div class="upi-icon" [innerHTML]="a.icon"></div>
                  <div>{{ a.label }}</div>
                </div>
              </div>
              <div class="form-group">
                <label>UPI ID</label>
                <input type="text" [(ngModel)]="upiId" placeholder="yourname@upi" (input)="validateUpi()">
                <div class="upi-status" *ngIf="upiId">
                  <span [class.valid]="upiValid" [class.invalid]="!upiValid">
                    <ng-container *ngIf="upiValid">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:4px"><circle cx="7" cy="7" r="7" fill="#16a34a"/><path d="M4 7.5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      Valid UPI ID
                    </ng-container>
                    <ng-container *ngIf="!upiValid">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="vertical-align:middle;margin-right:4px"><circle cx="7" cy="7" r="7" fill="#dc2626"/><path d="M5 5l4 4M9 5l-4 4" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
                      Enter valid UPI ID
                    </ng-container>
                  </span>
                </div>
              </div>
              <div class="upi-qr" *ngIf="upiApp==='qr'">
                <div class="qr-box"><div class="qr-grid"><div *ngFor="let c of qrCells" [class.filled]="c" class="qr-cell"></div></div></div>
                <p>Scan with any UPI app</p>
              </div>
            </div>

            <div *ngSwitchCase="'NETBANKING'">
              <div class="banks-grid">
                <div *ngFor="let b of banks" class="bank-option" [class.active]="selectedBank===b.name" (click)="selectedBank=b.name">
                  <div class="bank-icon" [innerHTML]="b.icon"></div>
                  <div>{{ b.name }}</div>
                </div>
              </div>
              <div class="form-group" *ngIf="selectedBank">
                <label>Selected Bank</label>
                <input type="text" [value]="selectedBank" readonly>
              </div>
            </div>

            <div *ngSwitchCase="'WALLET'">
              <div class="banks-grid">
                <div *ngFor="let w of wallets" class="bank-option" [class.active]="selectedWallet===w.name" (click)="selectedWallet=w.name">
                  <div class="bank-icon" [innerHTML]="w.icon"></div>
                  <div>{{ w.name }}</div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>

        <div class="error-msg" *ngIf="error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="vertical-align:middle;margin-right:6px"><circle cx="8" cy="8" r="8" fill="#991b1b"/><path d="M8 5v3M8 10.5v.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ error }}
        </div>

        <button class="btn btn-primary pay-btn" (click)="processPayment()" [disabled]="loading">
          <ng-container *ngIf="loading">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="vertical-align:middle;margin-right:6px;animation:spin 1s linear infinite"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.4)" stroke-width="2"/><path d="M8 2a6 6 0 0 1 6 6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            Processing...
          </ng-container>
          <ng-container *ngIf="!loading">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="vertical-align:middle;margin-right:6px"><rect x="1" y="4" width="14" height="10" rx="2" stroke="white" stroke-width="1.5"/><path d="M1 7h14" stroke="white" stroke-width="1.5"/><path d="M4 11h2M9 11h3" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
            Pay ₹{{ amount | number }}
          </ng-container>
        </button>
      </div>

      <div class="payment-right">
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="os-row"><span>Booking ID</span><strong>#{{ bookingId || '000000' }}</strong></div>
          <div class="os-row"><span>Destination</span><strong>{{ dest?.name || 'Tripx Package' }}</strong></div>
          <div class="os-row"><span>Base Fare</span><strong>₹{{ (amount * 0.82) | number:'1.0-0' }}</strong></div>
          <div class="os-row"><span>Taxes & Fees</span><strong>₹{{ (amount * 0.18) | number:'1.0-0' }}</strong></div>
          <div class="os-divider"></div>
          <div class="os-row total"><span>Total Amount</span><strong>₹{{ amount | number }}</strong></div>
        </div>
        <div class="security-features">
          <h4>Booking Benefits</h4>
          <div class="sf-item">
            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L4 5v6c0 4.4 3 8.5 7 9.9 4-1.4 7-5.5 7-9.9V5L11 2z" fill="#4338ca" fill-opacity="0.15" stroke="#4338ca" stroke-width="1.5"/><path d="M8 11l2 2 4-4" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <p>Secure payment gateway</p>
          </div>
          <div class="sf-item">
            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="#4338ca" stroke-width="1.5"/><path d="M11 7v4l3 3" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/></svg>
            </span>
            <p>Flexible travel support</p>
          </div>
          <div class="sf-item">
            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="4" width="18" height="14" rx="2" stroke="#4338ca" stroke-width="1.5"/><path d="M2 8h18" stroke="#4338ca" stroke-width="1.5"/><path d="M6 13h2M10 13h6" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/></svg>
            </span>
            <p>Instant email confirmation</p>
          </div>
          <div class="sf-item">
            <span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 4h14a2 2 0 0 1 2 2v1H2V6a2 2 0 0 1 2-2z" fill="#4338ca" fill-opacity="0.15" stroke="#4338ca" stroke-width="1.5"/><path d="M2 7h18v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" stroke="#4338ca" stroke-width="1.5"/><path d="M6 12h10M6 15h6" stroke="#4338ca" stroke-width="1.5" stroke-linecap="round"/></svg>
            </span>
            <p>Invoice sent automatically</p>
          </div>
        </div>
      </div>
    </div>

    <div class="success-screen" *ngIf="success">
      <div class="success-animation">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="36" fill="#dcfce7"/>
          <circle cx="36" cy="36" r="26" fill="#16a34a"/>
          <path d="M24 37l8 8 16-16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2>Payment Successful!</h2>
      <p>Your booking is confirmed. Enjoy your trip!</p>
      <div class="success-details">
        <div class="sd-row"><span>Transaction ID</span><strong>{{ transactionId }}</strong></div>
        <div class="sd-row"><span>Amount Paid</span><strong>₹{{ amount | number }}</strong></div>
        <div class="sd-row"><span>Method</span><strong>{{ selectedMethod }}</strong></div>
        <div class="sd-row"><span>Status</span><strong class="text-success">Confirmed</strong></div>
      </div>
      <div class="success-actions">
        <button class="btn btn-secondary" (click)="router.navigate(['/'])">Back to Home</button>
        <button class="btn btn-primary" (click)="router.navigate(['/feedback'])">Leave Feedback</button>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .payment-page { padding: 36px 0 80px; }
    .payment-container { display: grid; grid-template-columns: 1fr 360px; gap: 32px; max-width: 1080px; margin: 0 auto; }
    .payment-left { background: #fff; border-radius: 28px; padding: 32px; box-shadow: 0 20px 55px rgba(25, 42, 77, 0.08); }
    .payment-right { display: flex; flex-direction: column; gap: 24px; }
    h2 { margin: 0; font-size: 2rem; color: #101828; }
    .subheading { margin: 12px 0 28px; color: #475467; font-size: 0.98rem; }
    .payment-card { display: grid; grid-template-columns: 140px 1fr; gap: 20px; background: linear-gradient(135deg,#f8fafc,#eef2ff); border-radius: 28px; overflow: hidden; margin-bottom: 28px; border: 1px solid rgba(99,102,241,0.15); }
    .card-image { min-height: 180px; background-size: cover; background-position: center; }
    .card-body { padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
    .tag { display: inline-flex; padding: 6px 12px; border-radius: 999px; background: #ecebff; color: #4338ca; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    .payment-card h3 { margin: 16px 0 12px; font-size: 1.25rem; color: #111827; }
    .payment-card p { margin: 0 0 16px; color: #475467; line-height: 1.6; font-size: 0.95rem; }
    .price-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 10px; font-weight: 700; color: #0f172a; }
    .price-breakdown { display: grid; gap: 10px; margin-top: 18px; }
    .price-breakdown div { display: flex; justify-content: space-between; color: #475467; font-size: 0.93rem; }
    .method-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
    .method-tabs button { display: flex; align-items: center; gap: 8px; padding: 12px 18px; border: 1px solid #e2e8f0; background: #fff; border-radius: 16px; font-weight: 600; color: #334155; cursor: pointer; transition: all 0.2s ease; }
    .method-tabs button.active { background: #eef2ff; border-color: #c7d2fe; color: #4338ca; }
    .method-icon { display: flex; align-items: center; }
    .payment-form { display: grid; gap: 20px; }
    .card-preview { width: 100%; height: 200px; perspective: 1000px; position: relative; }
    .card-front, .card-back { position: absolute; inset: 0; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; backface-visibility: hidden; transition: transform 0.6s ease; }
    .card-front { background: linear-gradient(135deg,#4338ca,#2563eb); color: #fff; }
    .card-back { background: linear-gradient(135deg,#1e293b,#0f172a); color: #fff; transform: rotateY(180deg); }
    .card-preview.flipped .card-front { transform: rotateY(180deg); }
    .card-preview.flipped .card-back { transform: rotateY(0); }
    .card-chip { display: flex; align-items: center; }
    .card-number { font-size: 1.4rem; letter-spacing: 4px; font-weight: 700; text-align: center; margin: 16px 0; }
    .card-bottom { display: flex; justify-content: space-between; gap: 18px; }
    .card-label { font-size: 10px; text-transform: uppercase; opacity: 0.65; letter-spacing: 0.1em; margin-bottom: 4px; }
    .card-val { font-size: 14px; font-weight: 700; }
    .card-strip { height: 42px; background: rgba(255,255,255,0.18); border-radius: 14px; margin-top: 14px; }
    .card-cvv-wrap { background: rgba(255,255,255,0.12); padding: 12px 16px; border-radius: 16px; font-size: 14px; }
    .card-types { display: flex; align-items: center; gap: 10px; padding: 14px 0 0; flex-wrap: wrap; }
    .card-type-logo { display: flex; align-items: center; }
    .upi-apps { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
    .upi-app { border: 1px solid #e2e8f0; border-radius: 20px; padding: 14px 12px; text-align: center; cursor: pointer; transition: all 0.2s; font-size: 13px; }
    .upi-app.active { border-color: #c7d2fe; background: #eef2ff; }
    .upi-icon { display: flex; justify-content: center; margin-bottom: 6px; }
    .upi-status { margin-top: 8px; font-size: 13px; display: flex; align-items: center; }
    .upi-status .valid { color: #16a34a; display: flex; align-items: center; }
    .upi-status .invalid { color: #dc2626; display: flex; align-items: center; }
    .upi-qr { padding: 16px; background: #f8fafc; border-radius: 18px; text-align: center; }
    .qr-box { width: 150px; height: 150px; margin: 0 auto 12px; border: 3px solid #0f172a; border-radius: 18px; padding: 10px; }
    .qr-grid { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap: 2px; height: 100%; }
    .qr-cell { background: #e2e8f0; border-radius: 2px; }
    .qr-cell.filled { background: #0f172a; }
    .banks-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
    .bank-option { border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px 12px; text-align: center; cursor: pointer; transition: all 0.2s; display: grid; place-items: center; gap: 8px; font-weight: 600; font-size: 13px; }
    .bank-option.active { border-color: #c7d2fe; background: #eef2ff; }
    .bank-icon { display: flex; justify-content: center; align-items: center; }
    .form-group { display: grid; gap: 8px; }
    .form-group label { font-weight: 700; color: #334155; }
    .form-group input { width: 100%; border-radius: 16px; border: 1px solid #e2e8f0; padding: 14px 16px; font-size: 0.95rem; color: #0f172a; box-sizing: border-box; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; }
    .pay-btn { width: 100%; padding: 18px; border-radius: 20px; border: none; color: #fff; font-size: 1rem; background: linear-gradient(135deg,#4338ca,#2563eb); cursor: pointer; margin-top: 4px; display: flex; align-items: center; justify-content: center; }
    .error-msg { margin-top: 12px; padding: 14px 16px; border-radius: 16px; background: #fee2e2; color: #991b1b; display: flex; align-items: center; }
    .order-summary, .security-features, .success-details { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08); }
    .order-summary h3, .security-features h4 { margin-bottom: 18px; color: #0f172a; }
    .os-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f8fafc; color: #475467; }
    .os-row.total { font-size: 1rem; font-weight: 700; color: #111827; }
    .os-divider { height: 2px; background: #eff6ff; margin: 10px 0; }
    .os-row.total strong { color: #4338ca; }
    .security-features .sf-item { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
    .security-features .sf-item:last-child { border-bottom: none; }
    .security-features span { display: flex; align-items: center; }
    .success-screen { text-align: center; max-width: 520px; margin: 0 auto; }
    .success-animation { display: flex; justify-content: center; margin-bottom: 24px; }
    .success-screen h2 { font-size: 2.2rem; color: #0f766e; margin-bottom: 10px; }
    .success-screen p { color: #475467; margin-bottom: 24px; }
    .sd-row { display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
    .sd-row:last-child { border-bottom: none; }
    .text-success { color: #16a34a; font-weight: 700; }
    .success-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
    .btn-secondary { background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; padding: 14px 20px; border-radius: 18px; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg,#4338ca,#2563eb); color: #fff; border: none; padding: 14px 20px; border-radius: 18px; cursor: pointer; }
    .btn-secondary:hover, .btn-primary:hover { opacity: 0.95; }
    @media (max-width: 980px) { .payment-container { grid-template-columns: 1fr; } .payment-card { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } .upi-apps, .banks-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
    `
  ]
})
export class PaymentComponent implements OnInit {
  bookingId = 0;
  amount = 0;
  selectedMethod = 'CARD';
  loading = false;
  error = '';
  success = false;
  transactionId = '';
  showCardBack = false;
  upiId = '';
  upiValid = false;
  upiApp = 'gpay';
  selectedBank = '';
  selectedWallet = '';
  dest?: Destination;

  card = { number: '', name: '', expiry: '', cvv: '' };

  methods = [
    {
      key: 'CARD',
      label: 'Card',
      icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="4" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M1 7.5h16" stroke="currentColor" stroke-width="1.5"/>
        <path d="M4 12h3M10 12h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`
    },
    {
      key: 'UPI',
      label: 'UPI',
      icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="16" height="16" rx="3" fill="#4B0082" fill-opacity="0.1" stroke="#4B0082" stroke-width="1.2"/>
        <text x="3" y="13" font-family="Arial" font-weight="bold" font-size="8" fill="#4B0082">UPI</text>
      </svg>`
    },
    {
      key: 'NETBANKING',
      label: 'Net Banking',
      icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 7l8-5 8 5v1H1V7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        <rect x="3" y="8" width="2" height="5" rx="0.5" stroke="currentColor" stroke-width="1.2"/>
        <rect x="8" y="8" width="2" height="5" rx="0.5" stroke="currentColor" stroke-width="1.2"/>
        <rect x="13" y="8" width="2" height="5" rx="0.5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M1 13.5h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`
    },
    {
      key: 'WALLET',
      label: 'Wallet',
      icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="5" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/>
        <path d="M1 8.5h16" stroke="currentColor" stroke-width="1.3"/>
        <path d="M13 12.5h1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M4 3l3-2h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`
    }
  ];

  upiApps = [
    {
      id: 'gpay',
      label: 'GPay',
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill="#white"/>
        <text x="5" y="24" font-family="Arial" font-weight="900" font-size="13" fill="#4285F4">G</text>
        <text x="14" y="24" font-family="Arial" font-weight="900" font-size="13" fill="#EA4335">P</text>
        <text x="22" y="24" font-family="Arial" font-weight="900" font-size="13" fill="#34A853">a</text>
        <text x="29" y="24" font-family="Arial" font-weight="900" font-size="13" fill="#FBBC05">y</text>
      </svg>`
    },
    {
      id: 'phonepe',
      label: 'PhonePe',
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill="#5F259F"/>
        <path d="M18 6C14.8 6 12 7.8 10.5 10.5L13 10.5C14.2 8.8 15.9 7.8 18 7.8C21.4 7.8 24.2 10.6 24.2 14C24.2 17.4 21.4 20.2 18 20.2H16V22H18C22.4 22 26 18.4 26 14C26 9.6 22.4 6 18 6Z" fill="white"/>
        <path d="M16 20.2L11 30H13.2L16 24.8V20.2Z" fill="white"/>
      </svg>`
    },
    {
      id: 'paytm',
      label: 'Paytm',
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill="#00BAF2"/>
        <rect x="6" y="13" width="24" height="10" rx="2" fill="white"/>
        <text x="8" y="21" font-family="Arial" font-weight="bold" font-size="8" fill="#00BAF2">Paytm</text>
      </svg>`
    },
    {
      id: 'qr',
      label: 'QR Code',
      icon: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="12" height="12" rx="2" stroke="#0f172a" stroke-width="2"/>
        <rect x="7" y="7" width="6" height="6" fill="#0f172a"/>
        <rect x="20" y="4" width="12" height="12" rx="2" stroke="#0f172a" stroke-width="2"/>
        <rect x="23" y="7" width="6" height="6" fill="#0f172a"/>
        <rect x="4" y="20" width="12" height="12" rx="2" stroke="#0f172a" stroke-width="2"/>
        <rect x="7" y="23" width="6" height="6" fill="#0f172a"/>
        <rect x="20" y="20" width="4" height="4" fill="#0f172a"/>
        <rect x="28" y="20" width="4" height="4" fill="#0f172a"/>
        <rect x="20" y="28" width="4" height="4" fill="#0f172a"/>
        <rect x="28" y="28" width="4" height="4" fill="#0f172a"/>
        <rect x="24" y="24" width="4" height="4" fill="#0f172a"/>
      </svg>`
    }
  ];

  banks = [
    {
      name: 'SBI',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#22409A"/>
        <path d="M8 22C10 18 12 16 16 15.5C20 16 22 18 24 22" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <circle cx="16" cy="12" r="3.5" stroke="white" stroke-width="1.8"/>
        <path d="M6 25h20" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'HDFC',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#ED1C24"/>
        <text x="4" y="21" font-family="Arial" font-weight="bold" font-size="9" fill="white">HDFC</text>
      </svg>`
    },
    {
      name: 'ICICI',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#F47920"/>
        <text x="3" y="21" font-family="Arial" font-weight="bold" font-size="8" fill="white">ICICI</text>
      </svg>`
    },
    {
      name: 'Axis Bank',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#97144D"/>
        <text x="4" y="21" font-family="Arial" font-weight="bold" font-size="9" fill="white">AXIS</text>
      </svg>`
    },
    {
      name: 'Kotak',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#E31837"/>
        <text x="3" y="21" font-family="Arial" font-weight="bold" font-size="7.5" fill="white">KOTAK</text>
      </svg>`
    },
    {
      name: 'PNB',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#003399"/>
        <text x="6" y="21" font-family="Arial" font-weight="bold" font-size="10" fill="white">PNB</text>
      </svg>`
    },
    {
      name: 'Yes Bank',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#003087"/>
        <text x="4" y="21" font-family="Arial" font-weight="bold" font-size="9" fill="white">YES</text>
      </svg>`
    },
    {
      name: 'Bank of Baroda',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#F47920"/>
        <text x="4" y="15" font-family="Arial" font-weight="bold" font-size="7.5" fill="white">Bank</text>
        <text x="4" y="25" font-family="Arial" font-weight="bold" font-size="7.5" fill="white">Baroda</text>
      </svg>`
    }
  ];

  wallets = [
    {
      name: 'Paytm',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#00BAF2"/>
        <rect x="4" y="11" width="24" height="10" rx="2" fill="white"/>
        <text x="5" y="19" font-family="Arial" font-weight="bold" font-size="7.5" fill="#00BAF2">Paytm</text>
      </svg>`
    },
    {
      name: 'Amazon Pay',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#FF9900"/>
        <text x="4" y="14" font-family="Arial" font-weight="bold" font-size="7" fill="white">amazon</text>
        <text x="8" y="24" font-family="Arial" font-weight="bold" font-size="8" fill="white">pay</text>
      </svg>`
    },
    {
      name: 'MobiKwik',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#49197C"/>
        <text x="3" y="20" font-family="Arial" font-weight="bold" font-size="7" fill="white">Mobi</text>
        <text x="3" y="28" font-family="Arial" font-weight="bold" font-size="7" fill="#29CDFF">Kwik</text>
      </svg>`
    },
    {
      name: 'Freecharge',
      icon: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#00BCD4"/>
        <path d="M10 16h12M16 10v12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="16" cy="16" r="8" stroke="white" stroke-width="1.5"/>
      </svg>`
    }
  ];

  qrCells: boolean[] = Array.from({ length: 144 }, () => Math.random() > 0.5);

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    public router: Router,
    private destinationService: DestinationService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.bookingId = +params['bookingId'] || Math.floor(100000 + Math.random() * 900000);
      this.amount = +params['amount'] || 0;
      const destinationId = +params['destinationId'] || 0;

      if (destinationId) {
        this.destinationService.getById(destinationId).subscribe({
          next: response => {
            this.dest = response.data;
            if (!this.amount) {
              this.amount = this.dest.midBudgetPerDay || this.dest.lowBudgetPerDay || this.dest.luxuryBudgetPerDay || 12999;
            }
          },
          error: () => {
            if (!this.amount) {
              this.amount = 12999;
            }
          }
        });
      } else if (!this.amount) {
        this.amount = 12999;
      }
    });
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '').substring(0, 16);
    this.card.number = value.replace(/(.{4})/g, '$1 ').trim();
  }

  formatCardDisplay(num: string): string {
    if (!num) {
      return '•••• •••• •••• ••••';
    }
    const cleaned = num.replace(/\s/g, '');
    const padded = cleaned.padEnd(16, '•');
    return padded.replace(/(.{4})/g, '$1 ').trim();
  }

  validateUpi() {
    this.upiValid = /^[\w.-]+@[\w]+$/.test(this.upiId);
  }

  processPayment() {
    this.error = '';

    if (this.selectedMethod === 'CARD') {
      if (!this.card.number || !this.card.name || !this.card.expiry || !this.card.cvv) {
        this.error = 'Please fill all card details';
        return;
      }
    }
    if (this.selectedMethod === 'UPI' && !this.upiValid) {
      this.error = 'Please enter a valid UPI ID';
      return;
    }
    if (this.selectedMethod === 'NETBANKING' && !this.selectedBank) {
      this.error = 'Please select a bank';
      return;
    }

    this.loading = true;
    const payload: any = {
      bookingId: this.bookingId,
      amount: this.amount,
      paymentMethod: this.selectedMethod,
      cardNumber: this.card.number?.replace(/\s/g, ''),
      cardExpiry: this.card.expiry,
      cardCvv: this.card.cvv,
      cardHolderName: this.card.name,
      upiId: this.upiId,
      bankName: this.selectedBank || this.selectedWallet
    };

    this.paymentService.processPayment(payload).subscribe({
      next: response => {
        this.loading = false;
        if (response?.data?.status === 'SUCCESS') {
          this.success = true;
          this.transactionId = response.data.transactionId || 'TRX' + Math.floor(100000 + Math.random() * 900000);
        } else {
          this.error = 'Payment failed. Please check your details and try again.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Payment failed. Please try again.';
      }
    });
  }
}