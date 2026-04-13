import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="page-shell">
    <div class="page-header">
      <h1>Community</h1>
      <p>Discover how Tripx connects you with travel insights, support, and social updates.</p>
    </div>
    <div class="community-grid">
      <div class="community-card" *ngFor="let card of cards">
        <div class="card-header">
          <div class="social-logo" [style.background]="card.color">{{ card.logo }}</div>
          <div>
            <h2>{{ card.title }}</h2>
            <p>{{ card.description }}</p>
          </div>
        </div>
        <div class="contact">contact&#64;tripx.com</div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .page-shell { padding: 80px 120px; color: #101010; }
    .page-header h1 { font-size: 3rem; margin-bottom: 14px; font-family: var(--font-display); }
    .page-header p { max-width: 720px; color: #505050; }
    .community-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .community-card { padding: 28px; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); }
    .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
    .social-logo { width: 52px; height: 52px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 1.35rem; font-weight: 700; }
    .community-card h2 { font-size: 1.6rem; margin: 0; }
    .community-card p { color: #505050; line-height: 1.8; margin: 0; }
    .contact { margin-top: 16px; color: #334155; font-weight: 600; }
  `]
})
export class CommunityComponent {
  cards = [
    { title: 'Tripx Support', logo: '✉️', description: 'Email our support team for booking help and product questions.', color: '#111827' },
    { title: 'Facebook', logo: 'f', description: 'Connect on Facebook for travel updates and community stories.', color: '#1877f2' },
    { title: 'Instagram', logo: '📸', description: 'Follow our Instagram for destination inspiration and stories.', color: '#d63384' },
    { title: 'LinkedIn', logo: 'in', description: 'Join our professional network to hear Tripx announcements.', color: '#0a66c2' },
    { title: 'Twitter', logo: '🐦', description: 'Get quick travel tips and alerts from the Tripx team.', color: '#1da1f2' }
  ];
}
