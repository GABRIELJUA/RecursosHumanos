export interface Sugerencia {

  id_sugerencia: number;
  comentario: string;
  imagen: string | null;
  fecha: string;

  ip_address: string | null;
  user_agent: string | null;
  device_id: string | null;

  device_total?: number;

}