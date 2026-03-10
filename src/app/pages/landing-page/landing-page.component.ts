import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BannerService } from '../../services/banner.service';
import { Banner } from '../../models/banner.model';
import { inject } from '@angular/core';
import { RecursosService } from '../../services/recursos.service';


@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {

  private bannerService = inject(BannerService);
    secciones: any[] = []

  constructor(private recursosService: RecursosService) {}


images = [
  { url: 'assets/img/banner/prueba.png', route: '/' }
];

currentImageIndex: number = 0;

  private intervalId: any;

ngOnInit(): void {

  this.loadBanners();

  this.intervalId = setInterval(() => {
    this.nextImage();
  }, 3000);

  this.cargarSecciones();

}

ngOnDestroy(): void {

  if(this.intervalId) {
  clearInterval(this.intervalId);
}

  }

loadBanners() {

  this.bannerService.getActiveBanners().subscribe({

    next: (data) => {

      if (!data || data.length === 0) return;

      this.images = data.map(banner => ({

        url: 'http://localhost:3000' + banner.imagen,
        route: banner.boton_link || '/'

      }));

      this.currentImageIndex = 0;

    }

  });

}
nextImage() {

  this.currentImageIndex =
    (this.currentImageIndex + 1) % this.images.length;

}

setSlide(index: number) {

  this.currentImageIndex = index;

}

trackByImage(index: number, item: any): string {

  return item.url;

}

 cargarSecciones() {
    this.recursosService.getSecciones()
      .subscribe(data => {
        this.secciones = data
      })
  }

}