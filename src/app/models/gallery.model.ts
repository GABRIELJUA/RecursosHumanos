export interface Album {
  id: number;
  nombre: string;
  descripcion?: string | null;
  anio?: number | null;
  portada_url?: string | null;
  creado_por: number;
  creado_nombre?: string;
  total_fotos: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: number;
  album_id: number;
  archivo_url: string;
  orden: number;
  subido_por: number;
  subido_nombre?: string;
  created_at: string;
  updated_at: string;
}

export interface AlbumPhotosResponse {
  album: Album;
  fotos: Photo[];
}

export interface PaginatedAlbums {
  data: Album[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}