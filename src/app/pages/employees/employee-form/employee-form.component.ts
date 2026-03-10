import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 2. Importar ActivatedRoute
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';
import { Employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DepartamentosService } from '../../../services/departamentos.service';


@Component({
  selector: 'app-employee-form',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {

  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private departamentosService = inject(DepartamentosService);

  departamentos: any[] = [];
  puestos: any[] = [];

  // ================== CONTROL DE PASOS ==================
  step = 1;

  // ================== ROLES ==================
  currentUserRole = '';

  canRegister = false;
  canEdit = false;
  canChangeRole = false;

  // ================== ESTADO ==================
  isEditing = false;
  errorMessage: string | null = null;
  toast = {
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  };

  // ================== MODELO ==================
  employee: Employee = {
    num_nomina: '',
    rol: 'EMPLEADO', // CORREGIDO
    fecha_ingreso: new Date().toISOString().split('T')[0],
    puesto: '',
    departamento: '',

    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
    edad: '',
    sexo: 'Masculino',
    estado_civil: 'Soltero/a',
    nacionalidad: 'Mexicana',

    correo: '',
    telefono: '',
    domicilio: '',

    rfc: '',
    curp: '',
    nss: '',

    password: ''
  };

  // ================== INIT ==================
ngOnInit() {

  this.authService.getMe().subscribe({
    next: (user: any) => {
      this.currentUserRole = user.rol;
      this.setPermissions();
    },
    error: () => {
      this.router.navigate(['/login']);
    }
  });

  this.departamentosService.getTree().subscribe({
    next: (data) => {
      this.departamentos = data;
    }
  });

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {

    this.isEditing = true;

    this.employeeService.getEmployeeById(+id).subscribe({
      next: (emp) => {

        this.employee = emp;

        this.employee.fecha_ingreso =
          emp.fecha_ingreso?.toString().substring(0, 10);

        this.employee.fecha_nacimiento =
          emp.fecha_nacimiento?.toString().substring(0, 10);

        const depto = this.departamentos.find(
          d => d.id == this.employee.departamento
        );

        this.puestos = depto ? depto.puestos : [];

      },
      error: () => {
        this.toastMsg('No se pudo cargar el empleado', 'error');
        this.router.navigate(['/admin/employees']);
      }
    });

  }

}

  onDepartamentoChange() {

    const depto = this.departamentos.find(
      d => d.id == this.employee.departamento
    );

    this.puestos = depto ? depto.puestos : [];

    this.employee.puesto = '';

  }
  // ================== PERMISOS ==================
  setPermissions() {
    if (this.currentUserRole === 'ADMIN') {
      this.canRegister = true;
      this.canEdit = true;
      this.canChangeRole = true;
    }

    if (this.currentUserRole === 'ADMIN_EDITOR') {
      this.canEdit = true;
    }

    // ADMIN_LECTURA → solo ver
  }

  // ================== GUARDADO ==================

  onSave(): void {

    if (this.isEditing) {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) return;

      this.employeeService.updateEmployee(+id, this.employee).subscribe({
        next: () => {
          this.toastMsg('Empleado actualizado correctamente', 'success');
          setTimeout(() => {
            this.router.navigate(['/admin/employees']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.toastMsg(err.error?.message || 'Error al actualizar empleado', 'error');
        }
      });
      return;
    }

    this.employeeService.addEmployee(this.employee).subscribe({
      next: () => {
        this.toastMsg('Empleado registrado exitosamente', 'success');
        setTimeout(() => {
          this.router.navigate(['/admin/employees']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.toastMsg(err.error?.message || 'Error al registrar empleado', 'error');
      }
    });
  }



  toastMsg(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }

  // ================== STEPS ==================
  nextStep() {
    if (this.step === 1) {
      this.step = 2;
    }
  }

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  soloNumeros(event: KeyboardEvent) {

    // permitir teclas especiales
    const teclasPermitidas = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];

    if (teclasPermitidas.includes(event.key)) return;

    // permitir solo números
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }

  }

}