import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Album,
  AlbumPhotosResponse,
  PaginatedAlbums
} from '../models/gallery.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  private apiUrl = 'http://localhost:3000/api/galeria';

  constructor(private http: HttpClient) {}

  // =====================================================
  // ================== PUBLIC ===========================
  // =====================================================

  getPublicAlbums(filters?: {
    anio?: number;
    q?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedAlbums> {

    let params = new HttpParams();

    if (filters?.anio) {
      params = params.set('anio', filters.anio.toString());
    }

    if (filters?.q) {
      params = params.set('q', filters.q);
    }

    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }

    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedAlbums>(
      `${this.apiUrl}/public/albums`,
      { params, withCredentials: true }
    );
  }

  getPublicAlbumPhotos(albumId: number): Observable<AlbumPhotosResponse> {
    return this.http.get<AlbumPhotosResponse>(
      `${this.apiUrl}/public/albums/${albumId}/photos`,
      { withCredentials: true }
    );
  }

  // =====================================================
  // ================== ADMIN ============================
  // =====================================================

  /**
   * Crear álbum con fotos
   */
  createAlbum(
    data: {
      nombre: string;
      descripcion?: string;
      anio?: number;
    },
    files: File[]
  ): Observable<{ message: string; id: number }> {

    const formData = new FormData();

    formData.append('nombre', data.nombre);

    if (data.descripcion) {
      formData.append('descripcion', data.descripcion);
    }

    if (data.anio) {
      formData.append('anio', data.anio.toString());
    }

    files.forEach(file => {
      formData.append('fotos', file);
    });

    return this.http.post<{ message: string; id: number }>(
      `${this.apiUrl}/albums`,
      formData,
      { withCredentials: true }
    );
  }

  /**
   * Agregar fotos a un álbum existente
   */
  addPhotosToAlbum(albumId: number, files: File[]): Observable<{ message: string }> {

    const formData = new FormData();

    files.forEach(file => {
      formData.append('fotos', file);
    });

    return this.http.post<{ message: string }>(
      `${this.apiUrl}/albums/${albumId}/photos`,
      formData,
      { withCredentials: true }
    );
  }

  /**
   * Eliminar foto
   */
  deletePhoto(photoId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/photos/${photoId}`,
      { withCredentials: true }
    );
  }

  /**
   * Eliminar álbum completo
   */
  deleteAlbum(albumId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/albums/${albumId}`,
      { withCredentials: true }
    );
  }

}