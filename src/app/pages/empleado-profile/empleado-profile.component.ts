import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
@Component({
  selector: 'app-empleado-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './empleado-profile.component.html',
  styleUrl: './empleado-profile.component.css'
})
export class EmpleadoProfileComponent implements OnInit {

  employee: any;
  loading = true;
  isEditing = false;

 toast={
    show:false,
    message:'',
    type:'info'
  };

  constructor(
    private route: ActivatedRoute,
    private empleadoService: EmpleadoService
  ) { }

  ngOnInit(): void {
    this.empleadoService.getMyProfile()
      .subscribe({
        next: (data) => {
          this.employee = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  saveProfile() {
    const payload = {
      correo: this.employee.correo,
      telefono: this.employee.telefono,
      domicilio: this.employee.domicilio,
      estado_civil: this.employee.estado_civil
    };

    this.empleadoService.updateMyProfile(payload).subscribe(() => {
      this.isEditing = false;
      this.toastMsg('Perfil actualizado correctamente', 'success');
    });
  }

  cancelEdit() {
    this.isEditing = false;

  }


   toastMsg(msg:string,type:any='info'){
    this.toast.message=msg;
    this.toast.type=type;
    this.toast.show=true;

    setTimeout(()=> this.toast.show=false,3000);
    
  }


}