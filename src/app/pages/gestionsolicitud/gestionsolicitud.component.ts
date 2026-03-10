import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacacionesAdminService } from '../../services/vacaciones-admin.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-gestionsolicitud',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionsolicitud.component.html',
  styleUrl: './gestionsolicitud.component.css'
})
export class GestionsolicitudComponent implements OnInit {

  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];

  loading = true;
  filtro: 'todas' | 'hoy' = 'hoy';
  searchNomina: string = '';




  constructor(private vacacionesService: VacacionesAdminService) { }

  ngOnInit(): void {
    this.vacacionesService.getSolicitudes().subscribe({
      next: data => {
        this.solicitudes = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  setFiltro(tipo: 'todas' | 'hoy') {
    this.filtro = tipo;
    this.aplicarFiltros();
  }

  aplicarFiltros() {

    let data = [...this.solicitudes];

    // Filtro hoy
    if (this.filtro === 'hoy') {
      const hoy = new Date().toDateString();
      data = data.filter(s =>
        new Date(s.creado_en).toDateString() === hoy
      );
    }

    // Filtro por nómina
    if (this.searchNomina.trim()) {
      data = data.filter(s =>
        s.num_nomina
          ?.toString()
          .includes(this.searchNomina.trim())
      );
    }

    this.solicitudesFiltradas = data;
  }

  exportarExcel(): void {
    if (!this.solicitudesFiltradas.length) return;

    const data = this.solicitudesFiltradas.map(s => ({
      Empleado: s.empleado,
      'Fecha inicio': this.formatDate(s.fecha_inicio),
      'Fecha fin': this.formatDate(s.fecha_fin),
      Motivo: s.motivo?.trim() || 'Sin motivo',
      'Creado el': this.formatDate(s.creado_en)
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // 📏 Ajustar ancho de columnas
    worksheet['!cols'] = [
      { wch: 25 }, // Empleado
      { wch: 15 }, // Fecha inicio
      { wch: 15 }, // Fecha fin
      { wch: 25 }, // Motivo
      { wch: 15 }  // Creado el
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Solicitudes de Vacaciones': worksheet },
      SheetNames: ['Solicitudes de Vacaciones']
    };

    // ❄️ Congelar encabezado
    worksheet['!freeze'] = { ySplit: 1 };

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(blob, `solicitudes_${this.filtro}_${this.fechaHoy()}.xlsx`);
  }

  private fechaHoy(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private formatDate(fecha: string | Date): string {
    const d = new Date(fecha);

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }

  calcularDias(inicio: string, fin: string): number {
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);

  const diferencia = fechaFin.getTime() - fechaInicio.getTime();
  return Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
}



}