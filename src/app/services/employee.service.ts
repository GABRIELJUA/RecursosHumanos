import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../pages/employees/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:3000/api/employees';
  private employeesUrl = 'http://localhost:3000/api/employees';

  // ===============================
  // CREAR
  // ===============================
  addEmployee(employee: Employee): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register`,
      employee,
      { withCredentials: true }
    );
  }

  // ===============================
  // EDITAR
  // ===============================
  updateEmployee(id: number, data: Partial<Employee>): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/edit/${id}`,
      data,
      { withCredentials: true }
    );
  }

  // ===============================
  // OBTENER POR ID
  // ===============================
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(
      `${this.baseUrl}/${id}`,
      { withCredentials: true }
    );
  }

  // ===============================
  // LISTADO CON FILTROS DINÁMICOS
  // ===============================
  getEmployees(
    page: number,
    limit: number,
    filters: {
      departamento?: string;
      puesto?: string;
      estatus?: string;
      roles?: string;
      q?: string;
    } = {},
    sort?: string,
    order?: 'asc' | 'desc'
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    // Agregar filtros solo si existen
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    // 🔥 Ordenamiento
    if (sort) {
      params = params.set('sort', sort);
    }

    if (order) {
      params = params.set('order', order);
    }

    return this.http.get<any>(
      this.baseUrl,
      {
        params,
        withCredentials: true
      },
      
    );
  }

  // ===============================
  // ACTUALIZAR PERMISOS
  // ===============================
  updatePermissions(id: number, rol: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/permissions/${id}`,
      { rol },
      { withCredentials: true }
    );
  }


  // ===============================
  // USUARIOS DEL SISTEMA (IAM)
  // ===============================
  getSystemUsers(
    page: number,
    limit: number,
    q?: string
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<any>(
      `${this.baseUrl}/system-users`,
      {
        params,
        withCredentials: true
      }
    );
  }

  resetPassword(id: number, new_password: string) {
    return this.http.patch(
      `${this.employeesUrl}/${id}/reset-password`,
      { new_password },
      { withCredentials: true }
    );
  }


}