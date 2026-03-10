import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../models/banner.model';

@Injectable({
    providedIn: 'root'
})
export class BannerService {

    private http = inject(HttpClient);

    private apiUrl = 'http://localhost:3000/api/banners';

    createBanner(formData: FormData): Observable<any> {

        return this.http.post(this.apiUrl, formData);

    }

    getBanners(): Observable<Banner[]> {

        return this.http.get<Banner[]>(this.apiUrl);

    }

    getBannerActivo(): Observable<Banner> {

        return this.http.get<Banner>(`${this.apiUrl}/activo`);


    }

    updateBanner(id_banner: number, formData: FormData): Observable<any> {

        return this.http.put(
            `${this.apiUrl}/${id_banner}`,
            formData
        );

    }

    getActiveBanners(): Observable<Banner[]> {
        return this.http.get<Banner[]>(`${this.apiUrl}/activos`);
    }

    deleteBanner(id_banner: number) {

        return this.http.delete(
            `${this.apiUrl}/${id_banner}`
        );

    }
}