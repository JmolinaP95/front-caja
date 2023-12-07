import { Component, OnInit } from '@angular/core';
import { CajaService } from '../service/caja.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';




import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
  
})
export class CajaComponent implements OnInit {

  data: any[] = [];
  cols: any[] = [];
  items: MenuItem[]= [];

  displaySaveDialog: boolean = false;
  caja: any = {
    id_caja: null,
    fecha: null,
    descripcion: null,
    estado_registro: null,
    // Agrega aquí el resto de los campos de la caja según tu modelo
  };

  selectedCaja: any = {
    id_caja: null,
    fecha: null,
    descripcion: null,
    estado_registro: null,
    // Agrega aquí el resto de los campos de la caja según tu modelo
  };

  constructor(private cajaService: CajaService, private messageService: MessageService, private confirmService: ConfirmationService) { }

  llenarData() {
    this.cajaService.getAll().subscribe(data => {
      this.data = data;
      console.log(this.data);
    });
  }

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedCaja != null && this.selectedCaja.id_caja != null) {
        this.caja = { ...this.selectedCaja }; // Copia de seguridad para evitar cambios directos en la referencia del objeto
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia!', detail: 'Por favor seleccione un registro' });
        return;
      }
    } else {
      this.caja = {};
    }
    this.displaySaveDialog = true;
  }

  save() {
    this.cajaService.save(this.caja).subscribe(
      (result: any) => {
        let caja = result as any;
        this.validarCaja(caja);
        this.messageService.add({ severity: 'success', summary: 'Resultado', detail: 'Se guardó la caja correctamente.' });
        this.displaySaveDialog = false;
      },
      error => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar la caja.' });
      }
    );
  }

  delete() {
    if (this.selectedCaja == null || this.selectedCaja.id_caja == null) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia!', detail: 'Por favor seleccione un registro' });
      return;
    }
    this.confirmService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      accept: () => {
        this.cajaService.delete(this.selectedCaja.id_caja).subscribe(
          (result: any) => {
            this.messageService.add({ severity: 'success', summary: 'Resultado', detail: 'Se eliminó la caja con ID ' + result.id_caja + ' correctamente.' });
            this.deleteObject(result.id_caja);
          },
          error => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al eliminar la caja.' });
          }
        );
      }
    });
  }

  deleteObject(id_caja: number) {
    let index = this.data.findIndex((e) => e.id_caja == id_caja);
    if (index != -1) {
      this.data.splice(index, 1);
    }
  }

  validarCaja(caja: any) {
    let index = this.data.findIndex((e) => e.id_caja == caja.id_caja);

    if (index != -1) {
      this.data[index] = caja;
    } else {
      this.data.push(caja);
    }
  }

  ngOnInit() {
    this.llenarData();
    this.cols = [
      { field: 'id_caja', header: 'ID' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'estado_registro', header: 'Estado Registro' },
      // Agrega aquí el resto de los campos de la caja según tu modelo
    ];

    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false)
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.showSaveDialog(true)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => this.delete()
      }
    ];
  }
}