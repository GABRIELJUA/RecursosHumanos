import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/audit-log';

  getLogs(filters: any): Observable<any> {

    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {

      if (
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        params = params.set(key, String(value));
      }

    });

    return this.http.get<any>(
      this.api,
      {
        params,
        withCredentials: true
      }
    );
  }
}