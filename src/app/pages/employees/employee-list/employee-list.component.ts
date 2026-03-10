import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';





export interface Employee {
  id_empleado?: number;
  num_nomina: string;
  password?: string;
  rol: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  sexo: string;
  estado_civil: string;
  rfc: string;
  curp: string;
  nss: string;
  correo: string;
  fecha_ingreso: string;
  puesto: string;
  departamento: string;
  domicilio?: string;
  telefono?: string;
}



@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {

  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private searchSubject = new Subject<string>();

  currentUserRole = '';
  canCreate = false;
  canEdit = false;

  searchTerm: string = '';
  departamentoSeleccionado: string = '';

  departamentos: { nombre: string; total: number }[] = [];


  pageSizeOptions = [5, 10, 20, 50];
  limit = 10;

  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;

  // 🔥 Ordenamiento
  sortField: string = 'fecha_ingreso'; // default
  sortOrder: 'asc' | 'desc' = 'desc';


  onLimitChange() {
    this.currentPage = 1;
    this.loadEmployees();
  }

  employees: Employee[] = [];
  loading = true;
  errorMessage: string | null = null;

  loadDepartamentos(): void {
    this.dashboardService.getDistribucionEmpleados().subscribe({
      next: (res: any[]) => {
        this.departamentos = res.map(d => ({
          nombre: d.departamento,
          total: d.total
        }));
      },
      error: (err) => {
        console.error('Error cargando departamentos', err);
      }
    });
  }

  mostrarDepto = false;
  busquedaDepto = '';

  toggleDepto() {
    this.mostrarDepto = !this.mostrarDepto;
  }

  seleccionarDepto(nombre: string) {
    this.departamentoSeleccionado = nombre;
    this.mostrarDepto = false;
    this.currentPage = 1;
    this.loadEmployees();
  }

  departamentosFiltrados() {
    return this.departamentos.filter(d =>
      d.nombre.toLowerCase().includes(this.busquedaDepto.toLowerCase())
    );
  }


  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (user: any) => {
        this.currentUserRole = user.rol;
        this.setPermissions();
        this.loadDepartamentos();
        this.loadEmployees();
        this.searchSubject
          .pipe(
            debounceTime(400),        // espera 400ms
            distinctUntilChanged()    // evita repetir lo mismo
          )
          .subscribe(() => {
            this.currentPage = 1;
            this.loadEmployees();
          });
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }


  loadEmployees(): void {
    this.loading = true;

    const filtros = {
      roles: 'EMPLEADO', // 👈 ahora el backend filtra esto
      departamento: this.departamentoSeleccionado || undefined,
      q: this.searchTerm || undefined
    };

    this.employeeService
      .getEmployees(this.currentPage, this.limit, filtros, this.sortField, this.sortOrder)
      .subscribe({
        next: res => {

          this.employees = res.data; // ya viene filtrado
          this.totalPages = res.totalPages;
          this.totalRecords = res.total;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
          this.errorMessage = 'Error al cargar empleados';
        }
      });
  }

  get filtrosActivos(): boolean {
    return !!this.searchTerm || !!this.departamentoSeleccionado;
  }

  onSearch() {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onDepartamentoChange() {
    this.currentPage = 1;
    this.loadEmployees();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmployees();
    }
  }
  setPermissions() {
    const permissions: Record<string, { create: boolean; edit: boolean }> = {
      ADMIN: { create: true, edit: true },
      ADMIN_EDITOR: { create: false, edit: true },
      ADMIN_LECTURA: { create: false, edit: false }
    };

    const rolePerms = permissions[this.currentUserRole] || { create: false, edit: false };

    this.canCreate = rolePerms.create;
    this.canEdit = rolePerms.edit;
  }

  ordenar(campo: string) {

    if (this.sortField === campo) {
      // Alternar dirección si ya estaba activa
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Cambiar columna y empezar en asc
      this.sortField = campo;
      this.sortOrder = 'asc';
    }

    this.currentPage = 1;
    this.loadEmployees();
  }

  exportarExcel(): void {
    if (!this.employees.length) return;

    const data = this.employees.map(e => ({
      'No. Nómina': e.num_nomina,
      'Nombre completo': `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`,
      Correo: e.correo,
      Puesto: e.puesto,
      Departamento: e.departamento,
      Rol: e.rol,
      RFC: e.rfc,
      CURP: e.curp,
      NSS: e.nss,
      Domicilio: e.domicilio,
      Teléfono: e.telefono,
      'Fecha ingreso': this.formatDate(e.fecha_ingreso),
      Sexo: e.sexo,
      'Estado civil': e.estado_civil,
      Edad: this.calcularEdad(e.fecha_nacimiento)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // 📏 Ancho de columnas
    worksheet['!cols'] = [
      { wch: 14 }, // Nómina
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellido paterno
      { wch: 20 }, // Apellido materno
      { wch: 30 }, // Correo
      { wch: 20 }, // Puesto
      { wch: 20 }, // Departamento
      { wch: 16 }, // Rol
      { wch: 18 }, // RFC
      { wch: 20 }, // CURP
      { wch: 18 }, // NSS
      { wch: 35 }, // Domicilio
      { wch: 18 }, // Teléfono
      { wch: 16 }, // Fecha ingreso
      { wch: 12 }, // Sexo
      { wch: 16 }, // Estado civil
      { wch: 8 }   // Edad
    ];

    // Congelar encabezado
    worksheet['!freeze'] = { ySplit: 1 };

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Listado de Empleados': worksheet },
      SheetNames: ['Listado de Empleados']
    };

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });

    saveAs(blob, `empleados_${this.fechaHoy()}.xlsx`);
  }


  private calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;


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
}