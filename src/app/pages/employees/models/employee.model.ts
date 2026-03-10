export interface Employee {
  id_empleado?: number;

  // Contrato
  num_nomina: string;
  rol: string;
  fecha_ingreso: string;

  puesto_id?: number;

  puesto?: string;
  departamento?: string;

  // Datos personales
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  edad: string;
  sexo: string;
  estado_civil: string;
  nacionalidad: string;   // ✅ NUEVO

  // Contacto
  correo: string;
  telefono: string;       // ✅ NUEVO
  domicilio: string;      // ✅ NUEVO

  // Documentos
  rfc: string;
  curp: string;
  nss: string;

  // Acceso
  password?: string;
}
