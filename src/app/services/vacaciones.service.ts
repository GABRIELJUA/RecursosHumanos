import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  private apiUrl = 'http://localhost:3000/api/vacaciones';

  constructor(private http: HttpClient) {}

  crearSolicitud(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { withCredentials: true });
  }

}
