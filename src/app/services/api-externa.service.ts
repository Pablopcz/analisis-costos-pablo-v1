import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiExternaService {

  private url = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  obtenerUsuarios() {
    return this.http.get<any[]>(this.url);
  }
}
