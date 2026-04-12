import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="payment-page container">
    <div class="payment-container" *ngIf="!success">
      <div class="payment-left">
        <h2>Secure Payment</h2>
        <div class="security-badge">🔒 256-bit SSL Encrypted · PCI DSS Compliant</div>

        <!-- Method Tabs -->
        <div class="method-tabs">
          <button *ngFor="let m of methods" [class.active]="selectedMethod===m.key" (click)="selectedMethod=m.key">
            {{m.icon}} {{m.label}}
          </button>
        </div>

        <!-- Card Payment -->
        <div *ngIf="selectedMethod==='CARD'" class="payment-form">
          <div class="card-preview" [class.flipped]="showCardBack">
            <div class="card-front">
              <div class="card-chip">▪▪▪</div>
              <div class="card-number">{{formatCardDisplay(card.number)}}</div>
              <div class="card-bottom">
                <div><div class="card-label">Card Holder</div><div class="card-val">{{card.name || 'YOUR NAME'}}</div></div>
                <div><div class="card-label">Expires</div><div class="card-val">{{card.expiry || 'MM/YY'}}</div></div>
              </div>
            </div>
            <div class="card-back">
              <div class="card-strip"></div>
              <div class="card-cvv-wrap">CVV: <span class="card-cvv-val">{{card.cvv || '•••'}}</span></div>
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
            <span>Accepted: 💳 Visa</span><span>💳 Mastercard</span><span>💳 Rupay</span><span>💳 Amex</span>
          </div>
        </div>

        <!-- UPI -->
        <div *ngIf="selectedMethod==='UPI'" class="payment-form">
          <div class="upi-apps">
            <div *ngFor="let a of upiApps" class="upi-app" [class.active]="upiApp===a.id" (click)="upiApp=a.id">
              <span class="upi-icon">{{a.icon}}</span>
              <span>{{a.label}}</span>
            </div>
          </div>
          <div class="form-group">
            <label>UPI ID</label>
            <input type="text" [(ngModel)]="upiId" placeholder="yourname@upi" (input)="validateUpi()">
            <div class="upi-status" *ngIf="upiId">
              <span [class.valid]="upiValid" [class.invalid]="!upiValid">
                {{upiValid ? '✅ Valid UPI ID' : '⚠️ Enter valid UPI ID (e.g. name@okaxis)'}}
              </span>
            </div>
          </div>
          <div class="upi-qr" *ngIf="upiApp==='qr'">
            <div class="qr-box">
              <div class="qr-grid">
                <div *ngFor="let c of qrCells" [class.filled]="c" class="qr-cell"></div>
              </div>
            </div>
            <p>Scan with any UPI app</p>
          </div>
        </div>

        <!-- Net Banking -->
        <div *ngIf="selectedMethod==='NETBANKING'" class="payment-form">
          <div class="banks-grid">
            <div *ngFor="let b of banks" class="bank-option" [class.active]="selectedBank===b" (click)="selectedBank=b">
              <span class="bank-icon">🏦</span>
              <span>{{b}}</span>
            </div>
          </div>
          <div class="form-group" *ngIf="selectedBank">
            <label>Selected Bank</label>
            <input type="text" [value]="selectedBank" readonly>
          </div>
        </div>

        <!-- Wallet -->
        <div *ngIf="selectedMethod==='WALLET'" class="payment-form">
          <div class="banks-grid">
            <div *ngFor="let w of wallets" class="bank-option" [class.active]="selectedWallet===w.name" (click)="selectedWallet=w.name">
              <span>{{w.icon}}</span>
              <span>{{w.name}}</span>
            </div>
          </div>
        </div>

        <div class="error-msg" *ngIf="error">⚠️ {{error}}</div>

        <button class="btn btn-primary pay-btn" (click)="processPayment()" [disabled]="loading">
          {{loading ? '🔄 Processing...' : '🔒 Pay ₹' + (amount | number)}}
        </button>
      </div>

      <!-- Order Summary -->
      <div class="payment-right">
        <div class="order-summary">
          <h3>Order Summary</h3>
          <div class="os-row"><span>Booking ID</span><strong>#{{bookingId}}</strong></div>
          <div class="os-row"><span>Base Fare</span><strong>₹{{(amount * 0.88) | number:'1.0-0'}}</strong></div>
          <div class="os-row"><span>Taxes & Fees</span><strong>₹{{(amount * 0.12) | number:'1.0-0'}}</strong></div>
          <div class="os-divider"></div>
          <div class="os-row total"><span>Total Amount</span><strong>₹{{amount | number}}</strong></div>
        </div>
        <div class="security-features">
          <h4>Why Pay with Tripx?</h4>
          <div class="sf-item"><span>🔒</span><p>256-bit SSL encryption</p></div>
          <div class="sf-item"><span>✅</span><p>Instant confirmation</p></div>
          <div class="sf-item"><span>💰</span><p>Easy refund policy</p></div>
          <div class="sf-item"><span>📱</span><p>E-ticket on mobile</p></div>
        </div>
      </div>
    </div>

    <!-- Success Screen -->
    <div class="success-screen" *ngIf="success">
      <div class="success-animation">✅</div>
      <h2>Payment Successful!</h2>
      <p>Your booking has been confirmed</p>
      <div class="success-details">
        <div class="sd-row"><span>Transaction ID</span><strong>{{transactionId}}</strong></div>
        <div class="sd-row"><span>Amount Paid</span><strong>₹{{amount | number}}</strong></div>
        <div class="sd-row"><span>Method</span><strong>{{selectedMethod}}</strong></div>
        <div class="sd-row"><span>Status</span><strong class="text-success">✅ Confirmed</strong></div>
      </div>
      <div class="success-actions">
        <button class="btn btn-secondary" (click)="router.navigate(['/bookings'])">View Bookings</button>
        <button class="btn btn-primary" (click)="router.navigate(['/'])">Plan Another Trip</button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .payment-page { padding: 40px 0 80px; }
    .payment-container { display: grid; grid-template-columns: 1fr 380px; gap: 32px; max-width: 900px; margin: 0 auto; }
    h2 { font-size: 1.8rem; color: #1a1a2e; margin-bottom: 8px; }
    .security-badge { font-size: 13px; color: #2e7d32; background: #e8f5e9; padding: 6px 14px; border-radius: 50px; display: inline-block; margin-bottom: 24px; }
    .method-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .method-tabs button { padding: 10px 18px; border-radius: 12px; border: 2px solid #e8ecf4; background: white; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; color: #6c7293; transition: all 0.2s; }
    .method-tabs button.active { border-color: #e94560; color: #e94560; background: rgba(233,69,96,0.05); }
    .card-preview { width: 100%; height: 200px; perspective: 1000px; margin-bottom: 24px; position: relative; }
    .card-front, .card-back { position: absolute; inset: 0; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.6s; backface-visibility: hidden; }
    .card-front { background: linear-gradient(135deg,#1a1a2e 0%,#0f3460 60%,#e94560 100%); color: white; }
    .card-back { background: linear-gradient(135deg,#16213e,#0f3460); color: white; transform: rotateY(180deg); }
    .card-preview.flipped .card-front { transform: rotateY(180deg); }
    .card-preview.flipped .card-back { transform: rotateY(0); }
    .card-chip { font-size: 20px; opacity: 0.8; }
    .card-number { font-size: 1.4rem; letter-spacing: 4px; font-weight: 600; text-align: center; margin: 16px 0; }
    .card-bottom { display: flex; gap: 32px; }
    .card-label { font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
    .card-val { font-size: 14px; font-weight: 600; }
    .card-strip { height: 40px; background: rgba(0,0,0,0.5); margin: -24px -24px 20px; }
    .card-cvv-wrap { background: white; color: #1a1a2e; padding: 8px 16px; border-radius: 8px; display: flex; gap: 8px; align-items: center; font-size: 14px; }
    .card-types { display: flex; gap: 12px; font-size: 13px; color: #6c7293; flex-wrap: wrap; margin-top: 8px; }
    .upi-apps { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
    .upi-app { border: 2px solid #e8ecf4; border-radius: 12px; padding: 12px 8px; text-align: center; cursor: pointer; font-size: 13px; transition: all 0.2s; }
    .upi-app.active { border-color: #e94560; background: rgba(233,69,96,0.05); }
    .upi-icon { font-size: 24px; display: block; margin-bottom: 6px; }
    .upi-status { font-size: 13px; margin-top: 6px; }
    .valid { color: #2e7d32; } .invalid { color: #e65100; }
    .upi-qr { text-align: center; margin-top: 16px; }
    .qr-box { width: 160px; height: 160px; margin: 0 auto 12px; border: 4px solid #1a1a2e; padding: 8px; border-radius: 8px; }
    .qr-grid { display: grid; grid-template-columns: repeat(12,1fr); gap: 2px; height: 100%; }
    .qr-cell { background: #e8ecf4; border-radius: 1px; }
    .qr-cell.filled { background: #1a1a2e; }
    .upi-qr p { font-size: 13px; color: #6c7293; }
    .banks-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
    .bank-option { border: 2px solid #e8ecf4; border-radius: 12px; padding: 14px; text-align: center; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; display: flex; flex-direction: column; gap: 6px; align-items: center; }
    .bank-option.active { border-color: #e94560; background: rgba(233,69,96,0.05); }
    .pay-btn { width: 100%; justify-content: center; padding: 18px; font-size: 1.1rem; background: linear-gradient(135deg,#e94560,#0f3460); border-radius: 16px; margin-top: 16px; }
    .order-summary { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px; }
    .order-summary h3 { margin-bottom: 20px; font-size: 1.1rem; }
    .os-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; border-bottom: 1px solid #f8f9ff; }
    .os-row:last-child { border-bottom: none; }
    .os-row.total { font-size: 1rem; font-weight: 700; }
    .os-row.total strong { color: #e94560; font-size: 1.2rem; }
    .os-divider { height: 2px; background: #f8f9ff; margin: 8px 0; }
    .security-features { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .security-features h4 { margin-bottom: 16px; color: #1a1a2e; }
    .sf-item { display: flex; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8f9ff; font-size: 14px; }
    .sf-item span { font-size: 20px; }
    .error-msg { background: #ffebee; color: #c62828; padding: 12px 16px; border-radius: 10px; margin-top: 12px; font-size: 14px; }
    .success-screen { text-align: center; max-width: 480px; margin: 60px auto; }
    .success-animation { font-size: 80px; margin-bottom: 24px; animation: bounceIn 0.5s ease; }
    .success-screen h2 { font-size: 2rem; margin-bottom: 8px; color: #2e7d32; }
    .success-screen p { color: #6c7293; margin-bottom: 32px; }
    .success-details { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 24px; }
    .sd-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f8f9ff; font-size: 14px; }
    .sd-row:last-child { border-bottom: none; }
    .text-success { color: #2e7d32; }
    .success-actions { display: flex; gap: 12px; justify-content: center; }
    @keyframes bounceIn { 0%{transform:scale(0)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }
    @media(max-width:768px) { .payment-container{grid-template-columns:1fr;} .upi-apps{grid-template-columns:repeat(2,1fr);} .banks-grid{grid-template-columns:repeat(2,1fr);} }
  `]
})
export class PaymentComponent implements OnInit {
  bookingId: number = 0; amount: number = 0;
  selectedMethod = 'CARD'; loading = false; error = '';
  success = false; transactionId = '';
  showCardBack = false; upiId = ''; upiValid = false; upiApp = 'gpay'; selectedBank = ''; selectedWallet = '';
  card = { number: '', name: '', expiry: '', cvv: '' };
  methods = [{key:'CARD',icon:'💳',label:'Card'},{key:'UPI',icon:'📱',label:'UPI'},{key:'NETBANKING',icon:'🏦',label:'Net Banking'},{key:'WALLET',icon:'👛',label:'Wallet'}];
  upiApps = [{id:'gpay',icon:'🟢',label:'GPay'},{id:'phonepe',icon:'🟣',label:'PhonePe'},{id:'paytm',icon:'🔵',label:'Paytm'},{id:'qr',icon:'📷',label:'QR Code'}];
  banks = ['SBI','HDFC','ICICI','Axis Bank','Kotak','PNB','Yes Bank','Bank of Baroda'];
  wallets = [{name:'Paytm',icon:'💙'},{name:'Amazon Pay',icon:'🟡'},{name:'MobiKwik',icon:'🟢'},{name:'Freecharge',icon:'🔴'}];
  qrCells: boolean[] = Array(144).fill(false).map(() => Math.random() > 0.5);

  constructor(private paymentService: PaymentService, private route: ActivatedRoute, public router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      this.bookingId = +p['bookingId'] || 0;
      this.amount = +p['amount'] || 0;
    });
  }

  formatCardNumber(e: any) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    this.card.number = v.replace(/(.{4})/g, '$1 ').trim();
  }

  formatCardDisplay(num: string): string {
    if (!num) return '•••• •••• •••• ••••';
    const cleaned = num.replace(/\s/g, '');
    const padded = cleaned.padEnd(16, '•');
    return padded.replace(/(.{4})/g, '$1 ').trim();
  }

  validateUpi() { this.upiValid = /^[\w.-]+@[\w]+$/.test(this.upiId); }

  processPayment() {
    this.error = '';
    if (this.selectedMethod === 'CARD') {
      if (!this.card.number || !this.card.name || !this.card.expiry || !this.card.cvv) { this.error = 'Please fill all card details'; return; }
    }
    if (this.selectedMethod === 'UPI' && !this.upiValid) { this.error = 'Please enter a valid UPI ID'; return; }
    if (this.selectedMethod === 'NETBANKING' && !this.selectedBank) { this.error = 'Please select a bank'; return; }

    this.loading = true;
    const payload: any = {
      bookingId: this.bookingId, amount: this.amount, paymentMethod: this.selectedMethod,
      cardNumber: this.card.number?.replace(/\s/g, ''),
      cardExpiry: this.card.expiry, cardCvv: this.card.cvv, cardHolderName: this.card.name,
      upiId: this.upiId, bankName: this.selectedBank || this.selectedWallet
    };

    this.paymentService.processPayment(payload).subscribe({
      next: res => {
        this.loading = false;
        if (res.data.status === 'SUCCESS') { this.success = true; this.transactionId = res.data.transactionId; }
        else this.error = 'Payment failed. Please check your details and try again.';
      },
      error: () => { this.loading = false; this.error = 'Payment failed. Please try again.'; }
    });
  }
}
