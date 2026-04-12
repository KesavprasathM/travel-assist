import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, User, ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {}

  private loadUser(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  register(data: any): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap(res => { if (res.success) this.saveSession(res.data); })
    );
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(res => { if (res.success) this.saveSession(res.data); })
    );
  }

  private saveSession(data: AuthResponse) {
    localStorage.setItem('token', data.token);
    const user: User = { id: data.userId, name: data.name, email: data.email, role: data.role };
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null { return this.currentUserSubject.value; }
  get isLoggedIn(): boolean { return !!localStorage.getItem('token'); }
}
