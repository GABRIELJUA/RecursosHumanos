import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DepartamentosService } from '../../services/departamentos.service';
import { Departamento } from '../../models/departamento.model';
import { PuestosService } from '../../services/puestos.service';

@Component({
  selector: 'app-departamentos-puestos',
  imports: [CommonModule, FormsModule],
  templateUrl: './departamentos-puestos.component.html',
  styleUrl: './departamentos-puestos.component.css'
})
export class DepartamentosPuestosComponent implements OnInit {

  departamentos: Departamento[] = [];

  nuevoDepto = '';
  mostrarCrearDepto = false;

  constructor(
    private departamentosService: DepartamentosService,
    private puestosService: PuestosService
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {

    this.departamentosService.getTree().subscribe(data => {

      this.departamentos = data.map(d => ({
        ...d,
        abierto: false,
        nuevoPuesto: ''
      }));

    });

  }

  toggleDepartamento(d: Departamento) {
    d.abierto = !d.abierto;
  }

  /* =========================
        CREAR DEPARTAMENTO
     ========================= */

  crearDepartamento() {

    if (!this.nuevoDepto.trim()) return;

    this.departamentosService.create(this.nuevoDepto)
      .subscribe(() => {

        this.nuevoDepto = '';
        this.cargar();

      });

  }

  /* =========================
        CREAR PUESTO
     ========================= */

  crearPuesto(d: Departamento) {

    if (!d.nuevoPuesto?.trim()) return;

    this.puestosService.create(d.id, d.nuevoPuesto)
      .subscribe(() => {

        d.nuevoPuesto = '';
        this.cargar();

      });

  }

  /* =========================
      ELIMINAR PUESTO
   ========================= */

  eliminarPuesto(id: number) {

    if (!confirm('¿Eliminar este puesto?')) return;

    this.puestosService.delete(id)
      .subscribe(() => {

        this.cargar();

      });

  }


  /* =========================
        EDITAR PUESTO
     ========================= */

  editarPuesto(p: any) {

    const nuevoNombre = prompt('Nuevo nombre del puesto:', p.nombre);

    if (!nuevoNombre) return;

    this.puestosService.update(p.id, nuevoNombre)
      .subscribe(() => {

        this.cargar();

      });

  }


  /* =========================
        ELIMINAR DEPARTAMENTO
     ========================= */

  eliminarDepartamento(id: number) {

    if (!confirm('¿Eliminar este departamento?')) return;

    this.departamentosService.delete(id)
      .subscribe(() => {

        this.cargar();

      });

  }

}