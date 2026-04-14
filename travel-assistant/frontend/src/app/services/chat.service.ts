import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models';

export interface ChatResponse {
  reply: string;
  context: any;
  quickReplies?: string[];
  transportOptions?: any[];
  hotelOptions?: string[];
  requiresLogin?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private api: ApiService) {}

  sendMessage(message: string, context: any): Observable<ApiResponse<ChatResponse>> {
    return this.api.post<ChatResponse>('/chat', { message, context });
  }
}
