import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class DisasterService {
  constructor(private api: ApiService) {}
  getAlerts(destination: string): Observable<any> { return this.api.get(`/disasters/alerts/${destination}`); }
}
