import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="profile-page">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">{{ user?.name?.[0]?.toUpperCase() || 'U' }}</div>
          <div>
            <h1>Welcome back, {{ user?.name || 'Traveller' }}</h1>
            <p>Use this profile to manage your account, update contact details, and keep trip planning in sync.</p>
          </div>
        </div>

        <form (ngSubmit)="saveProfile()">
          <label>Name</label>
          <input type="text" [(ngModel)]="user.name" name="name" required />

          <label>Email</label>
          <input type="email" [(ngModel)]="user.email" name="email" required />

          <label>Phone</label>
          <input type="text" [(ngModel)]="user.phone" name="phone" />

          <label>City</label>
          <input type="text" [(ngModel)]="user.city" name="city" />

          <div class="actions">
            <button type="submit" class="btn btn-primary">Save Profile</button>
            <button type="button" class="btn btn-outline" (click)="logout()">Logout</button>
          </div>

          <div class="message" *ngIf="message">{{ message }}</div>
        </form>

        <div class="profile-links">
          <a routerLink="/planner" class="link">Plan a Trip</a>
          <a routerLink="/actions" class="link">Open Action Center</a>
          <a routerLink="/destinations" class="link">Explore Destinations</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .profile-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; background: radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 30%), linear-gradient(180deg,#060b18 0%,#070c1e 100%); color: white; }
    .profile-card { width: 100%; max-width: 680px; background: rgba(15,23,42,0.92); border: 1px solid rgba(148,163,184,0.12); border-radius: 28px; padding: 32px; box-shadow: 0 24px 90px rgba(15,23,42,0.28); }
    .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
    .avatar { width: 72px; height: 72px; border-radius: 50%; background: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: white; }
    h1 { margin: 0; font-size: 2.15rem; }
    p { margin: 6px 0 0; color: #cbd5e1; }
    label { display: block; margin-top: 18px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; }
    input { width: 100%; margin-top: 8px; padding: 14px 16px; border-radius: 16px; border: 1px solid rgba(148,163,184,0.16); background: rgba(15,23,42,0.96); color: white; outline: none; }
    input:focus { border-color: rgba(59,130,246,0.7); }
    .actions { display: flex; flex-wrap: wrap; gap: 14px; margin: 26px 0 0; }
    .message { margin-top: 12px; color: #86efac; font-weight: 600; }
    .profile-links { margin-top: 22px; display: grid; gap: 10px; }
    .profile-links .link { color: #93c5fd; text-decoration: none; font-weight: 600; }
    .profile-links .link:hover { text-decoration: underline; }
    .btn-outline { background: transparent; color: white; border: 1px solid rgba(255,255,255,0.18); }
    @media (max-width: 768px) { .profile-card { padding: 26px; } }
  `]
})
export class ProfileComponent implements OnInit {
  user: User = { id: 0, name: '', email: '', phone: '', city: '', role: '' };
  message = '';

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = { ...currentUser };
  }

  saveProfile() {
    this.auth.updateProfile({ ...this.user });
    this.message = 'Profile updated successfully.';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
