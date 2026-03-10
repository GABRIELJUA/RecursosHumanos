import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-protocoloacososexual',
  imports: [CommonModule],
  templateUrl: './protocoloacososexual.component.html',
  styleUrl: './protocoloacososexual.component.css'
})
export class ProtocoloacososexualComponent {
// Aquí podrías añadir lógica para descargar el PDF del protocolo completo
  descargarProtocolo() {
    console.log('Iniciando descarga de documento oficial...');
    // window.open('assets/docs/protocolo-oficial.pdf');
  }
}
