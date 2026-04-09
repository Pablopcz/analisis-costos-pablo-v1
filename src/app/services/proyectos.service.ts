import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proyecto {
  id?: number;
  nombre: string;
  horasEstimadas: number;
  horasReales: number;
  costoHora: number;
  usuario_correo: string;
  created_at?: string; // ✅ CLAVE para "Último registro"
}

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private apiUrl = 'http://localhost:3000/proyectos';

  constructor(private http: HttpClient) {}

  // ✅ Traer proyectos por correo del usuario (correo codificado)
  getProyectos(correo: string): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(
      `${this.apiUrl}/${encodeURIComponent(correo)}`
    );
  }

  // ✅ Guardar proyecto en MySQL
  guardarProyecto(proyecto: Proyecto): Observable<any> {
    return this.http.post(this.apiUrl, proyecto);
  }

  // ✅ Eliminar proyecto por ID
  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}