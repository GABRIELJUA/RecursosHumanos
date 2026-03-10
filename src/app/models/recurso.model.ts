export interface ArchivoRecurso {

  id: number
  nombre: string
  archivo_url: string

}

export interface Recurso {

  id: number
  titulo: string
  descripcion: string
  imagen_url: string
  archivos: ArchivoRecurso[]

}