import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService, Proyecto } from '../../services/proyectos.service';
import { Router } from '@angular/router';
import { ApiExternaService } 
from '../../services/api-externa.service';

import { ProyectosAnalisisCostosMockService } 
from '../../services/proyectos-analisis-costos-mock.service';

// Declaramos google para evitar error de TypeScript
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
  private apiExterna = inject(ApiExternaService);

  private mockService = inject(ProyectosAnalisisCostosMockService);

  mostrarFormularioMock = false;

  proyectoMock = {
    nombreProyecto: '',
    presupuestoInicial: 0,
    costoReal: 0,
    variacion: 0,
    desviacion: 0,
    estado: '',
    categoria: '',
    responsable: '',
    costoPorDia: 0
  };

  proyectosMock: any[] = [];

  toggleFormularioMock() {
    this.mostrarFormularioMock = !this.mostrarFormularioMock;
  }

  guardarProyectoMock() {
    if (this.proyectoMock.costoReal > this.proyectoMock.presupuestoInicial) {
      this.proyectoMock.estado = 'Crítico';
    } else {
      this.proyectoMock.estado = 'Normal';
    }

    this.mockService.crear(this.proyectoMock).subscribe(() => {
      this.cargarProyectosMock();

      this.proyectoMock = {
        nombreProyecto: '',
        presupuestoInicial: 0,
        costoReal: 0,
        variacion: 0,
        desviacion: 0,
        estado: '',
        categoria: '',
        responsable: '',
        costoPorDia: 0
      };
    });
  }

  cargarProyectosMock() {
    this.mockService.obtener().subscribe(data => {
      this.proyectosMock = data;
    });
  }

  eliminarProyectoMock(id: string) {
    if (confirm('¿Deseas eliminar este proyecto de la API Mock?')) {
      this.mockService.eliminar(id).subscribe(() => {
        this.cargarProyectosMock();
      });
    }
  }

  abrirApiMock() {
    window.open(
      'https://69c5c91ff272266f3eab8814.mockapi.io/proyectos-analisis-costos',
      '_blank'
    );
  }

  public usuarioLogueado = {
    displayName: 'Pablo Cesar Zúñiga',
    email: 'pcz7910@gmail.com'
  };

  public ultimoRegistro: string = 'N/A';

  public proyectos: Proyecto[] = [];

  public proyecto: Proyecto = {
    nombre: '',
    horasEstimadas: 0,
    horasReales: 0,
    costoHora: 0,
    usuario_correo: ''
  };

  ngOnInit(): void {
    this.initCharts();
    this.cargarDatos();

    this.apiExterna.obtenerUsuarios().subscribe();

    this.cargarProyectosMock();
  }

  initCharts(): void {
    if (typeof google !== 'undefined') {
      google.charts.load('current', { packages: ['corechart'] });
    }
  }

  cargarDatos(): void {
    this.proyectosService.obtenerProyectos()
      .subscribe(datos => {

        this.proyectos = datos;

        if (this.proyectos.length > 0) {
          const ultimo = this.proyectos.reduce((a, b) =>
            new Date(a.createdAt!) > new Date(b.createdAt!) ? a : b
          );
          this.ultimoRegistro = ultimo.createdAt!;
        } else {
          this.ultimoRegistro = 'N/A';
        }

        setTimeout(() => {
          this.dibujarGraficas();
        }, 0);
      });
  }

  dibujarGraficas(): void {
    if (typeof google === 'undefined' || !google.visualization) return;

    const dataBarras = new google.visualization.DataTable();
    dataBarras.addColumn('string', 'Proyecto');
    dataBarras.addColumn('number', 'Estimadas');
    dataBarras.addColumn('number', 'Reales');

    this.proyectos.forEach(p => {
      dataBarras.addRow([p.nombre, p.horasEstimadas, p.horasReales]);
    });

    new google.visualization.ColumnChart(
      document.getElementById('grafica1')
    ).draw(dataBarras, {
      title: 'Horas Estimadas vs Reales',
      height: 250
    });

    const dataPie = new google.visualization.DataTable();
    dataPie.addColumn('string', 'Proyecto');
    dataPie.addColumn('number', 'Costo Total');

    this.proyectos.forEach(p => {
      dataPie.addRow([p.nombre, p.horasReales * p.costoHora]);
    });

    new google.visualization.PieChart(
      document.getElementById('grafica2')
    ).draw(dataPie, {
      title: 'Distribución de Costos',
      height: 250
    });
  }

  guardar(): void {
    const payload: Proyecto = {
      ...this.proyecto,
      usuario_correo: this.usuarioLogueado.email
    };

    this.proyectosService.crearProyecto(payload).subscribe(() => {
      this.proyecto = {
        nombre: '',
        horasEstimadas: 0,
        horasReales: 0,
        costoHora: 0,
        usuario_correo: ''
      };
      this.cargarDatos();
    });
  }

  // ✅ ✅ ✅ ESTE ERA EL ÚNICO ERROR REAL
  eliminar(id?: string): void {
    if (!id) return;

    if (confirm('¿Deseas eliminar este registro?')) {
      this.proyectosService.eliminarProyecto(id).subscribe(() => {
        this.cargarDatos();
      });
    }
  }

  salir(): void {
    this.router.navigate(['/login']);
  }
}