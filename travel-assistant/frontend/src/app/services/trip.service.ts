import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TripPlan, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class TripService {
  constructor(private api: ApiService) {}
  createPlan(data: any): Observable<ApiResponse<TripPlan>> { return this.api.post('/trips', data); }
  getMyPlans(): Observable<ApiResponse<TripPlan[]>> { return this.api.get('/trips'); }
  getPlanById(id: number): Observable<ApiResponse<TripPlan>> { return this.api.get(`/trips/${id}`); }
  updateStatus(id: number, status: string): Observable<ApiResponse<TripPlan>> {
    return this.api.put(`/trips/${id}/status?status=${status}`);
  }
}
