import { Component, OnInit } from '@angular/core';
import { CajaService } from '../service/caja.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  data: any [] = [];
  cols: any[] = [];

  constructor(private cajaService: CajaService){}

  llenarData(){
    this.cajaService.getAll().subscribe( data => {
      this.data = data;
      console.log(this.data);
    })
  }
  
  
  ngOnInit() {
    this.llenarData();
  }


}
