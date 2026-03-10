import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";


import { DashboardService } from '../../services/dashboard.service';

export interface DashboardSummary {
  empleados: number;
  sugerencias: number;
  comunicados: number;
  vacaciones: number;
}


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private dashboardService = inject(DashboardService);
  // Datos de ejemplo que luego vendrán de un Servicio/API

  distribucionDepartamentos: any[] = [];



  summary!: DashboardSummary;

  loading = true;
  errorMessage: string | null = null;


  ngOnInit(): void {

    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.summary = res;
      }
    });

    this.dashboardService.getDistribucion().subscribe({
      next: (res) => {
        this.distribucionDepartamentos = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al cargar distribución';
      }
    });
  }
trackByDepartamento(index: number, item: any): string {
  return item.departamento;
}

}