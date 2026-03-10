import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

// Layouts
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { EmployeeLayoutComponent } from './layout/employee-layout/employee-layout.component';

// Públicas
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { BuzonComponent } from './pages/buzon/buzon.component';
import { ProtocoloacososexualComponent } from './pages/protocoloacososexual/protocoloacososexual.component';
import { LoginComponent } from './pages/login/login.component';
import { BibliotecaPublicaComponent } from './pages/biblioteca-publica/biblioteca-publica.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';

// Admin
import { HomeComponent } from './pages/home/home.component';
import { EmployeeListComponent } from './pages/employees/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employees/employee-form/employee-form.component';
import { EmpleadoDetalleComponent } from './pages/empleado-detalle/empleado-detalle.component';
import { UsersComponent } from './pages/users/users.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ComunicadosComponent } from './pages/comunicados/comunicados.component';
import { GestionsolicitudComponent } from './pages/gestionsolicitud/gestionsolicitud.component';
import { GestionsugerenciasComponent } from './pages/gestionsugerencias/gestionsugerencias.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { AuditoriaComponent } from './pages/auditoria/auditoria.component';
import { GaleriaAdminComponent } from './pages/galeria-admin/galeria-admin.component';
import { BannerAdminComponent } from './pages/banner-admin/banner-admin.component';
import { RecursosAdminComponent } from './pages/recursos-admin/recursos-admin.component';
import { DepartamentosPuestosComponent } from './pages/departamentos-puestos/departamentos-puestos.component';

// Empleado
import { EmpleadoProfileComponent } from './pages/empleado-profile/empleado-profile.component';
import { SolicitudVacacionesComponent } from './pages/solicitud-vacaciones/solicitud-vacaciones.component';
import { ComunicadosPublicoComponent } from './pages/comunicados-publico/comunicados-publico.component';

export const routes: Routes = [

  // ================== PÚBLICO ==================
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'buzon', component: BuzonComponent },
      { path: 'protocolo', component: ProtocoloacososexualComponent },
      { path: 'biblioteca', component: BibliotecaPublicaComponent },
      { path: 'galeria', component: GaleriaComponent }
    ]
  },

  // ================== LOGIN ==================
  {
    path: 'login',
    component: LoginComponent
  },

  // ================== ADMIN ==================
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['ADMIN', 'ADMIN_EDITOR', 'ADMIN_LECTURA']
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { breadcrumb: 'Dashboard' } },
      { path: 'employees', component: EmployeeListComponent, data: { breadcrumb: 'Personal' } },
      { path: 'employees/create', component: EmployeeFormComponent, data: { breadcrumb: 'Crear Empleado' } },
      { path: 'employees/edit/:id', component: EmployeeFormComponent, data: { breadcrumb: 'Editar Empleado' } },
      { path: 'employees/:id', component: EmpleadoDetalleComponent, data: { breadcrumb: 'Detalle Empleado' } },
      { path: 'comunicados', component: ComunicadosComponent, data: { breadcrumb: 'Comunicados' } },
      { path: 'gestionsolicitud', component: GestionsolicitudComponent, data: { breadcrumb: 'Solicitudes' } },
      { path: 'sugerencias', component: GestionsugerenciasComponent, data: { breadcrumb: 'Sugerencias' } },
      { path: 'biblioteca', component: BibliotecaComponent, data: { breadcrumb: 'Biblioteca' } },
      { path: 'users', component: UsersComponent, data: { breadcrumb: 'Usuarios' } },
      { path: 'reports', component: ReportsComponent, data: { breadcrumb: 'Reportes' } },
      { path: 'admin-profile', component: AdminProfileComponent, data: { breadcrumb: 'Perfil' } },
      { path: 'auditoria', component: AuditoriaComponent, data: { breadcrumb: 'Auditoría' } },
      { path: 'galeria', component: GaleriaAdminComponent, data: { breadcrumb: 'Galería' } },
      { path: 'banner', component: BannerAdminComponent, data: { breadcrumb: 'Banner' } },
      { path: 'recursos', component: RecursosAdminComponent, data: { breadcrumb: 'Recursos' } },
      { path: 'departamentos', component: DepartamentosPuestosComponent, data: { breadcrumb: 'Departamentos y Puestos' } }
    ]
  },

  // ================== EMPLEADO ==================
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADO'] },
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: EmpleadoProfileComponent },
      { path: 'solicitudes', component: SolicitudVacacionesComponent },
      { path: 'comunicados', component: ComunicadosPublicoComponent }
    ]
  },

  // ================== 404 ==================
  {
    path: '**',
    redirectTo: ''
  }
];
