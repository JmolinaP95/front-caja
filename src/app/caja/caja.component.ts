import { Component, OnInit } from '@angular/core';
import { CajaService } from '../service/caja.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css'],
})
export class CajaComponent implements OnInit {
  startDate: Date;
  endDate: Date;
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

  estadoRegistroOptions: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  constructor(
    private cajaService: CajaService,
    private messageService: MessageService,
    private confirmService: ConfirmationService,
    private datePipe: DatePipe
  ) {
    // Inicializar las fechas
    this.startDate = new Date();
    this.endDate = new Date();
  }
  buscarPorFecha() {
   
    // Implementa la lógica para buscar por fecha
    // Puedes utilizar el método llenarData() para realizar la búsqueda
    this.llenarData_Rango();
  }

  llenarData_Rango() {
    debugger;
  
    // Formatea las fechas al formato deseado para la consulta
    const formattedStartDate = this.startDate.toISOString();
    const formattedEndDate = this.endDate.toISOString();
  
    // Utiliza el servicio para obtener los datos
    this.cajaService.getByDateRange(formattedStartDate, formattedEndDate).subscribe((response) => {
      if (response && response.datos) {
        this.data = response.datos.cajasEnRango;
      } else {
        console.error('La respuesta del servidor no contiene datos válidos:', response);
      }
    });
  }
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
    let estado_resp: string = '';
    if (estado) {
      estado_resp = 'estado-activo';
    } else if (!estado) {
      estado_resp = 'estado-inactivo';
    }

    return estado_resp;
  }

  updateEstadoRegistro(value: boolean) {
    console.log("Dentro del updateEstadoRegistro");
    console.log("Valor actual updateEstadoRegistro caja.estado_registro:" + this.caja.estado_registro + " value: " + value);

    // Asegúrate de que el valor sea booleano
    this.caja.estado_registro = value;
  }

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedCaja != null && this.selectedCaja.id_caja != null) {
        this.caja = { ...this.selectedCaja };

        if (this.caja.estado_registro == null || this.caja.estado_registro == undefined) {
          this.caja.estado_registro = this.estadoRegistroOptions[0].value;
        }

        // Convierte la cadena de fecha a un objeto de fecha
        this.caja.fecha = new Date(this.caja.fecha);

        // Formatea la fecha en el formato deseado
        this.caja.fecha = this.datePipe.transform(this.caja.fecha, 'dd/MM/yyyy HH:mm');

        console.log("Valor a buscar" + this.caja.estado_registro);
        this.caja.estado_registro = this.estadoRegistroOptions.find(option => option.value === this.caja.estado_registro)?.value;

        this.updateEstadoRegistro(this.caja.estado_registro);

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
    console.log("METODO SAVE");
    console.log("This caja=" + this.caja.estado_registro);
    console.log("This selectedCaja=" + this.selectedCaja.estado_registro);

    const dataToSend = {
      fecha: this.caja.fecha,
      descripcion: this.caja.descripcion,
      estado_registro: this.caja.estado_registro,
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
    if (!this.selectedCaja || !this.selectedCaja.id_caja) {
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
          (response: any) => {
            if (response && response.error === false && response.codigo === 200) {
              const cantidadEliminada = response.datos?.datos?.[0];

              if (cantidadEliminada > 0) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Resultado',
                  detail: 'Se eliminó la caja correctamente.',
                });
                this.deleteObject(this.selectedCaja.id_caja);
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Advertencia',
                  detail: 'La caja no existe o ya ha sido eliminada.',
                });
              }
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al eliminar la caja. Consulta la consola para más detalles.',
              });
            }
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
    // Llena los datos iniciales
    this.llenarData();

    // Configura las columnas de la tabla
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

    // Configura los elementos del menú
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
