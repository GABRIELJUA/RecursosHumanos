import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Recurso } from '../models/recurso.model';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {

  private api = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getSecciones(): Observable<Recurso[]> {
    return this.http.get<Recurso[]>(`${this.api}/recursos`);
  }

  crearSeccion(data: FormData) {
    return this.http.post(`${this.api}/admin/recursos`, data);
  }

  subirArchivo(seccionId: number, data: FormData) {
    return this.http.post(`${this.api}/admin/recursos/${seccionId}/archivo`, data);
  }

  eliminarArchivo(id: number) {
    return this.http.delete(`${this.api}/admin/recursos/archivo/${id}`);
  }

  eliminarSeccion(id: number) {
    return this.http.delete(`${this.api}/admin/recursos/${id}`);
  }

}