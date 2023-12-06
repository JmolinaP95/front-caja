import { Component, OnInit } from '@angular/core';
import { CajaService } from '../service/caja.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  providers: [MessageService, ConfirmationService]
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

    this.cols = [
      { field: 'id_caja', header: 'ID Caja xx' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'estado_registro', header: 'Estado Registro' },
      { field: 'usuario_ingreso', header: 'Usuario Ingreso' },
      { field: 'fecha_ingreso', header: 'Fecha Ingreso' },
      { field: 'ip_ingreso', header: 'IP Ingreso' },
      { field: 'fecha_modificacion', header: 'Fecha Modificación' },
      { field: 'usuario_modificacion', header: 'Usuario Modificación' },
      { field: 'ip_modificacion', header: 'IP Modificación' }
    ];
  }


}
