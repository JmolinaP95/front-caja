export class Caja {
    constructor(
      public id_caja: number ,
      public fecha: Date ,
      public descripcion: string ,
      public estado_registro: number ,
      public usuario_ingreso: string ,
      public fecha_ingreso: Date ,
      public ip_ingreso: string ,
      public fecha_modificacion: Date ,
      public usuario_modificacion: string ,
      public ip_modificacion: string 
    ) {}
  }