import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BannerService } from '../../services/banner.service';
import { Banner } from '../../models/banner.model';

@Component({
  selector: 'app-banner-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './banner-admin.component.html',
  styleUrl: './banner-admin.component.css'
})
export class BannerAdminComponent {

  private bannerService = inject(BannerService);

  banners: Banner[] = [];

  titulo = '';
  descripcion = '';
  boton_texto = '';
  boton_link = '';

  imagenFile: File | null = null;

  loading = false;
  showModal = false;

  previewUrl: string | null = null;
  currentImage: string | null = null
  editingBannerId: number | null = null;

  bannerRoutes = [
    { label: 'Sin enlace', value: '' },
    { label: 'Buzón de sugerencias', value: '/buzon' },
    { label: 'Protocolo institucional', value: '/protocolo' },
    { label: 'Iniciar sesión', value: '/login' }
  ];

  ngOnInit() {
    this.loadBanners();
  }

  // ===============================
  // CARGAR BANNERS
  // ===============================

  loadBanners() {

    this.loading = true;

    this.bannerService.getBanners().subscribe({

      next: (data) => {

        this.banners = data;
        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  // ===============================
  // MODAL
  // ===============================

  openModal() {

    this.showModal = true;

  }

  closeModal() {

    this.showModal = false;
    this.resetForm();

  }

  // ===============================
  // ARCHIVO
  // ===============================

  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (file) {

      this.imagenFile = file;

      const reader = new FileReader();

      reader.onload = () => {

        this.previewUrl = reader.result as string;

      };

      reader.readAsDataURL(file);

    }

  }
  // ===============================
  // CREAR BANNER
  // ===============================

  createBanner() {

    if (!this.titulo) {

      alert('El título es obligatorio');
      return;

    }

    const formData = new FormData();

    formData.append('titulo', this.titulo);
    formData.append('descripcion', this.descripcion);
    formData.append('boton_texto', this.boton_texto);
    formData.append('boton_link', this.boton_link);

    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    this.loading = true;

    if (this.editingBannerId) {

      // EDITAR
      this.bannerService.updateBanner(this.editingBannerId, formData).subscribe({

        next: () => {

          this.loading = false;

          this.closeModal();

          this.loadBanners();

        },

        error: () => {

          this.loading = false;

          alert('Error al actualizar banner');

        }

      });

    } else {

      // CREAR

      if (!this.imagenFile) {

        alert('Debes subir una imagen');
        this.loading = false;
        return;

      }

      this.bannerService.createBanner(formData).subscribe({

        next: () => {

          this.loading = false;

          this.closeModal();

          this.loadBanners();

        },

        error: () => {

          this.loading = false;

          alert('Error al crear banner');

        }

      });

    }

  }

  // ===============================
  // ELIMINAR
  // ===============================

  deleteBanner(id_banner: number) {

    if (!confirm('¿Eliminar banner?')) return;

    this.bannerService.deleteBanner(id_banner).subscribe({

      next: () => {

        this.loadBanners();

      }

    });

  }

  // ===============================
  // EDITAR (para futuro)
  // ===============================

  editBanner(banner: Banner) {

    this.editingBannerId = banner.id_banner;

    this.titulo = banner.titulo;
    this.descripcion = banner.descripcion || '';
    this.boton_texto = banner.boton_texto || '';
    this.boton_link = banner.boton_link || '';

    this.currentImage = 'http://localhost:3000' + banner.imagen;

    this.showModal = true;

  }
  // ===============================
  // RESET
  // ===============================

  resetForm() {

    this.titulo = '';
    this.descripcion = '';
    this.boton_texto = '';
    this.boton_link = '';

    this.imagenFile = null;

    this.previewUrl = null;
    this.currentImage = null;

    this.editingBannerId = null;

  }

}