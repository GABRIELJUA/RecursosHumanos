import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SugerenciasService } from '../../services/sugerencias.service';
import { Sugerencia } from '../../models/sugerencia.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestionsugerencias',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionsugerencias.component.html',
  styleUrl: './gestionsugerencias.component.css'
})
export class GestionsugerenciasComponent implements OnInit {


  sugerencias: Sugerencia[] = [];
  loading = true;
  searchTerm: string = '';
  estadoFiltro: string = '';

  sugerenciasFiltradas: Sugerencia[] = [];

  verSugerencia = false;
  sugerenciaSeleccionada: Sugerencia | null = null;

  constructor(private sugerenciasService: SugerenciasService) { }

  ngOnInit() {

    this.sugerenciasService.getAll().subscribe({

      next: (data) => {

        this.sugerencias = data;
        this.sugerenciasFiltradas = data;

        this.loading = false;

      },

      error: () => {
        this.loading = false;
      }

    });

  }

  filtrarSugerencias() {

    this.sugerenciasFiltradas = this.sugerencias.filter(s => {

      const coincideComentario =
        !this.searchTerm ||
        s.comentario.toLowerCase().includes(this.searchTerm.toLowerCase());

      return coincideComentario;

    });

  }

  limpiarFiltros() {

    this.searchTerm = '';
    this.estadoFiltro = '';

    this.sugerenciasFiltradas = [...this.sugerencias];

  }

  abrirDetalle(s: Sugerencia) {
    this.sugerenciaSeleccionada = s;
    this.verSugerencia = true;
  }

  cerrarDetalle() {
    this.verSugerencia = false;
    this.sugerenciaSeleccionada = null;
  }

  // detectar navegador
  getBrowser(userAgent: string | null): string {

    if (!userAgent) return 'Desconocido';

    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';

    return 'Otro';

  }

  // detectar sistema operativo
  getOS(userAgent: string | null): string {

    if (!userAgent) return 'Desconocido';

    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';

    return 'Otro';

  }

  // mostrar alerta solo una vez por dispositivo
  isFirstDeviceOccurrence(index: number, deviceId: string | null): boolean {

    if (!deviceId) return false;

    return this.sugerencias.findIndex(s => s.device_id === deviceId) === index;

  }

}