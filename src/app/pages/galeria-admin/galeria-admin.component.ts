import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../services/gallery.service';
import { Album, Photo } from '../../models/gallery.model';

@Component({
  selector: 'app-galeria-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './galeria-admin.component.html',
  styleUrl: './galeria-admin.component.css'
})
export class GaleriaAdminComponent implements OnInit {

  albums: Album[] = [];
  loading = false;

  // Crear álbum
  showModal = false;
  submitting = false;
  error: string | null = null;

  form = {
    nombre: '',
    descripcion: '',
    anio: new Date().getFullYear()
  };

  selectedFiles: File[] = [];

  pendingPhotos: File[] = [];
  previewUrls: string[] = [];

  // Detalle álbum
  showDetailModal = false;
  detailAlbum: Album | null = null;
  albumPhotos: Photo[] = [];
  loadingPhotos = false;
  uploadingPhotos = false;

  constructor(private galleryService: GalleryService) { }

  ngOnInit(): void {
    this.loadAlbums();
  }

  // =========================
  // CARGAR ALBUMES
  // =========================

  loadAlbums(): void {
    this.loading = true;

    this.galleryService.getPublicAlbums({ limit: 100 }).subscribe({
      next: (res) => {
        this.albums = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  trackById(index: number, album: Album): number {
    return album.id;
  }

  // =========================
  // CREAR ALBUM
  // =========================

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.form = {
      nombre: '',
      descripcion: '',
      anio: new Date().getFullYear()
    };
    this.selectedFiles = [];
    this.error = null;
  }

  onFileChange(event: any): void {
    if (event.target.files?.length) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  createAlbum(): void {

    if (!this.form.nombre || !this.selectedFiles.length) {
      this.error = 'Nombre y al menos una foto son obligatorios';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.galleryService
      .createAlbum(this.form, this.selectedFiles)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.closeModal();
          this.loadAlbums();
        },
        error: (err) => {
          this.submitting = false;
          this.error = err.error?.message || 'Error al crear álbum';
        }
      });
  }

  deleteAlbum(albumId: number): void {

    if (!confirm('¿Seguro que deseas eliminar este álbum?')) return;

    this.galleryService.deleteAlbum(albumId).subscribe({
      next: () => this.loadAlbums()
    });
  }

  // =========================
  // DETALLE ALBUM
  // =========================

  openDetail(album: Album): void {
    this.detailAlbum = album;
    this.showDetailModal = true;
    this.loadAlbumPhotos(album.id);
  }

  closeDetail(): void {
    this.showDetailModal = false;
    this.detailAlbum = null;
    this.albumPhotos = [];
  }

  loadAlbumPhotos(albumId: number): void {
    this.loadingPhotos = true;

    this.galleryService.getPublicAlbumPhotos(albumId).subscribe({
      next: (res) => {
        this.albumPhotos = res.fotos;
        this.loadingPhotos = false;
      },
      error: () => {
        this.loadingPhotos = false;
      }
    });
  }

  deletePhoto(photoId: number): void {

    if (!confirm('¿Eliminar esta foto?')) return;

    this.galleryService.deletePhoto(photoId).subscribe({
      next: () => {
        this.albumPhotos = this.albumPhotos.filter(p => p.id !== photoId);
      }
    });
  }

  // =========================
  // SUBIR FOTOS DESDE DETALLE
  // =========================

  onAddPhotosChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.pendingPhotos = Array.from(input.files);

    // Generar previews
    this.previewUrls = this.pendingPhotos.map(file =>
      URL.createObjectURL(file)
    );

    input.value = '';
  }

  saveNewPhotos(): void {

    if (!this.detailAlbum || this.pendingPhotos.length === 0) return;

    this.uploadingPhotos = true;

    this.galleryService
      .addPhotosToAlbum(this.detailAlbum.id, this.pendingPhotos)
      .subscribe({
        next: () => {
          this.uploadingPhotos = false;

          this.pendingPhotos = [];
          this.previewUrls = [];

          this.closeDetail(); // Cierra modal
          this.loadAlbums();  // Actualiza contador
        },
        error: () => {
          this.uploadingPhotos = false;
        }
      });
  }
}