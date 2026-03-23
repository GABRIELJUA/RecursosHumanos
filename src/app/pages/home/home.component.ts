import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';


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
export class HomeComponent implements AfterViewInit, OnInit {

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

        // 👇 IMPORTANTE
        setTimeout(() => {
          this.renderChart();
        }, 0);

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


  chart: any;

  colors = [
    '#f97316', // naranja
    '#3b82f6', // azul
    '#10b981', // verde
    '#a855f7', // morado
    '#ec4899', // rosa
    '#14b8a6',
    '#f59e0b'
  ];

  ngAfterViewInit() {
    this.renderChart();
  }

  renderChart() {

    if (this.chart) {
      this.chart.destroy(); // 💣 evita duplicados
    }

    const labels = this.distribucionDepartamentos.map(d => d.departamento);
    const data = this.distribucionDepartamentos.map(d => d.total);

    const ctx = document.getElementById('chartDepartamentos') as any;

    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.colors,
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

}