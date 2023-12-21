import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RubloService {

  private baseUrl = 'http://localhost:3000/api/v1/rentas/rublos/rublos';  // Cambiado a la nueva URL
  private cambiosSubject = new Subject<void>();

  cambios$ = this.cambiosSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
  getAllServicios(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/servicios`);
  }
  getByDateRange(startDate: string, endDate: string): Observable<any> {
    const Number = "Opcion true";
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('Op_Filtro', Number);

    console.log(`Enviando solicitud a: ${this.baseUrl}/byDateRange/${startDate}/${endDate}`);
    console.log('Parámetros enviados:', params.toString());

    return this.http.get<any>(`${this.baseUrl}/byDateRange/${startDate}/${endDate}`, { params }).pipe(
      tap((response) => {
        console.log('Respuesta recibida:', response);
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        throw error;
      })
    );
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
    return this.http.put(`${this.baseUrl}${id}`, JSON.stringify(caja), { headers: headers })
      .pipe(
        tap(() => this.notificarCambios())
      );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}`)
      .pipe(
        tap(() => this.notificarCambios())
      );
  }

  private notificarCambios() {
    this.cambiosSubject.next();
  }
}
