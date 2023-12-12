import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importa el operador tap
@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private baseUrl = 'http://localhost:3000/api/v1/recaudaciones/cajas';
  private cambiosSubject = new Subject<void>();

  cambios$ = this.cambiosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  save(caja: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    console.log('Datos a enviar:', caja);
    return this.http.post(`${this.baseUrl}`, JSON.stringify(caja), { headers: headers })
      .pipe(
        tap(() => this.notificarCambios())
      );
  }

  update(id: number, caja: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    console.log('Datos a enviar en la solicitud PUT:', caja);
    return this.http.put(`${this.baseUrl}/${id}`, JSON.stringify(caja), { headers: headers })
      .pipe(
        tap(() => this.notificarCambios())
      );
  }

  delete(id: number): Observable<any> {
    console.log('Datos a enviar:', id);
    console.log(`${this.baseUrl}/${id}`);
    return this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => this.notificarCambios())
      );
  }

  private notificarCambios() {
    this.cambiosSubject.next();
  }
}
