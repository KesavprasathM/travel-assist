import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
  <nav class="navbar">
    <div class="nav-inner">
      <a routerLink="/" class="nav-logo">Tripx</a>
      <div class="nav-links" [class.open]="menuOpen">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/destinations" routerLinkActive="active">Explore</a>
        <a routerLink="/events" routerLinkActive="active">Events</a>
        <a routerLink="/actions" routerLinkActive="active">Actions</a>
        <a routerLink="/feedback" routerLinkActive="active">Feedback</a>
        <a routerLink="/community" routerLinkActive="active">Community</a>
        <a routerLink="/planner" routerLinkActive="active" *ngIf="auth.isLoggedIn">Plan Trip</a>
      </div>
      <div class="nav-actions">
        <ng-container *ngIf="auth.isLoggedIn; else guestLinks">
          <div class="user-menu" (click)="userMenuOpen=!userMenuOpen">
            <div class="user-avatar">{{auth.currentUser?.name?.[0]?.toUpperCase()}}</div>
            <span class="user-name">{{auth.currentUser?.name}}</span>
            <span>▾</span>
            <div class="dropdown" *ngIf="userMenuOpen">
              <a routerLink="/profile">Profile</a>
              <a routerLink="/history">Travel History</a>
              <a routerLink="/reviews">My Reviews</a>
              <hr>
              <button (click)="logout()">Sign Out</button>
            </div>
          </div>
        </ng-container>
        <ng-template #guestLinks>
          <a routerLink="/auth/login" class="btn btn-secondary btn-sm">Sign In</a>
          <a routerLink="/auth/register" class="btn btn-primary btn-sm">Get Started</a>
        </ng-template>
      </div>
      <button class="hamburger" (click)="menuOpen=!menuOpen">☰</button>
    </div>
  </nav>
  `,
  styles: [`
    .navbar { background: white; box-shadow: 0 2px 20px rgba(0,0,0,0.08); position: fixed; top: 0; left: 0; right: 0; width: 100%; z-index: 1000; }
    .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 68px; display: flex; align-items: center; gap: 32px; }
    .nav-logo { font-family: 'Playfair Display',serif; font-size: 1.5rem; font-weight: 700; color: #e94560; text-decoration: none; flex-shrink: 0; }
    .nav-links { display: flex; gap: 8px; flex: 1; }
    .nav-links a { padding: 8px 14px; border-radius: 8px; text-decoration: none; color: #6c7293; font-weight: 500; font-size: 15px; transition: all 0.2s; }
    .nav-links a:hover, .nav-links a.active { color: #e94560; background: rgba(233,69,96,0.08); }
    .nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .btn-sm { padding: 8px 18px; font-size: 14px; }
    .user-menu { position: relative; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 12px; border-radius: 50px; border: 2px solid #e8ecf4; user-select: none; }
    .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#e94560,#0f3460); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
    .user-name { font-weight: 500; font-size: 14px; }
    .dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); padding: 8px; min-width: 200px; z-index: 999; }
    .dropdown a, .dropdown button { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; text-decoration: none; color: #2d2d44; font-size: 14px; font-weight: 500; width: 100%; border: none; background: none; cursor: pointer; text-align: left; transition: background 0.15s; }
    .dropdown a:hover, .dropdown button:hover { background: #f8f9ff; }
    .dropdown hr { border: none; border-top: 1px solid #e8ecf4; margin: 6px 0; }
    .hamburger { display: none; background: none; border: none; font-size: 24px; cursor: pointer; }
    @media(max-width:768px) {
      .hamburger { display: block; margin-left: auto; }
      .nav-links { display: none; position: absolute; top: 68px; left: 0; right: 0; background: white; flex-direction: column; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
      .nav-links.open { display: flex; }
      .user-name { display: none; }
    }
  `]
})
export class NavbarComponent {
  menuOpen = false; userMenuOpen = false;
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigate(['/auth/login']); }
}
