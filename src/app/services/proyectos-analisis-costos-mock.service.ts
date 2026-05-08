import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyectosAnalisisCostosMockService {

  private url =
    'https://69c5c91ff272266f3eab8814.mockapi.io/proyectos-analisis-costos';

  constructor(private http: HttpClient) {}

  // ✅ GET
  obtener() {
    return this.http.get<any[]>(this.url);
  }

  // ✅ POST
  crear(proyecto: any) {
    return this.http.post(this.url, proyecto);
  }
  
eliminar(id: string) {
  return this.http.delete(`${this.url}/${id}`);
}

}