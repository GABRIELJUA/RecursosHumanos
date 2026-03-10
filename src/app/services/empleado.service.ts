import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {

    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    getMyProfile() {
        return this.http.get(`${this.apiUrl}/employees/profile/me` , { withCredentials: true });
    }

    updateMyProfile(payload: any) {
        return this.http.put(`${this.apiUrl}/employees/profile/me`, payload, { withCredentials: true });
    }
}
