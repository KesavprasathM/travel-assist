import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatResponse } from '../../services/chat.service';
import { ChatContextService, ChatContext } from '../../services/chat-context.service';
import { AuthService } from '../../services/auth.service';

interface ChatMessage {
  speaker: 'bot' | 'user';
  text: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="dora-widget" [class.open]="open">
    <button class="widget-toggle" (click)="toggleOpen()">
      <span>❖</span>
      <span *ngIf="!open">Chat</span>
      <span *ngIf="open">Close</span>
    </button>

    <div class="widget-window" *ngIf="open">
      <div class="widget-header">
        <div>
          <div class="widget-title">Dora — Travel Assistant</div>
          <div class="widget-sub">Ask about the current destination, hotels, transport, budget or booking.</div>
        </div>
      </div>

      <div class="widget-context">
        <div class="ctx-item">
          <label>Current</label>
          <input type="text" [(ngModel)]="context.destination" (ngModelChange)="updateContext()" placeholder="source " />
        </div>
        <div class="ctx-item">
          <label>Route</label>
          <div class="route-inputs">
            <input type="text" [(ngModel)]="context.from" (ngModelChange)="updateContext()" placeholder="Any" />
            <span>→</span>
            <input type="text" [(ngModel)]="context.to" (ngModelChange)="updateContext()" [placeholder]="context.destination || 'Any'" />
          </div>
        </div>
        <div class="ctx-item">
          <label>People</label>
          <input type="number" min="0" [(ngModel)]="context.people" (ngModelChange)="updateContext()" />
        </div>
        <div class="ctx-item">
          <label>Budget</label>
          <select [(ngModel)]="context.budgetType" (ngModelChange)="updateContext()">
            <option value="">Any</option>
            <option value="LOW">LOW</option>
            <option value="MID">MID</option>
            <option value="LUXURY">LUXURY</option>
          </select>
        </div>
      </div>

      <div class="widget-messages">
        <div *ngFor="let msg of messages" class="widget-message" [class.user]="msg.speaker === 'user'">
          <div class="message-bubble">{{ msg.text }}</div>
        </div>
      </div>

      <div class="widget-input">
        <input type="text" [(ngModel)]="messageText" placeholder="Ask Dora about this page..." (keydown.enter)="sendMessage()" />
        <button class="btn-send" [disabled]="sending || !messageText.trim()" (click)="sendMessage()">Send</button>
      </div>
      <div class="widget-quick">
        <button class="quick" *ngFor="let quick of quickReplies" (click)="sendQuick(quick)">{{ quick }}</button>
      </div>
      <div class="widget-footer">
        <button class="close-btn close-bottom" (click)="toggleOpen()">Close</button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .dora-widget { position: fixed; right: 24px; bottom: 24px; z-index: 2000; font-family: 'Inter', sans-serif; }
    .widget-toggle { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: linear-gradient(135deg,#4f46e5,#0ea5e9); color: white; border: none; border-radius: 999px; padding: 12px 18px; cursor: pointer; box-shadow: 0 16px 40px rgba(15,23,42,0.18); font-weight: 700; }
    .widget-window { width: min(420px, calc(100vw - 32px)); background: white; border-radius: 24px; box-shadow: 0 24px 64px rgba(15,23,42,0.18); margin-top: 14px; overflow: hidden; display: flex; flex-direction: column; max-height: calc(100vh - 80px); }
    .widget-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 18px 20px; border-bottom: 1px solid #eef2ff; }
    .widget-title { font-size: 1rem; font-weight: 700; color: #101828; }
    .widget-sub { margin-top: 6px; font-size: 13px; color: #475569; line-height: 1.5; }
    .close-btn { background: transparent; border: none; font-size: 14px; cursor: pointer; color: #475569; }
    .widget-footer { padding: 16px 20px 20px; position: sticky; bottom: 0; background: white; z-index: 2; display: flex; justify-content: flex-end; border-top: 1px solid #eef2ff; }
    .close-bottom { border: 1px solid #cbd5e1; border-radius: 999px; padding: 10px 16px; background: #f8fafc; color: #334155; font-weight: 700; }
    .widget-context { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; padding: 0 20px 16px; color: #475569; font-size: 13px; }
    .ctx-item { background: #f8fafc; border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 8px; }
    .ctx-item label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #334155; }
    .ctx-item input, .ctx-item select { width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: 8px 10px; background: white; color: #0f172a; font-size: 13px; }
    .route-inputs { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: center; }
    .route-inputs span { color: #334155; font-weight: 700; } 
    .widget-messages { max-height: 320px; overflow-y: auto; padding: 0 20px 16px; display: flex; flex-direction: column; gap: 12px; }
    .widget-message { display: flex; }
    .widget-message.user { justify-content: flex-end; }
    .message-bubble { border-radius: 20px; padding: 12px 14px; max-width: 85%; background: #f8f9ff; color: #0f172a; font-size: 14px; line-height: 1.6; }
    .widget-message.user .message-bubble { background: #0f3460; color: white; }
    .widget-input { display: flex; gap: 10px; padding: 0 20px 18px; }
    .widget-input input { flex: 1; min-height: 44px; border-radius: 14px; border: 1px solid #cbd5e1; padding: 0 14px; font-size: 14px; }
    .btn-send { background: #4f46e5; color: white; border: none; border-radius: 14px; min-width: 88px; cursor: pointer; font-weight: 700; }
    .widget-quick { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px 18px; }
    .quick { border: 1px solid #e2e8f0; background: #f8f9ff; color: #0f172a; border-radius: 14px; padding: 10px 12px; cursor: pointer; font-size: 12px; }
    @media(max-width:640px) { .dora-widget { right: 12px; bottom: 12px; } .widget-window { width: calc(100vw - 24px); } }
  `]
})
export class ChatWidgetComponent implements OnInit {
  open = false;
  messageText = '';
  sending = false;
  messages: ChatMessage[] = [];
  quickReplies = [
    'What can I do in the current destination?',
    'Show me transport options for this trip',
    'Suggest hotels for a 3-day stay',
    'Give me budget tips for 2 people'
  ];
  context: ChatContext = { destination: '', durationDays: null, budgetType: 'MID', people: 1, from: '', to: '' };

  constructor(private chatService: ChatService, private contextService: ChatContextService, private authService: AuthService) {}

  ngOnInit() {
    this.contextService.context$.subscribe(ctx => { this.context = ctx; });
    if (!this.authService.isLoggedIn) {
      this.addBotMessage('Please sign in to use Dora chat.');
    } else {
      this.addBotMessage('Hi! I am Dora. I can answer using the current page context and destination information.');
    }
  }

  toggleOpen() { this.open = !this.open; }

  addBotMessage(text: string) { this.messages.push({ speaker: 'bot', text }); }
  addUserMessage(text: string) { this.messages.push({ speaker: 'user', text }); }

  updateContext() {
    if (this.context.people == null || this.context.people < 0) {
      this.context.people = 0;
    }
    this.contextService.updateContext({
      destination: this.context.destination,
      from: this.context.from,
      to: this.context.to,
      people: this.context.people,
      budgetType: this.context.budgetType
    });
  }

  sendMessage() {
    const message = this.messageText.trim();
    if (!message) return;
    if (!this.authService.isLoggedIn) {
      this.messageText = '';
      this.addBotMessage('Please sign in to use chat and continue the conversation.');
      return;
    }
    this.addUserMessage(message);
    this.messageText = '';
    this.sending = true;
    this.chatService.sendMessage(message, this.context).subscribe({
      next: res => this.handleResponse(res.data),
      error: () => {
        this.addBotMessage('Sorry, Dora cannot connect right now. Please try again later.');
        this.sending = false;
      }
    });
  }

  sendQuick(value: string) {
    this.messageText = value;
    this.sendMessage();
  }

  handleResponse(response: ChatResponse) {
    if (response.context) { this.contextService.updateContext(response.context); }
    if (response.reply) { this.addBotMessage(response.reply); }
    if (response.quickReplies) { this.quickReplies = response.quickReplies; }
    this.sending = false;
  }
}
