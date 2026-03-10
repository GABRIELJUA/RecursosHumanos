import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      num_nomina: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = null;

    const { num_nomina, password } = this.loginForm.value;

    this.authService.login({ num_nomina, password }).subscribe({
      next: (res) => {
        this.isLoading = false;

        const rol = res.user.rol;

        if (
          rol === 'ADMIN' ||
          rol === 'ADMIN_EDITOR' ||
          rol === 'ADMIN_LECTURA'
        ) {
          this.router.navigate(['/admin']);
        }
        else if (rol === 'EMPLEADO') {
          this.router.navigate(['/employee']);
        }
        else {
          this.errorMessage = 'Rol no reconocido';
        }
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Intenta más tarde.';
          return;
        }
        if (err.error?.message) {
          this.errorMessage = err.error.message;
          return;
        }
        this.errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';
      }

    });
  }
}