import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="feedback-shell container">
    <div class="feedback-card">
      <div class="feedback-header">
        <h1>Share your experience</h1>
        <p>Help us improve with a quick star rating and short review.</p>
      </div>
      <form class="feedback-form" (submit)="submitFeedback()">
        <div class="rating">
          <input type="radio" id="star-5" name="star-radio" value="5" [(ngModel)]="rating" />
          <label for="star-5"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg></label>
          <input type="radio" id="star-4" name="star-radio" value="4" [(ngModel)]="rating" />
          <label for="star-4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg></label>
          <input type="radio" id="star-3" name="star-radio" value="3" [(ngModel)]="rating" />
          <label for="star-3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg></label>
          <input type="radio" id="star-2" name="star-radio" value="2" [(ngModel)]="rating" />
          <label for="star-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg></label>
          <input type="radio" id="star-1" name="star-radio" value="1" [(ngModel)]="rating" />
          <label for="star-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg></label>
        </div>
        <div class="form-group">
          <label for="feedbackText">Your review</label>
          <textarea id="feedbackText" class="input_field" rows="5" [(ngModel)]="comment" name="comment" placeholder="Write what you loved or what we can improve..."></textarea>
        </div>
        <button type="button" class="btn btn-primary" (click)="submitFeedback()">Submit Feedback</button>
      </form>
      <div class="feedback-success" *ngIf="submitted">
        Thank you! Your rating helps us make trips better.
      </div>
    </div>
  </section>
  `,
  styles: [`
    .feedback-shell { min-height: calc(100vh - 72px); display: flex; justify-content: center; align-items: center; padding: 40px 24px; }
    .feedback-card { width: 100%; max-width: 620px; background: white; border-radius: 28px; padding: 36px; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08); }
    .feedback-header h1 { margin-bottom: 10px; font-size: 2.2rem; }
    .feedback-header p { color: #6b7280; margin-bottom: 28px; }
    .feedback-form { display: flex; flex-direction: column; gap: 24px; }
    .rating { display: flex; flex-direction: row-reverse; gap: 0.3rem; --stroke: #666; --fill: #ffc73a; }
    .rating input { appearance: unset; }
    .rating label { cursor: pointer; }
    .rating svg { width: 2rem; height: 2rem; overflow: visible; fill: transparent; stroke: var(--stroke); stroke-linejoin: bevel; stroke-dasharray: 12; animation: idle 4s linear infinite; transition: stroke 0.2s, fill 0.5s; }
    @keyframes idle { from { stroke-dashoffset: 24; } }
    .rating label:hover svg { stroke: var(--fill); }
    .rating input:checked ~ label svg { transition: 0s; animation: idle 4s linear infinite, yippee 0.75s backwards; fill: var(--fill); stroke: var(--fill); stroke-opacity: 0; stroke-dasharray: 0; stroke-linejoin: miter; stroke-width: 8px; }
    @keyframes yippee { 0% { transform: scale(1); fill: var(--fill); fill-opacity: 0; stroke-opacity: 1; stroke: var(--stroke); stroke-dasharray: 10; stroke-width: 1px; stroke-linejoin: bevel; } 30% { transform: scale(0); fill: var(--fill); fill-opacity: 0; stroke-opacity: 1; stroke: var(--stroke); stroke-dasharray: 10; stroke-width: 1px; stroke-linejoin: bevel; } 30.1% { stroke: var(--fill); stroke-dasharray: 0; stroke-linejoin: miter; stroke-width: 8px; } 60% { transform: scale(1.2); fill: var(--fill); } }
    .form-group { display: flex; flex-direction: column; gap: 10px; }
    .form-group label { font-size: 0.9rem; font-weight: 600; color: #374151; }
    .input_field { width: 100%; min-height: 110px; padding: 14px 16px; border-radius: 14px; border: 1px solid #e5e7eb; background: #f8fafc; font-size: 0.95rem; color: #111827; resize: vertical; }
    .input_field:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,0.12); background: white; }
    .feedback-success { margin-top: 26px; color: #0f5132; background: #d1fae5; border: 1px solid #86efac; padding: 18px 20px; border-radius: 16px; font-weight: 600; }
    .btn-primary { background: linear-gradient(180deg, #363636 0%, #1b1b1b 50%, #000000 100%); color: white; border: none; border-radius: 14px; padding: 16px 20px; cursor: pointer; font-weight: 700; }
    .btn-primary:hover { transform: translateY(-1px); }
    @media (max-width: 768px) { .feedback-shell { padding: 24px 16px; } .feedback-card { padding: 28px; } .rating { justify-content: center; } }
  `]
})
export class FeedbackComponent {
  rating = 5;
  comment = '';
  submitted = false;

  submitFeedback() {
    if (!this.rating && !this.comment) { return; }
    this.submitted = true;
  }
}
