import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ChatService, ChatResponse } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { ChatContextService } from '../../services/chat-context.service';

interface ChatMessage {
  speaker: 'bot' | 'user';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <section class="chat-page container">
    <div class="chat-header-card">
      <div>
        <div class="chat-badge">Dora</div>
        <h1>AI-Integrated Travel Guide and Booking Assistant (India)</h1>
        <p>Ask Dora for destination plans, hotel suggestions, local food, cultural festivals, transport prices and booking support for Indian travel.</p>
      </div>
      <div class="chat-actions">
        <a routerLink="/" class="btn btn-secondary">← Home</a>
        <button class="btn btn-explore" (click)="resetChat()">Reset Conversation</button>
      </div>
    </div>

    <div class="chat-shell">
      <div class="chat-window">
        <div *ngFor="let msg of messages" class="message" [class.user-message]="msg.speaker === 'user'" [class.bot-message]="msg.speaker === 'bot'">
          <div class="message-avatar">{{ msg.speaker === 'bot' ? 'D' : 'You' }}</div>
          <div class="message-bubble">{{ msg.text }}</div>
        </div>
      </div>

      <div class="chat-side-panel">
        <div class="context-panel">
          <h2>Session Memory</h2>
          <div class="context-row"><strong>Destination</strong><span>{{ context.destination || 'Not set' }}</span></div>
          <div class="context-row"><strong>Days</strong><span>{{ context.durationDays || 'Not set' }}</span></div>
          <div class="context-row"><strong>Budget</strong><span>{{ context.budgetType || 'Mid-Range' }}</span></div>
          <div class="context-row"><strong>Hotel Preference</strong><span>{{ context.hotelCategory || 'Not set' }}</span></div>
          <div class="context-row"><strong>Food Interest</strong><span>{{ context.foodPreference || 'Not set' }}</span></div>
        </div>

        <div class="quick-panel">
          <h2>Try These</h2>
          <button class="quick-tag" *ngFor="let suggestion of quickReplies" (click)="sendQuick(suggestion)">{{ suggestion }}</button>
        </div>

        <div class="ready-note">
          <strong>Note:</strong>
          <p>Dora uses project travel data for Indian destinations only. Ask for a destination inside India or request a day-wise itinerary.</p>
        </div>
      </div>
    </div>

    <div class="chat-input-bar">
      <input type="text" [(ngModel)]="messageText" placeholder="Ask Dora... e.g. Plan a 5-day trip to Goa" (keydown.enter)="sendMessage()" />
      <button class="btn btn-explore" [disabled]="sending || !messageText.trim()" (click)="sendMessage()">
        {{ sending ? 'Sending...' : 'Send to Dora' }}
      </button>
    </div>
  </section>
  `,
  styles: [`
    .chat-page { padding: 40px 0 80px; }
    .chat-header-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; background: #f8f9ff; padding: 28px 30px; border-radius: 24px; box-shadow: 0 24px 48px rgba(15,23,42,0.08); margin-bottom: 28px; }
    .chat-header-card h1 { margin: 0 0 10px; font-size: 2rem; letter-spacing: -0.03em; color: #101828; }
    .chat-header-card p { margin: 0; max-width: 680px; color: #475569; line-height: 1.8; }
    .chat-badge { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 18px; font-size: 1.1rem; font-weight: 700; background: linear-gradient(135deg, #4f46e5, #0ea5e9); color: white; margin-bottom: 16px; }
    .chat-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .chat-shell { display: grid; grid-template-columns: 2.2fr 1fr; gap: 24px; margin-bottom: 24px; }
    .chat-window { background: white; border-radius: 24px; padding: 24px; min-height: 560px; box-shadow: inset 0 0 0 1px rgba(15,23,42,0.06); overflow-y: auto; display: flex; flex-direction: column; gap: 18px; }
    .message { display: flex; align-items: flex-start; gap: 14px; }
    .message.bot-message { justify-content: flex-start; }
    .message.user-message { justify-content: flex-end; }
    .message-avatar { width: 44px; height: 44px; min-width: 44px; border-radius: 16px; display: grid; place-items: center; font-size: 0.95rem; font-weight: 700; background: #eef2ff; color: #374151; }
    .message.user-message .message-avatar { background: #e0f2fe; color: #0369a1; }
    .message-bubble { max-width: 78%; padding: 18px 20px; border-radius: 24px; font-size: 0.975rem; line-height: 1.7; white-space: pre-line; }
    .bot-message .message-bubble { background: #f8f9ff; color: #101828; border: 1px solid #e2e8f0; border-top-left-radius: 6px; }
    .user-message .message-bubble { background: #0f3460; color: white; border-top-right-radius: 6px; }
    .chat-side-panel { display: flex; flex-direction: column; gap: 22px; }
    .context-panel, .quick-panel, .ready-note { background: white; border-radius: 24px; padding: 22px; box-shadow: 0 18px 40px rgba(15,23,42,0.06); }
    .context-panel h2, .quick-panel h2 { margin: 0 0 16px; font-size: 1.1rem; color: #0f172a; }
    .context-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid #eef2ff; }
    .context-row:first-child { border-top: none; }
    .context-row strong { font-size: 0.95rem; color: #334155; }
    .context-row span { color: #64748b; font-size: 0.92rem; }
    .quick-tag { width: 100%; text-align: left; border: 1px solid #dbeafe; background: #f8fbff; padding: 14px 16px; border-radius: 16px; transition: transform 0.2s, background 0.2s; cursor: pointer; color: #1e293b; margin-bottom: 10px; }
    .quick-tag:hover { transform: translateX(2px); background: #eff6ff; }
    .ready-note strong { display: block; margin-bottom: 8px; }
    .ready-note p { margin: 0; color: #475569; line-height: 1.7; }
    .chat-input-bar { display: flex; gap: 14px; align-items: center; margin-top: 16px; }
    .chat-input-bar input { flex: 1; min-height: 54px; border-radius: 18px; border: 1px solid #cbd5e1; padding: 16px 20px; font-size: 1rem; color: #0f172a; background: white; }
    .chat-input-bar input:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 4px rgba(79,70,229,0.12); }
    .btn { border: none; padding: 14px 24px; border-radius: 18px; cursor: pointer; font-weight: 700; transition: transform 0.2s, filter 0.2s; }
    .btn:hover { transform: translateY(-1px); }
    .btn-explore { background: linear-gradient(135deg, #4f46e5, #0ea5e9); color: white; }
    .btn-secondary { background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; }
    @media (max-width: 1120px) { .chat-shell { grid-template-columns: 1fr; } }
    @media (max-width: 780px) { .chat-header-card { flex-direction: column; } .chat-actions { width: 100%; justify-content: space-between; } .chat-shell { gap: 18px; } }
  `]
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  messageText = '';
  sending = false;
  context: any = { destination: '', durationDays: null, budgetType: 'MID', hotelCategory: '', transportMode: '', foodPreference: '', lastHotelPreference: '', lastFoodPreference: '' };
  quickReplies = [
    'Plan a 5-day trip to Goa',
    'Suggest luxury hotels in Jaipur',
    'What local food should I try in Kerala?',
    'Show transport options from Bengaluru to Goa'
  ];

  constructor(private chatService: ChatService, private auth: AuthService, private router: Router, private chatContext: ChatContextService) {}

  ngOnInit() {
    this.chatContext.context$.subscribe(ctx => {
      this.context = { ...this.context, ...ctx };
    });
    this.addBotMessage(`Hello! I am Dora, your AI Travel Guide. Ask me to plan trips across India with day-wise itineraries, hotel recommendations, local food, cultural festivals and transport estimates.`);
  }

  addBotMessage(text: string) { this.messages.push({ speaker: 'bot', text }); }
  addUserMessage(text: string) { this.messages.push({ speaker: 'user', text }); }

  sendMessage() {
    const message = this.messageText.trim();
    if (!message) return;
    this.addUserMessage(message);
    this.messageText = '';
    this.sending = true;

    this.chatService.sendMessage(message, this.context).subscribe({
      next: res => this.handleResponse(res.data),
      error: () => {
        this.addBotMessage('Sorry, Dora is having trouble connecting right now. Please try again in a moment.');
        this.sending = false;
      }
    });
  }

  sendQuick(value: string) {
    this.messageText = value;
    this.sendMessage();
  }

  handleResponse(response: ChatResponse) {
    if (response.context) { this.context = { ...this.context, ...response.context }; }
    if (response.reply) { this.addBotMessage(response.reply); }
    if (response.quickReplies && response.quickReplies.length) {
      this.quickReplies = response.quickReplies;
    }
    this.sending = false;
  }

  resetChat() {
    this.messages = [];
    this.context = { destination: '', durationDays: null, budgetType: 'MID', hotelCategory: '', transportMode: '', foodPreference: '', lastHotelPreference: '', lastFoodPreference: '' };
    this.quickReplies = [
      'Plan a 5-day trip to Goa',
      'Suggest luxury hotels in Jaipur',
      'What local food should I try in Kerala?',
      'Show transport options from Bengaluru to Goa'
    ];
    this.addBotMessage(`Conversation reset. I am Dora, your AI Travel Guide for Indian destinations. Start by telling me the destination or what you want to explore.`);
  }
}
