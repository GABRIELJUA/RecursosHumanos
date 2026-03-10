import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
// Datos simulados para los reportes
  monthlyStats = {
    totalPayroll: 245800,
    attendanceRate: 94,
    activeEmployees: 128,
    pendingAdvances: 12450
  };

  departmentData = [
    { name: 'Tecnología', count: 45, color: 'bg-indigo-500' },
    { name: 'Recursos Humanos', count: 12, color: 'bg-emerald-500' },
    { name: 'Ventas', count: 38, color: 'bg-amber-500' },
    { name: 'Operaciones', count: 33, color: 'bg-rose-500' }
  ];
}