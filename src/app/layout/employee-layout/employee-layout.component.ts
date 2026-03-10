import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ajusta la ruta si cambia

@Component({
  selector: 'app-employee-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule,RouterModule],
  templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})
export class EmployeeLayoutComponent {


  isCollapsed = false;
  user: any;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
  this.authService.getMe().subscribe(user => {
    this.user = user;
  });
}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // o '/'
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


isMobileMenuOpen = false;

toggleMobileMenu() {
  this.isMobileMenuOpen = !this.isMobileMenuOpen;
}

closeMobileMenu() {
  this.isMobileMenuOpen = false;
}

}
