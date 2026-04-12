import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Destination, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  constructor(private api: ApiService) {}
  getAll(): Observable<ApiResponse<Destination[]>> { return this.api.get('/destinations'); }
  getById(id: number): Observable<ApiResponse<Destination>> { return this.api.get(`/destinations/${id}`); }
  getByName(name: string): Observable<ApiResponse<Destination>> { return this.api.get(`/destinations/name/${name}`); }
  search(q: string): Observable<ApiResponse<Destination[]>> { return this.api.get(`/destinations/search?q=${q}`); }
  getTopRated(): Observable<ApiResponse<Destination[]>> { return this.api.get('/destinations/top-rated'); }
  getByType(type: string): Observable<ApiResponse<Destination[]>> { return this.api.get(`/destinations/type/${type}`); }
}
