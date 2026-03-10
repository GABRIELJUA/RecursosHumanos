import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private apiUrl = 'http://localhost:3000/api/notificaciones';

  constructor(private http: HttpClient) {}

  // Obtener mis notificaciones
  get() {
    return this.http.get<any[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  // Contar no leídas
  noLeidas() {
    return this.http.get<number>(`${this.apiUrl}/no-leidas`, {
      withCredentials: true
    });
  }

  // Marcar como leída
  leer(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/leida`, {}, {
      withCredentials: true
    });
  }
}
