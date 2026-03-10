import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PuestosService {

    private api = 'http://localhost:3000/api/puestos';

    constructor(private http: HttpClient) { }

    create(departamentoId: number, nombre: string) {

        return this.http.post(
            `${this.api}/departamento/${departamentoId}`,
            { nombre }
        );

    }

    delete(id: number) {
        return this.http.delete(`${this.api}/${id}`);
    }

    update(id: number, nombre: string) {
        return this.http.put(`${this.api}/${id}`, { nombre });
    }

}