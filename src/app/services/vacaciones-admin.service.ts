import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface VacacionSolicitud {
    id: number;
    empleado: string;
    fecha_inicio: string;
    fecha_fin: string;
    motivo: string | null;
    creado_en: string;
}


@Injectable({
    providedIn: 'root'
})
export class VacacionesAdminService {

    private readonly apiUrl = 'http://localhost:3000/api/vacaciones';

    constructor(private http: HttpClient) { }

    getSolicitudes(): Observable<VacacionSolicitud[]> {
        return this.http.get<VacacionSolicitud[]>(this.apiUrl, {
            withCredentials: true
        });
    }
}
