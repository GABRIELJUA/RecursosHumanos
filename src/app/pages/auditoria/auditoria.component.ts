import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../services/audit.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-auditoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.css'
})
export class AuditoriaComponent implements OnInit {

  logs: any[] = [];
  loading = false;
  errorMessage = '';

  // ===== paginación
  pageSizeOptions = [5, 10, 20, 50];
  limit = 10;
  currentPage = 1;
  totalPages = 0;
  totalRecords = 0;

  // ===== filtros
  filtros: any = {
    user_id: '',
    action: '',
    entity: ''
  };

  acciones: string[] = [];
  entidades: string[] = [];

  // ===== modal
  logSeleccionado: any = null;

  constructor(private auditService: AuditService) { }

  ngOnInit() {
    this.cargarLogs();
  }

  // ================== CARGAR ==================
  cargarLogs() {
    this.loading = true;
    this.errorMessage = '';

    const params: any = {
      ...this.filtros,
      page: this.currentPage,
      limit: this.limit
    };

    this.auditService.getLogs(params).subscribe({
      next: (resp) => {
        this.logs = resp.data || [];
        this.totalRecords = resp.total || this.logs.length;
        this.totalPages = Math.ceil(this.totalRecords / this.limit);

        this.extraerCatalogos();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Error cargando auditoría';
        this.loading = false;
      }
    });
  }

  // ================== FILTROS ==================
  buscar() {
    this.currentPage = 1;
    this.cargarLogs();
  }

  limpiar() {
    this.filtros = { user_id: '', action: '', entity: '' };
    this.buscar();
  }

  extraerCatalogos() {
    this.acciones = [...new Set(this.logs.map(l => l.action).filter(Boolean))];
    this.entidades = [...new Set(this.logs.map(l => l.entity).filter(Boolean))];
  }

  // ================== PAGINACION ==================
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarLogs();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cargarLogs();
    }
  }

  onLimitChange() {
    this.currentPage = 1;
    this.cargarLogs();
  }

  // ================== MODAL ==================
  abrirDetalle(log: any) {
    this.logSeleccionado = log;
  }

  cerrarDetalle() {
    this.logSeleccionado = null;
  }

  // ================== COLORES ==================
  getColorClase(action: string) {
    if (!action) return 'bg-gray-100 text-gray-600';

    if (action.includes('DELETE')) return 'bg-red-100 text-red-700';
    if (action.includes('RESET_PASSWORD')) return 'bg-orange-100 text-orange-700';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-700';
    if (action.includes('CREATE')) return 'bg-green-100 text-green-700';

    if (action.includes('LOGIN_FAILED')) return 'bg-red-200 text-red-800';
    if (action.includes('LOGIN_SUCCESS')) return 'bg-emerald-100 text-emerald-700';
    if (action.includes('LOGOUT')) return 'bg-slate-200 text-slate-700';

    return 'bg-purple-100 text-purple-700';
  }

  // ================== SOSPECHOSO ==================
  esSospechoso(log: any) {
    if (log.action === 'LOGIN_FAILED') return true;
    if (log.action === 'RESET_PASSWORD') return true;
    return false;
  }

  // ================== DESCRIPCION ==================
  getDescripcion(log: any) {
    const d = this.parseDetails(log.details);

    switch (log.action) {

      case 'LOGIN_SUCCESS':
        return 'Inicio de sesión exitoso';

      case 'LOGIN_FAILED':
        return 'Intento de acceso fallido';

      case 'LOGOUT':
        return 'Cierre de sesión';

      case 'CREATE_EMPLOYEE':
        return `Se registró el empleado ${d?.nombre || ''}`;

      case 'UPDATE_EMPLOYEE':
        return 'Se actualizaron datos del empleado';

      case 'UPDATE_ROLE':
        return `Cambio de rol a ${d?.despues?.rol}`;

      case 'RESET_PASSWORD':
        return 'Se restableció la contraseña';

      default:
        return log.action;
    }
  }

  // ================== PARSE DETAILS ==================
  parseDetails(det: any) {
    try {
      return typeof det === 'string' ? JSON.parse(det) : det;
    } catch {
      return {};
    }
  }

  // ================== TRADUCCIONES ==================
  traducirAccion(action: string) {
    switch (action) {
      case 'LOGIN_SUCCESS': return 'Inicio de sesión';
      case 'LOGIN_FAILED': return 'Intento fallido';
      case 'LOGOUT': return 'Cierre de sesión';
      case 'CREATE_EMPLOYEE': return 'Registro de empleado';
      case 'UPDATE_EMPLOYEE': return 'Actualización de datos';
      case 'UPDATE_ROLE': return 'Cambio de rol';
      case 'RESET_PASSWORD': return 'Restablecer contraseña';
      default: return action;
    }
  }

  traducirEntidad(entity: string) {
    switch (entity) {
      case 'AUTH': return 'Autenticación';
      case 'EMPLEADO': return 'Empleado';
      default: return entity || 'Sistema';
    }
  }

  // ================== CAMBIOS ==================
getCambios(log: any): { key: string; antes: any; despues: any }[] {

  const detalles = this.parseDetails(log?.details);
  if (!detalles?.antes) return [];

  const cambios: { key: string; antes: any; despues: any }[] = [];

  for (const key of Object.keys(detalles.antes)) {

    const antes = detalles.antes[key];
    const despues = detalles.despues?.[key];

    // 🔥 ocultar si antes vacío
    if (
      antes === null ||
      antes === undefined ||
      antes === '' ||
      (typeof antes === 'object' && Object.keys(antes).length === 0)
    ) {
      continue;
    }

    // 🔥 ocultar si no hubo cambio real
    if (String(antes ?? '') === String(despues ?? '')) {
      continue;
    }

    cambios.push({
      key,
      antes,
      despues
    });
  }

  return cambios;
}
  // ================== FORMATEO VALORES ==================
  formatearValor(valor: any): string {

    if (valor === null || valor === undefined) return '-';

    // fecha ISO
    if (typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/)) {
      const fecha = new Date(valor);
      if (!isNaN(fecha.getTime())) {
        return fecha.toLocaleDateString();
      }
    }

    if (valor instanceof Date) {
      return valor.toLocaleDateString();
    }

    if (typeof valor === 'object') {
      return JSON.stringify(valor);
    }

    return String(valor);
  }

  traducirCampo(campo: string) {
    const mapa: any = {
      nombre: 'Nombre',
      apellido_paterno: 'Apellido paterno',
      apellido_materno: 'Apellido materno',
      fecha_nacimiento: 'Fecha de nacimiento',
      fecha_ingreso: 'Fecha de ingreso',
      departamento: 'Departamento',
      puesto: 'Puesto',
      rol: 'Rol'
    };

    return mapa[campo] || campo;
  }

  // ================== EXPORT (luego) ==================
  exportarExcel() {
    alert('Exportador nivel dios luego 😈');
  }
}

