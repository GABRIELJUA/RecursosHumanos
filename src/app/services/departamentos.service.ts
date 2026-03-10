import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Departamento } from '../models/departamento.model';

@Injectable({
    providedIn: 'root'
})
export class DepartamentosService {

    private apiUrl = 'http://localhost:3000/api/departamentos';

    constructor(private http: HttpClient) { }

    getDepartamentos(): Observable<Departamento[]> {
        return this.http.get<Departamento[]>(this.apiUrl);
    }

    getTree(): Observable<Departamento[]> {
        return this.http.get<Departamento[]>(`${this.apiUrl}/tree`);
    }

    create(nombre: string): Observable<any> {
        return this.http.post(this.apiUrl, { nombre });
    }

    update(id: number, nombre: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, { nombre });
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}