import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacacionesService } from '../../services/vacaciones.service';

@Component({
  selector: 'app-solicitud-vacaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitud-vacaciones.component.html',
  styleUrl: './solicitud-vacaciones.component.css'
})
export class SolicitudVacacionesComponent {


  toast = {
    show: false,
    message: '',
    type: 'info'
  };

  fecha_inicio: string = '';
  fecha_fin: string = '';
  motivo: string = '';
  loading = false;
  today: string = new Date().toISOString().split('T')[0];


  constructor(private vacacionesService: VacacionesService) { }




  enviarSolicitud() {

    // ⛔ evita doble envío
    if (this.loading) {
      return;
    }

    // validaciones básicas
    if (!this.fecha_inicio || !this.fecha_fin) {
      return;
    }

    // validaciones de fechas
    if (!this.fechasValidas) {
      return;
    }

    this.loading = true;

    this.vacacionesService.crearSolicitud({
      fecha_inicio: this.fecha_inicio,
      fecha_fin: this.fecha_fin,
      motivo: this.motivo
    }).subscribe({
      next: () => {
        this.toastMsg('Solicitud enviada correctamente', 'success');

        this.fecha_inicio = '';
        this.fecha_fin = '';
        this.motivo = '';
        this.loading = false;
      },
      error: () => {
        this.toastMsg('Error al enviar la solicitud', 'error');
        this.loading = false;
      }
    });
  }

  get formularioValido(): boolean {
    return !!this.fecha_inicio &&
      !!this.fecha_fin &&
      this.fechasValidas &&
      !this.loading;
  }


  get fechasValidas(): boolean {
    if (!this.fecha_inicio || !this.fecha_fin) return false;

    const inicio = new Date(this.fecha_inicio);
    const fin = new Date(this.fecha_fin);

    // normalizamos hoy (00:00)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (inicio < hoy) return false;
    if (fin < inicio) return false;

    return true;
  }

  toastMsg(msg: string, type: any = 'info') {
    this.toast.message = msg;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => this.toast.show = false, 3000);

  }


}