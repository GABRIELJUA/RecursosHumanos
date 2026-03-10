import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComunicadoService } from '../../services/comunicado.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-comunicados',
  imports: [CommonModule, FormsModule],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.css'
})
export class ComunicadosComponent implements OnInit {

  private api = inject(ComunicadoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);


  loading=false;
  comunicados:any[]=[];

  // roles
  rol='';
  canEdit=false;
  canDelete=false;

  // modal
  mostrarModal=false;
  editando=false;
  idEditando:number|null=null;

  archivo:any=null;

  form:any={
    titulo:'',
    contenido:'',
    fecha_publicacion:'',
    categoria:''
  };

  toast={
    show:false,
    message:'',
    type:'info'
  };

  ngOnInit(){
    this.auth.getMe().subscribe({
      next:(user:any)=>{
        this.rol=user.rol;
        this.setPermisos();
        this.cargar();
      },
      error:()=> this.router.navigate(['/login'])
    });
  }

  setPermisos(){
    if(this.rol==='ADMIN'){
      this.canEdit=true;
      this.canDelete=true;
    }
    if(this.rol==='ADMIN_EDITOR'){
      this.canEdit=true;
    }
  }

  cargar(){
    this.loading=true;

    this.api.getAll().subscribe({
      next:(res:any)=>{
        this.comunicados=res;
        this.loading=false;
      },
      error:()=> this.loading=false
    });
  }

  abrirNuevo(){
    if(!this.canEdit){
      this.toastMsg('No tienes permisos','error');
      return;
    }

    this.editando=false;
    this.idEditando=null;
    this.form={ titulo:'', contenido:'', fecha_publicacion:'' };
    this.archivo=null;
    this.mostrarModal=true;
  }

  editar(c:any){
    if(!this.canEdit){
      this.toastMsg('No tienes permisos','error');
      return;
    }

    this.editando=true;
    this.idEditando=c.id_comunicado;

    this.form={
      titulo:c.titulo,
      contenido:c.contenido,
      fecha_publicacion:c.fecha_publicacion?.substring(0,10)
    };

    this.mostrarModal=true;
  }

  onFile(e:any){
    this.archivo=e.target.files[0];
  }

  guardar(){

    const fd=new FormData();
    fd.append('titulo',this.form.titulo);
    fd.append('contenido',this.form.contenido);
    fd.append('fecha_publicacion',this.form.fecha_publicacion);

    if(this.archivo){
      fd.append('archivo',this.archivo);
    }

    if(this.editando && this.idEditando){
      this.api.update(this.idEditando,fd).subscribe({
        next:()=>{
          this.toastMsg('Comunicado actualizado','success');
          this.mostrarModal=false;
          this.cargar();
        },
        error:(e)=> this.toastMsg(e.error?.message || 'Error','error')
      });
      return;
    }

    this.api.create(fd).subscribe({
      next:()=>{
        this.toastMsg('Comunicado publicado','success');
        this.mostrarModal=false;
        this.cargar();
      },
      error:(e)=> this.toastMsg(e.error?.message || 'Error','error')
    });
  }

  eliminar(id:number){
    if(!this.canDelete){
      this.toastMsg('Solo ADMIN puede eliminar','error');
      return;
    }

    if(!confirm('¿Eliminar comunicado?')) return;

    this.api.delete(id).subscribe(()=>{
      this.toastMsg('Eliminado','success');
      this.cargar();
    });
  }

  toastMsg(msg:string,type:any='info'){
    this.toast.message=msg;
    this.toast.type=type;
    this.toast.show=true;

    setTimeout(()=> this.toast.show=false,3000);
    
  }

  getFileUrl(ruta:string){
  return 'http://localhost:3000' + ruta;
}

getIconoArchivo(ruta?: string): string {

  if (!ruta) return 'assets/icons/file.png';

  const ext = ruta.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') return 'assets/icon/pdf.png';
  if (ext === 'doc' || ext === 'docx') return 'assets/icon/oficina.png';
  if (ext === 'xls' || ext === 'xlsx') return 'assets/icon/sobresalir.png';
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'assets/icon/galeria.png';

  return 'assets/icons/file.png';
}

getTipoArchivo(ruta?:string){

  if(!ruta) return 'none';

  const ext = ruta.split('.').pop()?.toLowerCase();

  if(['png','jpg','jpeg','webp'].includes(ext!)) return 'image';
  if(ext==='pdf') return 'pdf';

  return 'file';
}

getSafePdfUrl(ruta:string): SafeResourceUrl{
  return this.sanitizer.bypassSecurityTrustResourceUrl(
    this.getFileUrl(ruta)
  );
}



}