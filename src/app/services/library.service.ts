import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    private api = 'http://localhost:3000/api/library';

    constructor(private http: HttpClient) { }

    // listar
    getAll() {
        return this.http.get<any[]>(this.api, { withCredentials: true });
    }

    // subir
    upload(formData: FormData) {
        return this.http.post(`${this.api}/upload`, formData, { withCredentials: true });
    }

    // eliminar
    delete(id: number) {
        return this.http.delete(`${this.api}/${id}`, { withCredentials: true });
    }

    // ================= PUBLICO =================
    getPublic() {
        return this.http.get<any[]>(`${this.api}/public`);
    }

}
