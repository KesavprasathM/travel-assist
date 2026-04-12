import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="page-shell">
    <div class="page-header">
      <h1>Events</h1>
      <p>Discover live sessions, workshops, and product roadmaps designed to support your workflow.</p>
    </div>
    <div class="filter-row">
      <button *ngFor="let category of categories" [class.active]="category===selectedCategory"
        (click)="selectCategory(category)">{{ category }}</button>
    </div>
    <div class="events-grid">
      <div class="event-card" *ngFor="let event of filteredEvents()">
        <div class="event-meta">
          <span>{{ event.date }}</span>
          <span>{{ event.type }}</span>
        </div>
        <h2>{{ event.title }}</h2>
        <p>{{ event.description }}</p>
        <div class="event-actions">
          <button class="btn btn-secondary" (click)="bookmark(event)">Save</button>
          <button class="btn btn-primary" (click)="join(event)">Join Now</button>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .page-shell { padding: 80px 120px; color: #101010; }
    .page-header h1 { font-size: 3rem; margin-bottom: 14px; font-family: var(--font-display); }
    .page-header p { max-width: 720px; color: #505050; }
    .filter-row { display: flex; gap: 12px; margin: 32px 0; flex-wrap: wrap; }
    .filter-row button { border: 1px solid #e8ecf4; background: #f8f8f8; color: #505050; padding: 10px 18px; border-radius: 999px; cursor: pointer; }
    .filter-row button.active { background: #000; color: white; }
    .events-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .event-card { padding: 28px; background: #ffffff; border-radius: 24px; box-shadow: var(--card-shadow); }
    .event-meta { display: flex; justify-content: space-between; font-size: 13px; color: #7b7b7b; margin-bottom: 16px; }
    .event-card h2 { margin-bottom: 12px; font-size: 1.6rem; }
    .event-card p { color: #505050; line-height: 1.75; margin-bottom: 24px; }
    .event-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})
export class EventsComponent {
  selectedCategory = 'All';
  categories = ['All', 'Workshops', 'Webinars', 'Announcements'];
  events = [
    { date: 'Apr 22', type: 'Workshop', title: 'Data Modeling Masterclass', description: 'Learn how to build real-time models from your upload stream.' },
    { date: 'May 3', type: 'Webinar', title: 'AI Workflows in Action', description: 'See how to turn your data into intelligent actions in minutes.' },
    { date: 'May 18', type: 'Announcement', title: 'New Insights Engine', description: 'A preview of the latest AI analytics features coming soon.' }
  ];

  filteredEvents() {
    return this.selectedCategory === 'All'
      ? this.events
      : this.events.filter(e => e.type === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  bookmark(event: any) {
    alert(`Saved event: ${event.title}`);
  }

  join(event: any) {
    alert(`Joining event: ${event.title}`);
  }
}
