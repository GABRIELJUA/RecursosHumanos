import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificacionesService } from '../../services/notificaciones.service';
import { interval, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';



interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  url: string;
  created_at: string;
}


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  mostrarNotificaciones = false;
  contadorNotificaciones = 0;
  notificaciones: Notificacion[] = [];

  

  isCollapsed = false;
  darkMode = false;
  user: any;
  breadcrumbLabel = '';

  animarCampana = false;
  private primeraCarga = true;


  // control del polling
  private pollingSub?: Subscription;


  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificacionesService: NotificacionesService,
    private elementRef: ElementRef

  ) { }


  @ViewChild('dropdownNotificaciones') dropdownNotificaciones?: ElementRef;
  @ViewChild('dropdownPerfil') dropdownPerfil?: ElementRef;


  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent) {

    const target = event.target as HTMLElement;

    const clickEnNotificaciones =
      this.dropdownNotificaciones?.nativeElement.contains(target);

    const clickEnPerfil =
      this.dropdownPerfil?.nativeElement.contains(target);

    if (!clickEnNotificaciones && !clickEnPerfil) {
      this.mostrarNotificaciones = false;
      this.mostrarPerfil = false;
    }
  }



  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {

    // Dark mode
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.enableDark();
    }

    // Usuario
    this.authService.getMe().subscribe(user => {
      this.user = user;
    });

    // Breadcrumb
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbLabel = this.getBreadcrumb(this.activatedRoute);
      });

    // carga inicial
    this.cargarContador();

    // polling controlado
    this.iniciarPolling();
  }

  iniciarPolling() {
    if (this.pollingSub) return; // evita duplicados

    this.pollingSub = interval(8000).subscribe(() => {

      // Siempre preguntamos contador (ligero)
      this.cargarContador();

      //  Solo pedimos lista si:
      // - dropdown abierto
      // - o ya hay notificaciones
      if (this.mostrarNotificaciones || this.contadorNotificaciones > 0) {
        this.cargarNotificaciones();
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
  }


  logout() {

    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }

    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Error al cerrar sesión', err);
      }
    });
  }


  getInitial(nombre?: string): string {
    if (!nombre) return '';
    return nombre.charAt(0).toUpperCase();
  }


  toggleDark() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      this.enableDark();
    } else {
      this.disableDark();
    }

    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  enableDark() {
    document.documentElement.classList.add('dark');
    this.darkMode = true;
  }

  disableDark() {
    document.documentElement.classList.remove('dark');
    this.darkMode = false;
  }

  private getBreadcrumb(route: ActivatedRoute): string {
    let currentRoute = route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    return currentRoute.snapshot.data['breadcrumb'] || '';
  }


  toggleNotificaciones(event: Event) {
    event.stopPropagation();
    this.mostrarNotificaciones = !this.mostrarNotificaciones;

    if (this.mostrarNotificaciones) {
      this.cargarNotificaciones();
    }
  }

  cargarNotificaciones() {
    this.notificacionesService.get().subscribe({
      next: data => {
        this.notificaciones = data;
      },
      error: err => {
        console.warn('No se pudieron cargar las notificaciones');
      }
    });
  }

  cargarContador() {
    this.notificacionesService.noLeidas().subscribe({
      next: total => {

        // animar SOLO si no es la primera carga y aumenta
        if (!this.primeraCarga && total > this.contadorNotificaciones) {
          this.activarAnimacionCampana();
        }

        this.contadorNotificaciones = total;
        this.primeraCarga = false;
      },
      error: err => {
        console.warn('No se pudo obtener el contador de notificaciones');
      }
    });
  }

  mostrarPerfil = false;

  togglePerfil(event: Event) {
    event.stopPropagation();
    this.mostrarPerfil = !this.mostrarPerfil;
  }

  abrirNotificacion(n: Notificacion) {
    if (!n.leida) {
      n.leida = true;
      this.contadorNotificaciones--;

      this.notificacionesService.leer(n.id).subscribe({
        error: () => console.warn('No se pudo marcar la notificación como leída')
      });
    }

    this.mostrarNotificaciones = false;
    this.router.navigateByUrl(n.url);
  }

  activarAnimacionCampana() {
    this.animarCampana = true;

    setTimeout(() => {
      this.animarCampana = false;
    }, 2000);
  }
}
