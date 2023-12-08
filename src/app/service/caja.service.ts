import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  baseUrl:string = "http://localhost:3000/api/v1/recaudaciones/cajas/";

  constructor(private http:HttpClient) { }

  
  
  getAll() : Observable<any>{
    return this.http.get<any>(this.baseUrl);
  }
  
  save(caja: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.baseUrl, JSON.stringify(caja), { headers: headers });
  }
  
  update(caja: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put(`${this.baseUrl}/${caja.id_caja}`, JSON.stringify(caja), { headers: headers });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
}
