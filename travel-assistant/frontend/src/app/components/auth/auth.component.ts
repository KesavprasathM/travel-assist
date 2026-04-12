import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="auth-page">
    <div class="auth-visual">
      <div class="auth-visual-content">
        <h1>Tripx</h1>
        <p>Your intelligent travel companion for exploring India and beyond</p>
        <div class="destinations-preview">
          <div class="dest-chip" *ngFor="let d of ['Goa','Manali','Jaipur','Kerala','Agra']">✈ {{d}}</div>
        </div>
      </div>
    </div>
    <div class="auth-form-wrap">
      <div class="auth-form-card">
        <div class="auth-logo">✈ Tripx</div>
        <div class="auth-tabs">
          <button [class.active]="mode==='login'" (click)="mode='login'">Sign In</button>
          <button [class.active]="mode==='register'" (click)="mode='register'">Register</button>
        </div>
        <div *ngIf="error" class="alert alert-error">{{error}}</div>
        <div *ngIf="success" class="alert alert-success">{{success}}</div>

        <!-- Login Form -->
        <form *ngIf="mode==='login'" (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="loginData.email" name="email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <div class="password-wrap">
              <input [type]="showPassword?'text':'password'" [(ngModel)]="loginData.password" name="password" placeholder="••••••••" required>
              <button type="button" class="eye-btn" (click)="showPassword=!showPassword">{{showPassword?'🙈':'👁'}}</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{loading ? 'Signing in...' : 'Sign In'}}
          </button>
          <p class="demo-hint">Demo: test&#64;travel.com / password123</p>
        </form>

        <!-- Register Form -->
        <form *ngIf="mode==='register'" (ngSubmit)="register()" #regForm="ngForm">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="registerData.name" name="name" placeholder="Raj Sharma" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="registerData.email" name="email" placeholder="raj@example.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="registerData.password" name="password" placeholder="Min. 6 characters" required minlength="6">
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="registerData.phone" name="phone" placeholder="+91 9876543210">
            </div>
            <div class="form-group">
              <label>Your City</label>
              <input type="text" [(ngModel)]="registerData.city" name="city" placeholder="Bengaluru">
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            {{loading ? 'Creating...' : 'Create Account'}}
          </button>
        </form>

        <p class="auth-footer">By continuing, you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a></p>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .auth-page { display: flex; min-height: 100vh; }
    .auth-visual {
      flex: 1; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 48px; position: relative; overflow: hidden;
    }
    .auth-visual::before {
      content: ''; position: absolute; inset: 0;
      background: url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200') center/cover;
      opacity: 0.15;
    }
    .auth-visual-content { position: relative; color: white; text-align: center; }
    .auth-visual-content h1 { font-family: 'Playfair Display', serif; font-size: 3.5rem; margin-bottom: 16px; }
    .auth-visual-content p { font-size: 1.1rem; opacity: 0.85; margin-bottom: 40px; max-width: 360px; }
    .destinations-preview { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
    .dest-chip { background: rgba(255,255,255,0.15); padding: 8px 18px; border-radius: 50px; font-size: 14px; backdrop-filter: blur(4px); }
    .auth-form-wrap { width: 480px; display: flex; align-items: center; justify-content: center; padding: 40px; background: white; }
    .auth-form-card { width: 100%; }
    .auth-logo { font-size: 1.8rem; font-weight: 700; color: #e94560; margin-bottom: 32px; font-family: 'Playfair Display', serif; }
    .auth-tabs { display: flex; background: #f8f9ff; border-radius: 12px; padding: 4px; margin-bottom: 28px; }
    .auth-tabs button { flex: 1; padding: 10px; border: none; background: transparent; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #6c7293; }
    .auth-tabs button.active { background: white; color: #e94560; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .btn-full { width: 100%; justify-content: center; margin-top: 8px; }
    .password-wrap { position: relative; }
    .password-wrap input { padding-right: 48px; }
    .eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; }
    .demo-hint { text-align: center; margin-top: 12px; font-size: 13px; color: #6c7293; background: #f8f9ff; padding: 8px; border-radius: 8px; }
    .auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: #6c7293; }
    .auth-footer a { color: #e94560; text-decoration: none; }
    @media(max-width:768px) { .auth-visual{display:none;} .auth-form-wrap{width:100%;} }
  `]
})
export class AuthComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  loading = false; error = ''; success = ''; showPassword = false;
  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', phone: '', city: '' };

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(p => { if (p['mode']) this.mode = p['mode']; });
    if (this.authService.isLoggedIn) this.router.navigate(['/']);
  }

  login() {
    this.loading = true; this.error = '';
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: e => { this.error = e.error?.message || 'Login failed'; this.loading = false; }
    });
  }

  register() {
    this.loading = true; this.error = '';
    this.authService.register(this.registerData).subscribe({
      next: () => this.router.navigate(['/']),
      error: e => { this.error = e.error?.message || 'Registration failed'; this.loading = false; }
    });
  }
}
