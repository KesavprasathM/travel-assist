import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Payment, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private api: ApiService) {}
  processPayment(data: any): Observable<ApiResponse<Payment>> { return this.api.post('/payments', data); }
  getMyPayments(): Observable<ApiResponse<Payment[]>> { return this.api.get('/payments'); }
}
