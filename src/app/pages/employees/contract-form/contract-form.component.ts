import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EmployeeService } from '../../../services/employee.service';
import { ContractsService } from '../../../services/contracts.service';

@Component({
  selector: 'app-contract-form',
  imports: [FormsModule, CommonModule, RouterModule
  ],
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.css'
})
export class ContractFormComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private contractsService = inject(ContractsService);

  employee: any = null;
  contracts: any[] = [];

  contract = {
    id_empleado: 0,
    tipo_contrato: 'DETERMINADO',
    fecha_inicio: new Date().toISOString().substring(0, 10),
    fecha_fin: '',
    salario_diario: '',
    funciones_puesto: '',
    fecha_firma: new Date().toISOString().substring(0, 10)
  };

  loading = true;

  ngOnInit() {

    const idEmpleado = this.route.snapshot.paramMap.get('id');

    if (!idEmpleado) return;

    this.contract.id_empleado = +idEmpleado;

    this.calcularFechaFin();

    this.employeeService.getEmployeeById(+idEmpleado).subscribe({
      next: (emp: any) => {
        this.employee = emp;
        this.loading = false;
        // obtener contratos del empleado
        this.contractsService.getContractsByEmployee(+idEmpleado).subscribe({

          next: (data: any) => {

            this.contracts = data;

            if (this.contracts.length > 0) {

              const ultimo = this.contracts[0]; // viene ordenado DESC

              if (ultimo.fecha_fin) {

                const fin = new Date(ultimo.fecha_fin);

                fin.setDate(fin.getDate() + 1);

                this.contract.fecha_inicio = fin.toISOString().split('T')[0];

                this.calcularFechaFin();

              }

            }

          }

        });
      },
      error: () => {
        this.router.navigate(['/admin/employees']);
      }
    });

  }

  saveContract() {

    this.contractsService.createContract(this.contract).subscribe({

      next: (res: any) => {

        const idContrato = res.id;

        // ahora generamos el PDF
        this.contractsService.generateContract(idContrato).subscribe({

          next: () => {

            alert('Contrato generado correctamente');

            this.router.navigate([
              '/admin/employees',
              this.contract.id_empleado
            ]);

          },

          error: () => {
            alert('Contrato guardado pero falló la generación del PDF');
          }

        });

      },

      error: () => {
        alert('Error al registrar contrato');
      }

    });

  }
  isIndefiniteContract(): boolean {
    return this.contracts.length >= 3;
  }
  
  calcularFechaFin() {

    if (!this.contract.fecha_inicio) return;

    const inicio = new Date(this.contract.fecha_inicio);

    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 27); // total 28 días

    this.contract.fecha_fin = fin.toISOString().split('T')[0];

  }
}
