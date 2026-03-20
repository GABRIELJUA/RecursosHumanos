import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContractsService } from '../../services/contracts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../employees/models/employee.model';

type ToastType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-empleado-detalle',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './empleado-detalle.component.html',
  styleUrl: './empleado-detalle.component.css'
})
export class EmpleadoDetalleComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private contractsService = inject(ContractsService);

  employee!: Employee;
  loading = true;
  errorMessage: string | null = null;

  contracts: any[] = [];

  toast = {
    show: false,
    message: '',
    type: 'info' as ToastType
  };

  isResettingPassword = false;
  resetPasswordData = {
    newPassword: '',
    confirmPassword: ''
  };

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.getEmployeeById(id).subscribe({

      next: (data) => {

        this.employee = data;

        this.contractsService.getContractsByEmployee(id).subscribe({
          next: (contracts) => {
            this.contracts = contracts;
          },
          error: () => {
            console.error('Error cargando contratos');
          }
        });

        this.loading = false;

      },

      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el empleado';
        this.router.navigate(['/admin/employees']);
      }

    });

  }

  openResetPassword() {
    this.isResettingPassword = true;
    this.resetPasswordData = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  cancelResetPassword() {
    this.isResettingPassword = false;
    this.resetPasswordData = {
      newPassword: '',
      confirmPassword: ''
    };
  }

  saveResetPassword() {
    if (!this.employee?.id_empleado) {
      return;
    }

    const { newPassword, confirmPassword } = this.resetPasswordData;

    if (!newPassword || !confirmPassword) {
      this.toastMsg('Debes capturar y confirmar la nueva contraseña', 'error');
      return;
    }

    if (newPassword.length < 4) {
      this.toastMsg('La nueva contraseña debe tener al menos 4 caracteres', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.toastMsg('Las contraseñas no coinciden', 'error');
      return;
    }

    this.employeeService.resetPassword(this.employee.id_empleado, newPassword).subscribe({
      next: () => {
        this.toastMsg('Contraseña actualizada correctamente', 'success');
        this.cancelResetPassword();
      },
      error: (err) => {
        this.toastMsg(err.error?.message || 'Error al resetear contraseña', 'error');
      }
    });
  }

  toastMsg(message: string, type: ToastType = 'info') {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;

    setTimeout(() => {
      this.toast.show = false;
    }, 3000);
  }
  hasContratoIndeterminado(): boolean {
    return this.contracts?.some(c => c.tipo_contrato === 'INDETERMINADO');
  }
}
