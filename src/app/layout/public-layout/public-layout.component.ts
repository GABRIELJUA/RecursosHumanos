import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent implements OnInit {

  menuOpen = false;
  isMobile = false;

  ngOnInit() {
    const ua = navigator.userAgent;

    this.isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  }
}