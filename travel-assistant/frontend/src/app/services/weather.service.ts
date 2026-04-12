import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  constructor(private api: ApiService) {}
  getForecast(city: string): Observable<any> { return this.api.get(`/weather/${city}`); }
  getCoordinates(city: string): Observable<any> { return this.api.get(`/weather/coordinates/${city}`); }
}
