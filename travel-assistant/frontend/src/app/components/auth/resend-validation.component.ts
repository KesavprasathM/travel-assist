import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-resend-validation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="resend-shell">
    <div class="resend-card">
      <h1>Resend Validation Email</h1>
      <p>Enter your registered email address and we will send you a new validation link.</p>
      <form (ngSubmit)="send()">
        <input type="email" [(ngModel)]="email" name="email" placeholder="your.email@example.com" required>
        <button type="submit" class="btn btn-primary btn-full">Send Link</button>
      </form>
      <div *ngIf="message" class="alert alert-success">{{ message }}</div>
      <a routerLink="/auth/login" class="text-link">Back to Sign In</a>
    </div>
  </div>
  `,
  styles: [`
    .resend-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to right, #e2e2e2, #c9d6ff);
      padding: 24px;
      font-family: 'Avenir', 'Helvetica Neue', Arial, sans-serif;
      font-style: oblique;
      font-weight: 500;
    }
    .resend-card {
      width: 100%;
      max-width: 420px;
      background: white;
      border-radius: 28px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.12);
      padding: 36px 30px;
      text-align: center;
    }
    .resend-card h1 { margin-bottom: 18px; font-size: 2rem; color: #1a1a2e; }
    .resend-card p { color: #6c7293; margin-bottom: 28px; }
    .resend-card input {
      width: 100%; padding: 14px 16px; border: 2px solid #e8ecf4;
      border-radius: 14px; margin-bottom: 18px; font-size: 15px;
      font-family: inherit; font-style: oblique; font-weight: 500;
    }
    .resend-card .btn-full { width: 100%; }
    .text-link { display: inline-block; margin-top: 18px; color: #512da8; text-decoration: none; }
    .alert-success { margin-top: 16px; }
  `]
})
export class ResendValidationComponent {
  email = '';
  message = '';

  constructor(private router: Router) {}

  send() {
    if (!this.email) { return; }
    this.message = 'A validation link has been sent if this email is registered.';
  }
}
