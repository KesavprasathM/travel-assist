import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="page-shell">
    <div class="page-header">
      <h1>Actions</h1>
      <p>Run intelligent actions that help you organize, analyze, and boost productivity instantly.</p>
    </div>
    <div class="actions-grid">
      <div class="action-card" *ngFor="let action of actions">
        <h2>{{ action.title }}</h2>
        <p>{{ action.description }}</p>
        <div class="action-controls">
          <button class="btn btn-primary" (click)="execute(action)">Execute</button>
          <span class="status">{{ action.status }}</span>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [`
    .page-shell { padding: 80px 120px; color: #101010; }
    .page-header h1 { font-size: 3rem; margin-bottom: 14px; font-family: var(--font-display); }
    .page-header p { max-width: 720px; color: #505050; }
    .actions-grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .action-card { padding: 28px; background: #ffffff; border-radius: 24px; box-shadow: var(--card-shadow); display: flex; flex-direction: column; gap: 20px; }
    .action-card h2 { font-size: 1.75rem; margin: 0; }
    .action-card p { color: #505050; line-height: 1.8; }
    .action-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .status { color: #505050; font-size: 14px; }
  `]
})
export class ActionsComponent {
  actions = [
    { title: 'Auto-Tag Data', description: 'Automatically categorize uploaded records for easier analysis.', status: 'Ready' },
    { title: 'Generate Summary', description: 'Create concise action plans from your uploaded information.', status: 'Idle' },
    { title: 'Optimize Workflow', description: 'Run a productivity check and receive improvement suggestions.', status: 'Waiting' }
  ];

  execute(action: any) {
    action.status = 'Running';
    setTimeout(() => action.status = 'Completed', 1200);
  }
}
