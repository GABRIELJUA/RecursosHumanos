import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  empleados: number;
  sugerencias: number;
  comunicados: number;
  vacaciones: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`, { withCredentials: true });
  }

  getDistribucion() {
    return this.http.get<any[]>(`${this.apiUrl}/distribucion`, { withCredentials: true });
  }

  getDistribucionEmpleados() {
    return this.http.get<any[]>(
      `${this.apiUrl}/distribucion-empleados`,
      { withCredentials: true }
    );
  }

}
