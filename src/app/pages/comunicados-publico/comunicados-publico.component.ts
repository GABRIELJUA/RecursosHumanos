import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunicadoService } from '../../services/comunicado.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-comunicados-publico',
  imports: [CommonModule],
  templateUrl: './comunicados-publico.component.html',
  styleUrl: './comunicados-publico.component.css'
})
export class ComunicadosPublicoComponent implements OnInit {

  comunicados: any[] = [];
  filtro: 'hoy' | 'anteriores' | 'todos' = 'hoy';



  private api = inject(ComunicadoService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.api.getPublicos().subscribe({
      next: res => this.comunicados = res,
      error: err => console.error(err)
    });
  }

  get comunicadosFiltrados() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (this.filtro === 'todos') {
      return this.comunicados;
    }

    if (this.filtro === 'hoy') {
      return this.comunicados.filter(c =>
        new Date(c.fecha_publicacion) >= hoy
      );
    }

    // anteriores
    return this.comunicados.filter(c =>
      new Date(c.fecha_publicacion) < hoy
    );
  }


  // ====== ARCHIVOS ======

  getFileUrl(ruta: string) {
    return 'http://localhost:3000' + ruta;
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

  getIconoArchivo(ruta?: string): string {

    if (!ruta) return 'assets/icons/file.png';

    const ext = ruta.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return 'assets/icon/pdf.png';
    if (ext === 'doc' || ext === 'docx') return 'assets/icon/oficina.png';
    if (ext === 'xls' || ext === 'xlsx') return 'assets/icon/sobresalir.png';
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext!)) return 'assets/icon/galeria.png';

    return 'assets/icons/file.png';
  }

}