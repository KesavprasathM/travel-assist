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
      <p>Join a growing community of collaborators, contributors, and real-world users.</p>
    </div>
    <div class="community-grid">
      <div class="community-card" *ngFor="let card of cards">
        <h2>{{ card.title }}</h2>
        <p>{{ card.description }}</p>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .page-shell { padding: 80px 120px; color: #101010; }
    .page-header h1 { font-size: 3rem; margin-bottom: 14px; font-family: var(--font-display); }
    .page-header p { max-width: 720px; color: #505050; }
    .community-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .community-card { padding: 28px; background: #ffffff; border-radius: 24px; box-shadow: var(--card-shadow); }
    .community-card h2 { font-size: 1.6rem; margin-bottom: 12px; }
    .community-card p { color: #505050; line-height: 1.8; }
  `]
})
export class CommunityComponent {
  cards = [
    { title: 'Forums', description: 'Ask questions, share ideas, and explore use cases with other users.' },
    { title: 'Workshops', description: 'Attend guided sessions to get the most from the application.' },
    { title: 'Resources', description: 'Access tutorials, templates, and best practices.' }
  ];
}
