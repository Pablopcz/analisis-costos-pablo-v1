import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService } from '../../services/proyectos.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

declare var google: any;

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

  // ESTO FALTABA Y POR ESO EL HTML ESTABA ROJO
  public usuarioLogueado = {
    displayName: 'Pablo Cesar Zuñiga',
    email: 'pcz7910@gmail.com'
  };

  public proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
  public proyectos: any[] = []; // Usamos un array normal para facilitar las gráficas

  ngOnInit() {
    this.cargarDatos();
    if (typeof google !== 'undefined') {
      google.charts.load('current', { 'packages': ['corechart'] });
    }
  }

  cargarDatos() {
    this.proyectosService.getProyectos(this.usuarioLogueado.email).subscribe(datos => {
      this.proyectos = datos;
      if (this.proyectos.length > 0) {
        setTimeout(() => this.dibujarGraficas(), 500);
      }
    });
  }

  dibujarGraficas() {
    if (typeof google === 'undefined' || !google.visualization) return;

    const dataBarras = new google.visualization.DataTable();
    dataBarras.addColumn('string', 'Proyecto');
    dataBarras.addColumn('number', 'Estimadas');
    dataBarras.addColumn('number', 'Reales');

    this.proyectos.forEach(p => {
      dataBarras.addRow([p.nombre, p.horasEstimadas, p.horasReales]);
    });

    const chart1 = new google.visualization.ColumnChart(document.getElementById('grafica1'));
    chart1.draw(dataBarras, { title: 'Comparativa de Horas', height: 250 });

    const dataPie = new google.visualization.DataTable();
    dataPie.addColumn('string', 'Proyecto');
    dataPie.addColumn('number', 'Costo');

    this.proyectos.forEach(p => {
      dataPie.addRow([p.nombre, (p.horasReales * p.costoHora)]);
    });

    const chart2 = new google.visualization.PieChart(document.getElementById('grafica2'));
    chart2.draw(dataPie, { title: 'Distribución de Costos', height: 250 });
  }

  async guardar() {
    const payload = { ...this.proyecto, usuario_correo: this.usuarioLogueado.email };
    this.proyectosService.guardarProyecto(payload).subscribe(() => {
      this.proyecto = { nombre: '', horasEstimadas: 0, horasReales: 0, costoHora: 0 };
      this.cargarDatos();
    });
  }

  salir() {
    this.router.navigate(['/login']);
  }
}