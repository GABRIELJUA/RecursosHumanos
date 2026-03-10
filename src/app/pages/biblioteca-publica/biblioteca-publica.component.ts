import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryService } from '../../services/library.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-biblioteca-publica',
  imports: [CommonModule],
  templateUrl: './biblioteca-publica.component.html',
  styleUrl: './biblioteca-publica.component.css'
})
export class BibliotecaPublicaComponent implements OnInit {

  private libraryService = inject(LibraryService);
  private sanitizer = inject(DomSanitizer);


  documentos: any[] = [];
  loading = false;

  ngOnInit() {
    this.loading = true;

    this.libraryService.getPublic().subscribe({
      next: (res: any) => {
        this.documentos = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getFileUrl(ruta: string) {
    return 'http://localhost:3000' + ruta;
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

  trackByDocumento(index: number, item: any): string {
    return item.id || item.archivo_url;
  }
}