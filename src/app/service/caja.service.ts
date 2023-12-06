import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  baseUrl:string = "http://localhost:3007";

  constructor(private http:HttpClient) { }

  getAll() : Observable<any>{
    return this.http.get<any>(this.baseUrl);
  }


  
}
