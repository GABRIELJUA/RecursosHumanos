import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecursosService } from '../../services/recursos.service';
import { Recurso } from '../../models/recurso.model';

@Component({
  selector: 'app-recursos-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './recursos-admin.component.html',
  styleUrl: './recursos-admin.component.css'
})
export class RecursosAdminComponent implements OnInit {


  recursos: Recurso[] = []

  loading = false

  showModal = false
  showDetailModal = false

  error = ''

  form = {
    titulo: '',
    descripcion: ''
  }

  imagen: File | null = null

  detailRecurso: Recurso | null = null
  recursoArchivos: any[] = []

  pendingFiles: File[] = []

  constructor(private recursosService: RecursosService) { }

  ngOnInit(): void {
    this.cargarSecciones()
  }

  trackById(index: number, item: Recurso) {
    return item.id
  }

  cargarSecciones() {

    this.loading = true

    this.recursosService.getSecciones()
      .subscribe({
        next: data => {
          this.recursos = data
          this.loading = false
        },
        error: () => {
          this.loading = false
        }
      })

  }

  /* ================= MODAL CREAR ================= */

  openModal() {
    this.showModal = true
  }

  closeModal() {
    this.showModal = false

    this.form = {
      titulo: '',
      descripcion: ''
    }

    this.imagen = null
    this.error = ''
  }

  onImageChange(event: any) {

    const file = event.target.files[0]

    if (!file) return

    this.imagen = file

  }

  crearSeccion() {

    if (!this.form.titulo.trim()) {
      this.error = 'El título es obligatorio'
      return
    }

    const formData = new FormData()

    formData.append('titulo', this.form.titulo)
    formData.append('descripcion', this.form.descripcion)

    if (this.imagen) {
      formData.append('imagen', this.imagen)
    }

    this.recursosService.crearSeccion(formData)
      .subscribe(() => {

        this.closeModal()
        this.cargarSecciones()

      })

  }

  /* ================= DETALLE ================= */

  openDetail(recurso: Recurso) {

    this.detailRecurso = recurso
    this.recursoArchivos = recurso.archivos || []

    this.showDetailModal = true

  }

  closeDetail() {

    this.showDetailModal = false
    this.detailRecurso = null
    this.recursoArchivos = []
    this.pendingFiles = []

  }

  /* ================= SUBIR ARCHIVOS ================= */

  onAddFilesChange(event: any) {

    const files: FileList = event.target.files

    if (!files.length) return

    this.pendingFiles = Array.from(files)

    this.subirArchivos()

  }

  subirArchivos() {

    if (!this.detailRecurso) return

    const id = this.detailRecurso.id

    this.pendingFiles.forEach(file => {

      const formData = new FormData()
      formData.append('archivo', file)

      this.recursosService.subirArchivo(id, formData)
        .subscribe(() => {

          this.cargarSecciones()

          const updated = this.recursos.find(r => r.id === id)

          if (updated) {
            this.recursoArchivos = updated.archivos || []
          }

        })

    })

  }

  /* ================= ELIMINAR ================= */

  eliminarArchivo(id: number) {

    this.recursosService.eliminarArchivo(id)
      .subscribe(() => {

        if (this.detailRecurso) {

          this.recursoArchivos =
            this.recursoArchivos.filter(a => a.id !== id)

        }

      })

  }

  eliminarSeccion(id: number) {

    if (!confirm('¿Eliminar sección?')) return

    this.recursosService.eliminarSeccion(id)
      .subscribe(() => this.cargarSecciones())

  }

}