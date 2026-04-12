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
            {{m.icon}} {{m.label}}
          </button>
        </div>

        <div class="payment-form">
          <ng-container [ngSwitch]="selectedMethod">
            <div *ngSwitchCase="'CARD'">
              <div class="card-preview" [class.flipped]="showCardBack">
                <div class="card-front">
                  <div class="card-chip">•••</div>
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
                  <input type="password" [(ngModel)]="card.cvv" placeholder="���" maxlength="3" (focus)="showCardBack=true" (blur)="showCardBack=false">
                </div>
              </div>
              <div class="card-types">Accepted: Visa · Mastercard · Rupay · Amex</div>
            </div>

            <div *ngSwitchCase="'UPI'">
              <div class="upi-apps">
                <div *ngFor="let a of upiApps" class="upi-app" [class.active]="upiApp===a.id" (click)="upiApp=a.id">
                  <div class="upi-icon">{{ a.icon }}</div>
                  <div>{{ a.label }}</div>
                </div>
              </div>
              <div class="form-group">
                <label>UPI ID</label>
                <input type="text" [(ngModel)]="upiId" placeholder="yourname@upi" (input)="validateUpi()">
                <div class="upi-status" *ngIf="upiId">
                  <span [class.valid]="upiValid" [class.invalid]="!upiValid">
                    {{ upiValid ? '✅ Valid UPI ID' : '⚠️ Enter valid UPI ID' }}
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
                <div *ngFor="let b of banks" class="bank-option" [class.active]="selectedBank===b" (click)="selectedBank=b">
                  <div class="bank-icon">🏦</div>
                  <div>{{ b }}</div>
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
                  <div>{{ w.icon }}</div>
                  <div>{{ w.name }}</div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>

        <div class="error-msg" *ngIf="error">⚠️ {{ error }}</div>

        <button class="btn btn-primary pay-btn" (click)="processPayment()" [disabled]="loading">
          {{ loading ? '🔄 Processing...' : '🔒 Pay ₹' + (amount | number) }}
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
          <div class="sf-item"><span>??</span><p>Secure payment gateway</p></div>
          <div class="sf-item"><span>?</span><p>Flexible travel support</p></div>
          <div class="sf-item"><span>??</span><p>Instant email confirmation</p></div>
          <div class="sf-item"><span>??</span><p>Invoice sent automatically</p></div>
        </div>
      </div>
    </div>

    <div class="success-screen" *ngIf="success">
      <div class="success-animation">✅</div>
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
    .method-tabs button { padding: 12px 18px; border: 1px solid #e2e8f0; background: #fff; border-radius: 16px; font-weight: 600; color: #334155; cursor: pointer; transition: all 0.2s ease; }
    .method-tabs button.active { background: #eef2ff; border-color: #c7d2fe; color: #4338ca; }
    .payment-form { display: grid; gap: 20px; }
    .card-preview { width: 100%; height: 200px; perspective: 1000px; position: relative; }
    .card-front, .card-back { position: absolute; inset: 0; border-radius: 24px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; backface-visibility: hidden; transition: transform 0.6s ease; }
    .card-front { background: linear-gradient(135deg,#4338ca,#2563eb); color: #fff; }
    .card-back { background: linear-gradient(135deg,#1e293b,#0f172a); color: #fff; transform: rotateY(180deg); }
    .card-preview.flipped .card-front { transform: rotateY(180deg); }
    .card-preview.flipped .card-back { transform: rotateY(0); }
    .card-chip { font-size: 20px; opacity: 0.85; }
    .card-number { font-size: 1.4rem; letter-spacing: 4px; font-weight: 700; text-align: center; margin: 16px 0; }
    .card-bottom { display: flex; justify-content: space-between; gap: 18px; }
    .card-label { font-size: 10px; text-transform: uppercase; opacity: 0.65; letter-spacing: 0.1em; margin-bottom: 4px; }
    .card-val { font-size: 14px; font-weight: 700; }
    .card-strip { height: 42px; background: rgba(255,255,255,0.18); border-radius: 14px; margin-top: 14px; }
    .card-cvv-wrap { background: rgba(255,255,255,0.12); padding: 12px 16px; border-radius: 16px; font-size: 14px; }
    .card-types { padding: 14px 0 0; color: #475467; font-size: 0.92rem; }
    .upi-apps { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
    .upi-app { border: 1px solid #e2e8f0; border-radius: 20px; padding: 14px 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
    .upi-app.active { border-color: #c7d2fe; background: #eef2ff; }
    .upi-icon { font-size: 24px; margin-bottom: 6px; }
    .upi-status { margin-top: 8px; font-size: 13px; }
    .upi-status .valid { color: #16a34a; }
    .upi-status .invalid { color: #dc2626; }
    .upi-qr { padding: 16px; background: #f8fafc; border-radius: 18px; text-align: center; }
    .qr-box { width: 150px; height: 150px; margin: 0 auto 12px; border: 3px solid #0f172a; border-radius: 18px; padding: 10px; }
    .qr-grid { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap: 2px; height: 100%; }
    .qr-cell { background: #e2e8f0; border-radius: 2px; }
    .qr-cell.filled { background: #0f172a; }
    .banks-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; }
    .bank-option { border: 1px solid #e2e8f0; border-radius: 18px; padding: 18px 12px; text-align: center; cursor: pointer; transition: all 0.2s; display: grid; place-items: center; gap: 8px; font-weight: 600; }
    .bank-option.active { border-color: #c7d2fe; background: #eef2ff; }
    .bank-icon { font-size: 22px; }
    .form-group { display: grid; gap: 8px; }
    .form-group label { font-weight: 700; color: #334155; }
    .form-group input { width: 100%; border-radius: 16px; border: 1px solid #e2e8f0; padding: 14px 16px; font-size: 0.95rem; color: #0f172a; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 16px; }
    .pay-btn { width: 100%; padding: 18px; border-radius: 20px; border: none; color: #fff; font-size: 1rem; background: linear-gradient(135deg,#4338ca,#2563eb); cursor: pointer; margin-top: 4px; }
    .error-msg { margin-top: 12px; padding: 14px 16px; border-radius: 16px; background: #fee2e2; color: #991b1b; }
    .order-summary, .security-features, .success-details { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08); }
    .order-summary h3, .security-features h4 { margin-bottom: 18px; color: #0f172a; }
    .os-row { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f8fafc; color: #475467; }
    .os-row.total { font-size: 1rem; font-weight: 700; color: #111827; }
    .os-divider { height: 2px; background: #eff6ff; margin: 10px 0; }
    .os-row.total strong { color: #4338ca; }
    .security-features .sf-item { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8fafc; }
    .security-features .sf-item:last-child { border-bottom: none; }
    .security-features span { font-size: 22px; }
    .success-screen { text-align: center; max-width: 520px; margin: 0 auto; }
    .success-animation { font-size: 72px; margin-bottom: 24px; }
    .success-screen h2 { font-size: 2.2rem; color: #0f766e; margin-bottom: 10px; }
    .success-screen p { color: #475467; margin-bottom: 24px; }
    .sd-row { display: flex; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #f8fafc; }
    .sd-row:last-child { border-bottom: none; }
    .text-success { color: #16a34a; font-weight: 700; }
    .success-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
    .btn-secondary { background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; padding: 14px 20px; border-radius: 18px; }
    .btn-primary { background: linear-gradient(135deg,#4338ca,#2563eb); color: #fff; border: none; padding: 14px 20px; border-radius: 18px; }
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
    { key: 'CARD', icon: 'Card', label: 'Card' },
    { key: 'UPI', icon: 'UPI', label: 'UPI' },
    { key: 'NETBANKING', icon: 'Bank', label: 'Net Banking' },
    { key: 'WALLET', icon: 'Wallet', label: 'Wallet' }
  ];
  upiApps = [
    { id: 'gpay', icon: 'GPay', label: 'GPay' },
    { id: 'phonepe', icon: 'PhonePe', label: 'PhonePe' },
    { id: 'paytm', icon: 'Paytm', label: 'Paytm' },
    { id: 'qr', icon: 'QR', label: 'QR Code' }
  ];
  banks = ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'PNB', 'Yes Bank', 'Bank of Baroda'];
  wallets = [
    { name: 'Paytm', icon: 'Paytm' },
    { name: 'Amazon Pay', icon: 'Amazon' },
    { name: 'MobiKwik', icon: 'MobiKwik' },
    { name: 'Freecharge', icon: 'Freecharge' }
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
      return '���� ���� ���� ����';
    }
    const cleaned = num.replace(/\s/g, '');
    const padded = cleaned.padEnd(16, '�');
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
