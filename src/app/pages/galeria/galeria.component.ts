import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../services/gallery.service';
import { Album, Photo } from '../../models/gallery.model';
import { forkJoin } from 'rxjs';

interface AlbumWithPhotos extends Album {
  fotos: Photo[];
}

@Component({
  selector: 'app-galeria',
  imports: [CommonModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit {


  private galleryService = inject(GalleryService);

  albums: AlbumWithPhotos[] = [];
  allPhotos: Photo[] = [];

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadAlbums();
  }

  loadAlbums(): void {
    this.loading = true;
    this.error = null;

    this.galleryService.getPublicAlbums({ limit: 50 }).subscribe({
      next: (response) => {

        const albums = response.data;

        if (!albums.length) {
          this.albums = [];
          this.allPhotos = [];
          this.loading = false;
          return;
        }

        const requests = albums.map(album =>
          this.galleryService.getPublicAlbumPhotos(album.id)
        );

        forkJoin(requests).subscribe({
          next: (responses) => {

            // Unimos fotos a cada álbum
            this.albums = albums.map((album, index) => ({
              ...album,
              fotos: responses[index].fotos
            }));

            // 🔥 AQUÍ ESTÁ LA CLAVE
            // Creamos un solo feed continuo
            this.allPhotos = this.albums.flatMap(a => a.fotos);

            this.loading = false;
          },
          error: () => {
            this.error = 'Error cargando fotografías';
            this.loading = false;
          }
        });

      },
      error: () => {
        this.error = 'No se pudieron cargar los álbumes';
        this.loading = false;
      }
    });
  }

  trackByPhoto(index: number, photo: Photo): number {
    return photo.id;
  }
  trackByAlbumId(index: number, album: Album): number {
    return album.id;
  }
}