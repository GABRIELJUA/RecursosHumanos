import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {

  private api = 'http://localhost:3000/api/comunicados';

  constructor(private http: HttpClient) { }

  // ===== listar =====
  getAll() {
    return this.http.get<any[]>(this.api, { withCredentials: true });
  }

  // ===== obtener 1 =====
  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`, { withCredentials: true });
  }

  // ===== crear =====
  create(formData: FormData) {
    return this.http.post(this.api, formData, { withCredentials: true });
  }

  // ===== actualizar =====
  update(id: number, formData: FormData) {
    return this.http.put(`${this.api}/${id}`, formData, { withCredentials: true });
  }

  // ===== eliminar =====
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`, { withCredentials: true });
  }

  // 👉 PUBLICO (empleados)
  getPublicos() {
    return this.http.get<any[]>(`${this.api}/public`);
  }
}
