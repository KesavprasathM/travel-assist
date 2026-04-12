import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Booking, TransportOption, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private api: ApiService) {}
  createBooking(data: any): Observable<ApiResponse<Booking>> { return this.api.post('/bookings', data); }
  getMyBookings(): Observable<ApiResponse<Booking[]>> { return this.api.get('/bookings'); }
  getById(id: number): Observable<ApiResponse<Booking>> { return this.api.get(`/bookings/${id}`); }
  cancelBooking(id: number): Observable<ApiResponse<Booking>> { return this.api.put(`/bookings/${id}/cancel`); }
  searchTransports(from: string, to: string, date: string, type: string): Observable<ApiResponse<TransportOption[]>> {
    return this.api.get(`/bookings/search?from=${from}&to=${to}&date=${date}&type=${type}`);
  }
}
