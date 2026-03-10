export interface Puesto {
  id: number;
  nombre: string;
}

export interface Departamento {
  id: number;
  nombre: string;
  puestos: Puesto[];

  abierto?: boolean;
  nuevoPuesto?: string;
}