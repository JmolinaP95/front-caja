import { Component, OnInit } from '@angular/core';
import { RubloService } from '../service/rublo.service';  // Importa el nuevo servicio
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-rublo',
  templateUrl: './rublo.component.html',
  styleUrls: ['./rublo.component.css'],
})
export class RubloComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  data: any[] = [];
  servicios: any[] = [];
  selectedServicio: any;
  cols: any[] = [];
  items: MenuItem[] = [];
  displaySaveDialog: boolean = false;

  rublo: any = {
    id_mant_ctas_rubro: null,
    fecha: null,
    periodo: null,
    descripcion: null,
    estado_registro: null,
    cta_ing: null,
    cta_cxc: null,
    valor: null,
    tipo_rubro: null,
    usuario_ingreso: null,
    fecha_ingreso: null,
    ip_ingreso: null,
    fecha_modificacion: null,
    usuario_modificacion: null,
    ip_modificacion: null,
    id_servicio: null
  };
  selectedRublo: any = {
    id_mant_ctas_rubro: null,
    fecha: null,
    periodo: null,
    descripcion: null,
    estado_registro: null,
    cta_ing: null,
    cta_cxc: null,
    valor: null,
    tipo_rubro: null,
    usuario_ingreso: null,
    fecha_ingreso: null,
    ip_ingreso: null,
    fecha_modificacion: null,
    usuario_modificacion: null,
    ip_modificacion: null,
    id_servicio: null
  };

  estadoRegistroOptions: SelectItem[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  constructor(
    private rubloService: RubloService,  // Cambia el nombre del servicio
    private messageService: MessageService,
    private confirmService: ConfirmationService,
    private datePipe: DatePipe
  ) {
    // Inicializar las fechas
    this.startDate = new Date();
    this.endDate = new Date();
  }

  buscarPorFecha() {
    this.llenarData_Rango();
  }

  llenarData_Rango() {
    const formattedStartDate = this.startDate.toISOString();
    const formattedEndDate = this.endDate.toISOString();

    this.rubloService.getByDateRange(formattedStartDate, formattedEndDate).subscribe((response) => {
      if (response && response.datos) {
        this.data = response.datos.rublosEnRango;
      } else {
        console.error('La respuesta del servidor no contiene datos válidos:', response);
      }
    });
  }

  llenarData() {
    this.rubloService.getAll().subscribe((response) => {
      if (response && response.datos) {
        this.data = response.datos;
      } else {
        console.error('La respuesta del servidor no contiene datos válidos:', response);
      }
    });
  }
  llenarServicios(){
    this.rubloService.getAllServicios().subscribe((response) => {
      if (response && response.datos) {
        this.servicios = response.datos;
      } else {
        console.error('La respuesta del servidor no contiene datos válidos:', response);
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
    console.log("Valor actual updateEstadoRegistro rublo.estado_registro:" + this.rublo.estado_registro + " value: " + value);

    // Asegúrate de que el valor sea booleano
    this.rublo.estado_registro = value;
  }

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedRublo != null && this.selectedRublo.id_mant_ctas_rubro != null) {
        this.rublo = { ...this.selectedRublo };

        if (this.rublo.estado_registro == null || this.rublo.estado_registro == undefined) {
          this.rublo.estado_registro = this.estadoRegistroOptions[0].value;
        }

        // Convierte la cadena de fecha a un objeto de fecha
        this.rublo.fecha = new Date(this.rublo.fecha);

        // Formatea la fecha en el formato deseado
        this.rublo.fecha = this.datePipe.transform(this.rublo.fecha, 'dd/MM/yyyy HH:mm');

        console.log("Valor a buscar" + this.rublo.estado_registro);
        this.rublo.estado_registro = this.estadoRegistroOptions.find(option => option.value === this.rublo.estado_registro)?.value;

        this.updateEstadoRegistro(this.rublo.estado_registro);

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
      this.rublo = {
        estado_registro: this.estadoRegistroOptions[0].value,
      };
      this.displaySaveDialog = true;
    }
  }

  save() {
    console.log("METODO SAVE");
    console.log("This rublo=" + this.rublo.estado_registro);
    console.log("This selectedRublo=" + this.selectedRublo.estado_registro);

    const dataToSend = {
      fecha: this.rublo.fecha,
      periodo: this.rublo.periodo,
      descripcion: this.rublo.descripcion,
      estado_registro: this.rublo.estado_registro,
      cta_ing: this.rublo.cta_ing,
      cta_cxc: this.rublo.cta_cxc,
      valor: this.rublo.valor,
      tipo_rubro: this.rublo.tipo_rubro,
      usuario_ingreso: this.rublo.usuario_ingreso,
      fecha_ingreso: this.rublo.fecha_ingreso,
      ip_ingreso: this.rublo.ip_ingreso,
      fecha_modificacion: this.rublo.fecha_modificacion,
      usuario_modificacion: this.rublo.usuario_modificacion,
      ip_modificacion: this.rublo.ip_modificacion,
      id_servicio: this.rublo.id_servicio
    };

    if (this.rublo.id_mant_ctas_rubro) {
      // Actualizar
      this.rubloService.update(this.rublo.id_mant_ctas_rubro, dataToSend).subscribe(
        (result: any) => {
          let rublo = result as any;
          this.validarRublo(rublo);
          this.messageService.add({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Se editó el rublo correctamente.',
          });
          this.displaySaveDialog = false;
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al editar el rublo. Consulta la consola para más detalles.',
          });
        }
      );
    } else {
      // Guardar
      this.rubloService.save(dataToSend).subscribe(
        (result: any) => {
          let rublo = result as any;
          this.validarRublo(rublo);
          this.messageService.add({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Se guardó el rublo correctamente.',
          });
          this.displaySaveDialog = false;
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ocurrió un error al guardar el rublo. Consulta la consola para más detalles.',
          });
        }
      );
    }
  }

  delete() {
    if (!this.selectedRublo || !this.selectedRublo.id_mant_ctas_rubro) {
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
        this.rubloService.delete(this.selectedRublo.id_mant_ctas_rubro).subscribe(
          (response: any) => {
            if (response && response.error === false && response.codigo === 200) {
              const cantidadEliminada = response.datos?.datos?.[0];

              if (cantidadEliminada > 0) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Resultado',
                  detail: 'Se eliminó el rublo correctamente.',
                });
                this.deleteObject(this.selectedRublo.id_mant_ctas_rubro);
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Advertencia',
                  detail: 'El rublo no existe o ya ha sido eliminado.',
                });
              }
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error al eliminar el rublo. Consulta la consola para más detalles.',
              });
            }
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al eliminar el rublo.',
            });
          }
        );
      },
    });
  }

  deleteObject(id_mant_ctas_rubro: number) {
    let index = this.data.findIndex((e) => e.id_mant_ctas_rubro == id_mant_ctas_rubro);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }

  validarRublo(rublo: any) {
    let index = this.data.findIndex((e) => e.id_mant_ctas_rubro == rublo.id_mant_ctas_rubro);

    if (index !== -1) {
      this.data[index] = rublo;
    } else {
      this.data.push(rublo);
    }
  }

  ngOnInit() {
    // Llena los datos iniciales
    this.llenarData();

    // Configura las columnas de la tabla
    this.cols = [
      { field: 'id_mant_ctas_rubro', header: 'ID Rublo' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'periodo', header: 'Periodo' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'estado_registro', header: 'Estado' },
      { field: 'cta_ing', header: 'Cta Ingreso' },
      { field: 'cta_cxc', header: 'Cta CXC' },
      { field: 'valor', header: 'Valor' },
      { field: 'tipo_rubro', header: 'Tipo Rubro' },
      { field: 'usuario_ingreso', header: 'Usuario Ingreso' },
      { field: 'fecha_ingreso', header: 'Fecha Create' },
      { field: 'ip_ingreso', header: 'IP Create' },
      { field: 'fecha_modificacion', header: 'Fecha Mod' },
      { field: 'usuario_modificacion', header: 'Usuario Mod' },
      { field: 'ip_modificacion', header: 'IP Mod' },
      { field: 'id_servicio', header: 'ID Servicio' }
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
    this.rubloService.cambios$.subscribe(() => {
      // Realiza las actualizaciones necesarias en la vista
      this.llenarData();
    });
  }
}
