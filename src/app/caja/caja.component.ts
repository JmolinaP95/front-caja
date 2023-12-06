import { Component, OnInit } from '@angular/core';
import { Caja } from 'src/model/caja';  
import { CajaService } from '../service/caja.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

  cajas: Caja [];
  cols: any[] = [];

  constructor(private cajaService: CajaService){}

  getAll() {
    this.cajaService.getAll().subscribe(
      (result: any) => {
        for (let i = 0; i < result.length; i++) {
          let persona = result[i] as Caja;
          this.cajas.push(persona);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.getAll();

  }
}
