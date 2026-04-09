import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectosService, Proyecto } from '../../services/proyectos.service';
import { Router } from '@angular/router';

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

  // ✅ Usuario
  public usuarioLogueado = {
    displayName: 'Pablo Cesar Zúñiga',
    email: 'pcz7910@gmail.com'
  };

  // ✅ Último registro
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
  }

  // ✅ Inicializa Google Charts
  initCharts(): void {
    if (typeof google !== 'undefined') {
      google.charts.load('current', { packages: ['corechart'] });
    }
  }

  // ✅ MÉTODO CLAVE: carga datos + redibuja TODO
  cargarDatos(): void {
    this.proyectosService
      .getProyectos(this.usuarioLogueado.email)
      .subscribe(datos => {

        // ✅ Actualizar lista
        this.proyectos = datos;

        // ✅ Calcular último registro
        if (this.proyectos.length > 0) {
          const ultimo = this.proyectos.reduce((a, b) =>
            new Date(a.created_at!) > new Date(b.created_at!) ? a : b
          );
          this.ultimoRegistro = ultimo.created_at!;
        } else {
          this.ultimoRegistro = 'N/A';
        }

        // 🔥 CLAVE ABSOLUTA → FORZAR REDIBUJO DE GRÁFICAS
        setTimeout(() => {
          this.dibujarGraficas();
        }, 0);

      });
  }

  // ✅ Dibujar gráficas con datos reales
  dibujarGraficas(): void {
    if (typeof google === 'undefined' || !google.visualization) return;

    /* -------- GRÁFICA 1: COLUMNAS -------- */
    const dataBarras = new google.visualization.DataTable();
    dataBarras.addColumn('string', 'Proyecto');
    dataBarras.addColumn('number', 'Estimadas');
    dataBarras.addColumn('number', 'Reales');

    this.proyectos.forEach(p => {
      dataBarras.addRow([p.nombre, p.horasEstimadas, p.horasReales]);
    });

    const grafica1 = document.getElementById('grafica1');
    if (grafica1) {
      const chart = new google.visualization.ColumnChart(grafica1);
      chart.draw(dataBarras, {
        title: 'Horas Estimadas vs Reales',
        height: 250
      });
    }

    /* -------- GRÁFICA 2: PASTEL -------- */
    const dataPie = new google.visualization.DataTable();
    dataPie.addColumn('string', 'Proyecto');
    dataPie.addColumn('number', 'Costo Total');

    this.proyectos.forEach(p => {
      dataPie.addRow([p.nombre, p.horasReales * p.costoHora]);
    });

    const grafica2 = document.getElementById('grafica2');
    if (grafica2) {
      const chart = new google.visualization.PieChart(grafica2);
      chart.draw(dataPie, {
        title: 'Distribución de Costos',
        height: 250
      });
    }
  }

  // ✅ Guardar proyecto SIN refrescar página
  guardar(): void {
    const payload: Proyecto = {
      ...this.proyecto,
      usuario_correo: this.usuarioLogueado.email
    };

    this.proyectosService.guardarProyecto(payload).subscribe(() => {

      // ✅ Limpiar formulario
      this.proyecto = {
        nombre: '',
        horasEstimadas: 0,
        horasReales: 0,
        costoHora: 0,
        usuario_correo: ''
      };

      // 🔥 Forzar recarga visual completa
      this.cargarDatos();

    });
  }

  // ✅ Eliminar proyecto (también actualiza todo)
  eliminar(id: number): void {
    if (confirm('¿Deseas eliminar este registro?')) {
      this.proyectosService
        .eliminarProyecto(id)
        .subscribe(() => {
          this.cargarDatos();
        });
    }
  }

  // ✅ Salir
  salir(): void {
    this.router.navigate(['/login']);
  }
}