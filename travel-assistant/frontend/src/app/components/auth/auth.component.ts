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
  <div class="auth-shell">
    <div class="container" [class.active]="mode==='register'">
      <div class="form-container sign-up">
        <form (ngSubmit)="register()" #regForm="ngForm">
          <h1>Sign Up!</h1>
          <div class="social-icons">
            <a href="#" class="icon google" title="Google" (click)="startOAuth('google', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" class="social-logo" /></a>
            <a href="#" class="icon facebook" title="Facebook" (click)="startOAuth('facebook', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" class="social-logo" /></a>
            <a href="#" class="icon microsoft" title="Microsoft" (click)="startOAuth('microsoft', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" class="social-logo" /></a>
            <a href="#" class="icon apple" title="Apple" (click)="startOAuth('apple', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" class="social-logo" /></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" [(ngModel)]="registerData.name" name="name" required>
          <input type="email" placeholder="Email" [(ngModel)]="registerData.email" name="email" required>
          <input type="tel" inputmode="tel" placeholder="Phone" [(ngModel)]="registerData.phone" name="phone" required>
          <input type="password" placeholder="Password" [(ngModel)]="registerData.password" name="password" required minlength="6">
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">{{ loading ? 'Creating...' : 'Sign Up' }}</button>
          <div *ngIf="mode==='register' && success" class="alert alert-success">{{ success }}</div>
          <div *ngIf="mode==='register' && error" class="alert alert-error">{{ error }}</div>
        </form>
      </div>
      <div class="form-container sign-in">
        <form (ngSubmit)="login()" #loginForm="ngForm">
          <h1>Sign In</h1>
          <div class="social-icons">
            <a href="#" class="icon google" title="Google" (click)="startOAuth('google', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" class="social-logo" /></a>
            <a href="#" class="icon facebook" title="Facebook" (click)="startOAuth('facebook', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" class="social-logo" /></a>
            <a href="#" class="icon microsoft" title="Microsoft" (click)="startOAuth('microsoft', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" class="social-logo" /></a>
            <a href="#" class="icon apple" title="Apple" (click)="startOAuth('apple', $event)"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" class="social-logo" /></a>
          </div>
          <span>or use your email password</span>
          <input type="email" placeholder="Email" [(ngModel)]="loginData.email" name="email" required>
          <input type="password" placeholder="Password" [(ngModel)]="loginData.password" name="password" required>
          <a routerLink="/auth/resend-validation" class="text-link">Forgot Your Password?</a>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">{{ loading ? 'Signing In...' : 'Sign In' }}</button>
          <div *ngIf="mode==='login' && error" class="alert alert-error">{{ error }}</div>
        </form>
      </div>
      <div class="toggle-container">
        <div class="toggle">
          <div class="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button type="button" class="btn hidden" id="login" (click)="setMode('login')">Sign In</button>
          </div>
          <div class="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button type="button" class="btn hidden" id="register" (click)="setMode('register')">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .auth-shell {
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
    .auth-shell * {
      font-family: inherit;
      font-style: inherit;
      font-weight: inherit;
    }
    .text-link {
      margin-top: 12px;
      color: #512da8;
      text-decoration: none;
      font-size: 13px;
    }
    .text-link:hover { text-decoration: underline; }
    .container {
      background-color: #fff;
      border-radius: 30px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
      position: relative;
      overflow: hidden;
      width: 768px;
      max-width: 100%;
      min-height: 520px;
    }
    .container p {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.3px;
      margin: 20px 0;
    }
    .container span {
      font-size: 12px;
      color: #666;
      margin-bottom: 18px;
      display: inline-block;
    }
    .social-login-title {
      font-size: 13px;
      letter-spacing: 0.08em;
      color: #777;
      text-transform: uppercase;
      margin-top: 10px;
    }
    .container a {
      color: #333;
      font-size: 13px;
      text-decoration: none;
      margin: 15px 0 10px;
      display: inline-block;
    }
    .container button {
      background-color: #512da8;
      color: #fff;
      font-size: 14px;
      padding: 14px 45px;
      border: 1px solid transparent;
      border-radius: 12px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-top: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 180px;
    }
    .container button:hover { transform: translateY(-1px); }
    .container button.hidden {
      background-color: transparent;
      border-color: #fff;
    }
    .container form {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 40px;
      height: 100%;
      text-align: center;
    }
    .btn-full {
      width: 100%;
      max-width: 320px;
    }
    .container input {
      background-color: rgba(248, 250, 252, 0.98);
      border: 1px solid rgba(148, 163, 184, 0.55);
      margin: 12px 0;
      padding: 14px 16px;
      font-size: 14px;
      border-radius: 14px;
      width: 100%;
      outline: none;
      color: #111827;
      min-height: 52px;
      transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }
    .container input::placeholder {
      color: #9ca3af;
    }
    .container input:focus {
      border-color: rgba(59, 130, 246, 0.95);
      background-color: #fff;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
    }
    .container input:focus {
      border-color: rgba(59, 130, 246, 0.9);
      background-color: white;
    }
    .form-container {
      position: absolute;
      top: 0;
      height: 100%;
      transition: all 0.6s ease-in-out;
    }
    .sign-in {
      left: 0;
      width: 50%;
      z-index: 2;
    }
    .container.active .sign-in {
      transform: translateX(100%);
    }
    .sign-up {
      left: 0;
      width: 50%;
      opacity: 0;
      z-index: 1;
      transition: all 0.5s;
    }
    .container.active .sign-up {
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: move 0.6s;
    }
    @keyframes move {
      0%, 49.99% { opacity: 0; z-index: 1; }
      50%, 100% { opacity: 1; z-index: 5; }
    }
    .social-icons {
      margin: 20px 0;
      display: flex;
      justify-content: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .social-icons a {
      border: 1px solid transparent;
      border-radius: 14px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 52px;
      height: 52px;
      transition: all 0.25s ease;
      color: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      background: #fff;
    }
    .social-icons .social-logo {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .auth-page-title {
      font-size: 32px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 18px;
      color: #1f1f1f;
    }
    .social-icons a.google {
      border-color: rgba(0,0,0,0.12);
      color: #4285f4;
    }
    .social-icons a.facebook {
      background: #1877f2;
      color: #fff;
    }
    .social-icons a.microsoft {
      background: #f2f2f2;
      color: #000;
    }
    .social-icons a.apple {
      background: #fff;
      color: #000;
    }
    .social-icons a:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 24px rgba(0,0,0,0.16);
    }
    .social-icons a.google:hover {
      border-color: rgba(66, 133, 244, 0.4);
    }
    .toggle-container {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      overflow: hidden;
      transition: all 0.6s ease-in-out;
      border-radius: 150px 0 0 100px;
      z-index: 1000;
    }
    .container.active .toggle-container {
      transform: translateX(-100%);
      border-radius: 0 150px 100px 0;
    }
    .toggle {
      background: linear-gradient(to right, #5c6bc0, #512da8);
      color: #fff;
      position: relative;
      left: -100%;
      height: 100%;
      width: 200%;
      transform: translateX(0);
      transition: all 0.6s ease-in-out;
    }
    .container.active .toggle {
      transform: translateX(50%);
    }
    .toggle-panel {
      position: absolute;
      width: 50%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0 30px;
      text-align: center;
      top: 0;
      transform: translateX(0);
      transition: all 0.6s ease-in-out;
    }
    .toggle-left { transform: translateX(-200%); }
    .container.active .toggle-left { transform: translateX(0); }
    .toggle-right { right: 0; transform: translateX(0); }
    .container.active .toggle-right { transform: translateX(200%); }
    .toggle-panel h1 { font-size: 2rem; margin-bottom: 12px; }
    .toggle-panel p { font-size: 0.95rem; line-height: 1.6; max-width: 280px; margin-bottom: 20px; }
    @media (max-width: 768px) {
      .toggle-container { display: none; }
      .container { width: 100%; min-height: auto; border-radius: 24px; }
      .form-container { position: relative; width: 100%; left: 0; transform: none !important; opacity: 1 !important; }
      .sign-in { width: 100%; z-index: 2; }
      .sign-up { width: 100%; opacity: 1; z-index: 1; }
      .container .sign-up { display: none; }
      .container.active .sign-up { display: block; }
      .container.active .sign-in { display: none; }
      .container form { padding: 0 24px; }
      .container button { width: 100%; }
    }
  `]
})
export class AuthComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  loading = false; error = ''; success = ''; showPassword = false;
  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', phone: '' };

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.mode = p['mode'] === 'register' ? 'register' : 'login';
    });

    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        const userId = Number(params.get('id')) || 0;
        const name = params.get('name') || 'User';
        const email = params.get('email') || '';
        const role = params.get('role') || 'USER';
        this.authService.socialLogin({ token, userId, name, email, role });
        this.router.navigate(['/']);
      }
    });

    if (this.authService.isLoggedIn) this.router.navigate(['/']);
  }

  setMode(mode: 'login' | 'register') {
    this.mode = mode;
    this.router.navigate(['/auth', mode], { replaceUrl: true });
  }

  login() {
    this.loading = true; this.error = ''; this.success = '';
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: e => { this.error = e.error?.message || 'Login failed'; this.loading = false; }
    });
  }

  startOAuth(provider: string, event: Event) {
    event.preventDefault();
    const supported = ['google', 'facebook', 'microsoft', 'apple'];
    if (!supported.includes(provider)) {
      alert(`${provider} OAuth is not configured yet.`);
      return;
    }
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  }

  register() {
    this.loading = true; this.error = ''; this.success = '';
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.success = 'Successful sign up! Redirecting to sign in...';
        this.loading = false;
        setTimeout(() => this.setMode('login'), 1400);
      },
      error: e => { this.error = e.error?.message || 'Registration failed'; this.loading = false; }
    });
  }
}
