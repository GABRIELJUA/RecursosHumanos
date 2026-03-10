import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sugerencia } from '../models/sugerencia.model';

@Injectable({ providedIn: 'root' })
export class SugerenciasService {

  private apiUrl = 'http://localhost:3000/api/sugerencias';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sugerencia[]> {
    return this.http.get<Sugerencia[]>(this.apiUrl);
  }
}
