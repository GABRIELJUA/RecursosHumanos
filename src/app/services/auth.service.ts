import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginCredentials {
  num_nomina: string;
  password: string;
}

export interface AuthUser {
  id?: number;
  nombre?: string;
  rol: string;
}

export interface LoginResponse {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/auth';

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials,
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }

  checkAuth(): Observable<AuthUser> {
    return this.http.get<AuthUser>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    );
  }

  getMe(): Observable<AuthUser> {
    return this.checkAuth();
  }
}
