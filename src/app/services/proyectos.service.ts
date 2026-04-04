import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {
  // URL de tu servidor Node.js
  private apiUrl = 'http://localhost:3000/proyectos';

  constructor(private http: HttpClient) { }

  // Traer datos filtrados por el correo del usuario logueado
  getProyectos(correo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${correo}`);
  }

  // Guardar nuevo proyecto en MySQL
  guardarProyecto(proyecto: any): Observable<any> {
    return this.http.post(this.apiUrl, proyecto);
  }

  // Eliminar proyecto por su ID
  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}