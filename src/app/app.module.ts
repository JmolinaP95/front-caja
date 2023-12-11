import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { CajaComponent } from './caja/caja.component';
import { HttpClientModule } from '@angular/common/http';
import {PanelModule} from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api'
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe aquí
@NgModule({
  declarations: [
    AppComponent,
    CajaComponent
  ],
  imports: [
    
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    TableModule,
    HttpClientModule,
    PanelModule,
    DialogModule,
    MenubarModule,
    ConfirmDialogModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    
    
  ], 
  providers: [
    DatePipe,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
