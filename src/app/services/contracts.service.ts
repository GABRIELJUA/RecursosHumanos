import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateContractResponse {
    message: string;
    id: number;
}

export interface GenerateContractResponse {
    message: string;
    archivo: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContractsService {

    private apiUrl = 'http://localhost:3000/api/contratos';

    constructor(private http: HttpClient) { }

    createContract(data: any): Observable<CreateContractResponse> {
        return this.http.post<CreateContractResponse>(
            `${this.apiUrl}`,
            data,
            { withCredentials: true }
        );
    }

    generateContract(idContrato: number): Observable<GenerateContractResponse> {
        return this.http.post<GenerateContractResponse>(
            `${this.apiUrl}/generate/${idContrato}`,
            {},
            { withCredentials: true }
        );
    }

    getContractsByEmployee(id: number) {
        return this.http.get<any[]>(
            `${this.apiUrl}/employee/${id}`,
            { withCredentials: true }
        );
    }

}