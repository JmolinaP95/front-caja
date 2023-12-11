import { Component, OnInit } from '@angular/core';
import { CajaService } from '../service/caja.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
})
export class CajaComponent implements OnInit {
  data: any[] = [];
  cols: any[] = [];
  items: MenuItem[] = [];
  displaySaveDialog: boolean = false;
  caja: any = {
    id_caja: null,
    fecha: null,
    descripcion: null,
    estado_registro: null,
    usuario_ingreso: null,
    fecha_ingreso: null,
    ip_ingreso: null,
    fecha_modificacion: null,
    usuario_modificacion: null,
    ip_modificacion: null,
  };
  selectedCaja: any = {
    id_caja: null,
    fecha: null,
    descripcion: null,
    estado_registro: null,
    usuario_ingreso: null,
    fecha_ingreso: null,
    ip_ingreso: null,
    fecha_modificacion: null,
    usuario_modificacion: null,
    ip_modificacion: null,
  };
  
  estadoRegistroOptions: any[] = [
    { value: null, label: 'Seleccionar' },
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' },
  ];

  constructor(
    private cajaService: CajaService,
    private messageService: MessageService,
    private confirmService: ConfirmationService,
    private datePipe: DatePipe  
    ) {}

  llenarData() {
    this.cajaService.getAll().subscribe((response) => {
      if (response && response.datos) {
        this.data = response.datos;
        
      } else {
        console.error(
          'La respuesta del servidor no contiene datos válidos:',
          response
        );
      }
    });
  }

  getEstadoRegistroClass(estado: boolean): string {
    return estado ? 'estado-activo' : 'estado-inactivo';
  }

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedCaja != null && this.selectedCaja.id_caja != null) {
        this.caja = { ...this.selectedCaja };
  
        // Asegúrate de que la propiedad estado_registro tiene un valor válido
        if (this.caja.estado_registro == null) {
          // Establece un valor predeterminado o realiza la lógica necesaria
          this.caja.estado_registro = this.estadoRegistroOptions[0].value;
        }
  
        // Convierte la cadena de fecha a un objeto de fecha
        this.caja.fecha = new Date(this.caja.fecha);
  
        // Formatea la fecha en el formato deseado
        this.caja.fecha = this.datePipe.transform(this.caja.fecha, 'dd/MM/yyyy HH:mm');
  
        this.displaySaveDialog = true;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia!',
          detail: 'Por favor seleccione un registro',
        });
        return;
      }
    } else {
      this.caja = {
        estado_registro: this.estadoRegistroOptions[0].value,
      };
      this.displaySaveDialog = true;
    }
  }
  
  
  
  

  save() {
    const dataToSend = {
      fecha: this.caja.fecha,
      descripcion: this.caja.descripcion,
      estado_registro: this.caja.estado_registro?.value, // Asegurarse de manejar la posibilidad de estado_registro siendo undefined
      usuario_ingreso: this.caja.usuario_ingreso,
      fecha_ingreso: this.caja.fecha_ingreso,
      ip_ingreso: this.caja.ip_ingreso,
      fecha_modificacion: this.caja.fecha_modificacion,
      usuario_modificacion: this.caja.usuario_modificacion,
      ip_modificacion: this.caja.ip_modificacion,
    };
  
    if (this.caja.id_caja) {
      // Actualizar
      this.cajaService.update(this.caja.id_caja, dataToSend).subscribe(
        (result: any) => {
          let caja = result as any;
          this.validarCaja(caja);
          this.messageService.add({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Se editó la caja correctamente.',
          });
          this.displaySaveDialog = false;
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al editar la caja. Consulta la consola para más detalles.',
          });
        }
      );
    } else {
      // Guardar
      this.cajaService.save(dataToSend).subscribe(
        (result: any) => {
          let caja = result as any;
          this.validarCaja(caja);
          this.messageService.add({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Se guardó la caja correctamente.',
          });
          this.displaySaveDialog = false;
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al guardar la caja. Consulta la consola para más detalles.',
          });
        }
      );
    }
  }

  delete() {
    if (this.selectedCaja == null || this.selectedCaja.id_caja == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia!',
        detail: 'Por favor seleccione un registro',
      });
      return;
    }
    this.confirmService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      accept: () => {
        this.cajaService.delete(this.selectedCaja.id_caja).subscribe(
          (result: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Resultado',
              detail:
                'Se eliminó la caja con ID ' +
                result.id_caja +
                ' correctamente.',
            });
            this.deleteObject(result.id_caja);
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al eliminar la caja.',
            });
          }
        );
      },
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
      { field: 'id_caja', header: 'ID Caja' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'estado_registro', header: 'Estado' },
      { field: 'usuario_ingreso', header: 'Usuario Ingreso' },
      { field: 'fecha_ingreso', header: 'Fecha Create' },
      { field: 'ip_ingreso', header: 'IP Create' },
      { field: 'fecha_modificacion', header: 'Fecha Mod' },
      { field: 'usuario_modificacion', header: 'Usuario Mod' },
      { field: 'ip_modificacion', header: 'IP Mod' },
    ];
  
    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false),
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.showSaveDialog(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-times',
        command: () => this.delete(),
      }
    ];
  
    // Suscríbete al observable de cambios en el servicio
    this.cajaService.cambios$.subscribe(() => {
      // Realiza las actualizaciones necesarias en la vista
      this.llenarData();
    });
  }
  



}
