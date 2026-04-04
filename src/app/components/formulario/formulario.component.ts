import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../services/proyectos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  private proyectosService = inject(ProyectosService);
  private router = inject(Router);

  // Datos para la cabecera (Reporte Inicial)
  public usuarioLogueado: any = {
    displayName: 'Pablo Cesar Zuñiga',
    email: 'pcz7910@gmail.com'
  };
  
  public proyectos: any[] = [];
  public proyecto: any = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };

  ngOnInit() {
    // Aquí cargarías los datos reales de MySQL al iniciar
    this.cargarDatos();
  }

  cargarDatos() {
    this.proyectosService.getProyectos(this.usuarioLogueado.email).subscribe(datos => {
      this.proyectos = datos;
    });
  }

  guardar() {
    const payload = { ...this.proyecto, usuario_correo: this.usuarioLogueado.email };
    this.proyectosService.guardarProyecto(payload).subscribe(() => {
      this.proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
      this.cargarDatos();
    });
  }

  // ESTA FUNCIÓN ES LA QUE ARREGLA EL ERROR DE LA TERMINAL
  eliminar(id: any) {
    if (confirm('¿Eliminar de MySQL?')) {
      this.proyectosService.eliminarProyecto(id).subscribe(() => this.cargarDatos());
    }
  }

  salir() {
    this.router.navigate(['/login']);
  }
}