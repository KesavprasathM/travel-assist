import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private api: ApiService) {}
  addReview(data: any): Observable<ApiResponse<Review>> { return this.api.post('/reviews', data); }
  getByDestination(name: string): Observable<ApiResponse<Review[]>> { return this.api.get(`/reviews/destination/${name}`); }
  getMyReviews(): Observable<ApiResponse<Review[]>> { return this.api.get('/reviews/my'); }
}
