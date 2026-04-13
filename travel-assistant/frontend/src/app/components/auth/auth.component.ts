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
          <h1>Create Account</h1>
          <div class="social-icons">
            <a href="#" class="icon"><i class="fa-brands fa-google"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-microsoft"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" [(ngModel)]="registerData.name" name="name" required>
          <input type="email" placeholder="Email" [(ngModel)]="registerData.email" name="email" required>
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
            <a href="#" class="icon"><i class="fa-brands fa-google"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-microsoft"></i></a>
            <a href="#" class="icon"><i class="fa-brands fa-github"></i></a>
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
      font-size: 12px;
      padding: 10px 45px;
      border: 1px solid transparent;
      border-radius: 8px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
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
    .container input {
      background-color: rgba(238, 238, 238, 0.96);
      border: 1px solid rgba(148, 163, 184, 0.6);
      margin: 8px 0;
      padding: 10px 15px;
      font-size: 13px;
      border-radius: 8px;
      width: 100%;
      outline: none;
      color: #111827;
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
      border: 1px solid #ccc;
      border-radius: 20%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: 0 3px;
      width: 40px;
      height: 40px;
      transition: all 0.3s ease;
      color: #512da8;
    }
    .social-icons a:hover {
      transform: scale(1.1);
      border-color: #512da8;
      color: #2a0d61;
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
  registerData = { name: '', email: '', password: '', phone: '', city: '' };

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.mode = p['mode'] === 'register' ? 'register' : 'login';
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
