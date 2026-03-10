import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-biblioteca',
  imports: [CommonModule, FormsModule],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.css'
})
export class BibliotecaComponent implements OnInit {

  private sanitizer = inject(DomSanitizer);

  mostrarSubir = false;
  loading = false;

  documentos: any[] = [];
  busqueda = '';
  rolUsuario = '';
  categoriaFiltro = '';
  documentosFiltrados: any[] = [];
  canUpload = false;
  canDelete = false;



  form: any = {
    titulo: '',
    categoria: '',
    descripcion: ''
  };

  toast = {
    show: false,
    message: '',
    type: 'info'
  };
  mostrarConfirmDelete = false;
  docEliminarId: number | null = null;


  archivoSeleccionado: any = null;
  private authService = inject(AuthService);
  private router = inject(Router);


  constructor(private libraryService: LibraryService) { }

  ngOnInit() {
    // 🔐 obtener usuario actual y rol real
    this.authService.getMe().subscribe({
      next: (user: any) => {
        this.rolUsuario = user.rol;
        this.setPermissions();
        this.cargar();

      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  // ================== CARGAR ==================
  cargar() {
    this.loading = true;


    this.libraryService.getAll().subscribe({
      next: (res: any) => {
        this.documentos = res;
        this.loading = false;
        this.documentosFiltrados = res;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ================== SELECCIONAR ARCHIVO ==================
  onFileChange(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  // ================== SUBIR ==================
  subir() {
    if (!this.form.titulo) {
      alert('Título requerido');
      return;
    }

    if (!this.archivoSeleccionado) {
      alert('Selecciona archivo');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.form.titulo);
    formData.append('categoria', this.form.categoria);
    formData.append('descripcion', this.form.descripcion || '');
    formData.append('archivo', this.archivoSeleccionado);

    this.libraryService.upload(formData).subscribe({
      next: () => {
        this.mostrarSubir = false;
        this.form = { titulo: '', categoria: '', descripcion: '' };
        this.archivoSeleccionado = null;
        this.cargar();

        this.mostrarToast('Documento subido correctamente', 'success');
      },
      error: (err) => {
        this.mostrarToast(err.error?.message || 'Error al subir', 'error');
      }

    });
  }

  // ================== ELIMINAR ==================
  eliminar(id: number) {

    if (this.rolUsuario !== 'ADMIN') {
      this.mostrarToast('No tienes permisos para eliminar', 'error');
      return;
    }

    this.docEliminarId = id;
    this.mostrarConfirmDelete = true;
  }

  confirmarEliminar() {

    if (!this.docEliminarId) return;

    this.libraryService.delete(this.docEliminarId).subscribe({
      next: () => {
        this.mostrarToast('Documento eliminado', 'success');
        this.cargar();
        this.cancelarEliminar();
      },
      error: () => {
        this.mostrarToast('Error al eliminar', 'error');
        this.cancelarEliminar();
      }
    });

  }

  cancelarEliminar() {
    this.mostrarConfirmDelete = false;
    this.docEliminarId = null;
  }

  // ================== URL COMPLETA ==================
  getFileUrl(ruta: string) {
    return 'http://localhost:3000' + ruta;
  }

  filtrar() {
    this.documentosFiltrados = this.documentos.filter(d => {

      const coincideTexto =
        d.titulo?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        d.categoria?.toLowerCase().includes(this.busqueda.toLowerCase());

      const coincideCategoria =
        !this.categoriaFiltro || d.categoria === this.categoriaFiltro;

      return coincideTexto && coincideCategoria;
    });
  }

  getIconoArchivo(ruta?: string): string {

    if (!ruta) return 'assets/icons/file.png';

    const ext = ruta.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return 'assets/icon/pdf.png';
    if (ext === 'doc' || ext === 'docx') return 'assets/icon/oficina.png';
    if (ext === 'xls' || ext === 'xlsx') return 'assets/icon/sobresalir.png';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'assets/icon/galeria.png';

    return 'assets/icons/file.png';
  }
  getTipoArchivo(ruta?: string) {

    if (!ruta) return 'none';

    const ext = ruta.split('.').pop()?.toLowerCase();

    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext!)) return 'image';
    if (ext === 'pdf') return 'pdf';

    return 'file';
  }


  getSafePdfUrl(ruta: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getFileUrl(ruta)
    );
  }


  abrirModalSubir() {

    if (this.rolUsuario === 'ADMIN_LECTURA') {
      this.mostrarToast('Solo tienes permisos de lectura', 'warning');
      return;
    }

    this.mostrarSubir = true;
  }

  mostrarToast(msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    this.toast.message = msg;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
    }, 3500);
  }

  setPermissions() {

    // Resetear primero
    this.canUpload = false;
    this.canDelete = false;


    if (this.rolUsuario === 'ADMIN') {
      this.canUpload = true;
      this.canDelete = true;
    }

    if (this.rolUsuario === 'ADMIN_EDITOR') {
      this.canUpload = true;
    }

    // ADMIN_LECTURA → solo ver
  }

}
