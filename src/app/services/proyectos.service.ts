import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Proyecto {
  _id?: string; // ✅ ESTO FALTABA
  nombre: string;
  horasEstimadas: number;
  horasReales: number;
  costoHora: number;
  usuario_correo: string;
  createdAt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private apiUrl = 'http://localhost:4000/api/proyectos';

  constructor(private http: HttpClient) {}

  // ✅ obtener proyectos (para tabla + gráficas)
  obtenerProyectos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ guardar proyecto
  crearProyecto(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // ✅ eliminar proyecto
  eliminarProyecto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}