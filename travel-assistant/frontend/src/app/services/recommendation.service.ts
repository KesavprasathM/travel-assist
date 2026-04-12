import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private api: ApiService) {}
  getRecommendations(params: any): Observable<any> {
    const q = new URLSearchParams(params).toString();
    return this.api.get(`/recommendations?${q}`);
  }
}
