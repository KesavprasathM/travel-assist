import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatContext {
  destination?: string;
  durationDays?: number | null;
  budgetType?: string;
  hotelCategory?: string;
  transportMode?: string;
  foodPreference?: string;
  people?: number;
  from?: string;
  to?: string;
}

@Injectable({ providedIn: 'root' })
export class ChatContextService {
  private contextSubject = new BehaviorSubject<ChatContext>({
    destination: '',
    durationDays: null,
    budgetType: 'MID',
    hotelCategory: '',
    transportMode: '',
    foodPreference: '',
    people: 1,
    from: '',
    to: ''
  });

  context$ = this.contextSubject.asObservable();

  get context(): ChatContext { return this.contextSubject.value; }

  updateContext(context: Partial<ChatContext>) {
    this.contextSubject.next({ ...this.contextSubject.value, ...context });
  }

  resetContext() {
    this.contextSubject.next({
      destination: '',
      durationDays: null,
      budgetType: 'MID',
      hotelCategory: '',
      transportMode: '',
      foodPreference: '',
      people: 1,
      from: '',
      to: ''
    });
  }
}
