import { MenubarModule } from 'primeng/menubar';
import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { StorageService } from '../../../common/storage.service';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { GlobalService } from '../../../common/global.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MediaChange, MediaObserver } from '@angular/flex-layout'
import { Subscription, distinctUntilChanged } from 'rxjs';
import { ProyectoService } from '../../../service/general/proyecto.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'proyectos-page',
  standalone: true,
  imports: [
    FieldsetModule,
    CardModule,
    DataViewModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    DropdownModule,
    DividerModule,
    ReactiveFormsModule,
    PaginatorModule,
    ToastModule,
    ChipsModule
  ],
  providers: [MessageService],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.scss'
})
export class ProyectosPage {
  title = ''
  icon = ''
  permisos: Array<string> = []
  tipo: any = [
    { name: 'SEGUIMIENTO', code: 'SEGUIMIENTO' },
    { name: 'CERRADO', code: 'CERRADO' },
    { name: 'CANCELADO', code: 'CANCELADO' }
  ]
  openFilter = false
  form = new FormGroup({
    nombre: new FormControl(''),
    palabraClave: new FormControl(''),
    estado: new FormControl(''),
  })
  controlPage = {
    rows: 10,
    page: 0
  }
  proyectos = new Array<any>()
  rowsItem = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 50, value: 50 }
  ];
  row = 0
  totalRecords = 0
  estados: any = {
    'SEGUIMIENTO': {
      icon: 'pi pi-clock',
      color: 'warning'
    },
    'CERRADO': {
      icon: 'pi pi-check',
      color: 'success'
    },
    'CANCELADO': {
      icon: 'pi pi-times',
      color: 'danger'
    }
  }
  mediaSubcription!: Subscription
  mediaQuery: string = ''

  ngOnDestroy(): void {
    this.mediaSubcription.unsubscribe()
  }

  ngOnInit(): void {
    const getAlias = (MediaChange: MediaChange[]) => MediaChange[0].mqAlias
    this.mediaSubcription = this.mediaObserver
      .asObservable()
      .pipe(
        distinctUntilChanged((x: MediaChange[], y: MediaChange[]) => getAlias(x) === getAlias(y))
      )
      .subscribe((change) => {
        this.mediaQuery = change[0].mqAlias
        this.global.setQuery(change[0].mqAlias)
      })
  }

  constructor(
    private storage: StorageService,
    private router: Router,
    private global: GlobalService,
    private mediaObserver: MediaObserver,
    private proyecto: ProyectoService,
    private messageService: MessageService,
  ) {
    const select = this.storage.session.getItem('select')
    this.title = select.title
    this.icon = select.icon
    const permiso = this.storage.local.getItem('permisos')
    this.permisos = permiso[this.router.url].accion
  }

  filterEvent() {
    this.form.value.estado = this.form.value.estado || ''
    this.findAll(this.controlPage.rows, this.controlPage.page, this.form.value)
  }

  refresh() {
    this.findAll(this.controlPage.rows, this.controlPage.page, this.form.value)
  }

  resetear() {
    this.row = 0
    this.controlPage.page = 0
    this.findAll(this.controlPage.rows, 0, this.form.value)
  }

  changePage(event: PaginatorState) {
    this.controlPage.page = event.page || 0
    this.controlPage.rows = event.rows || 0
    this.findAll(event.rows, event.page, this.form.value)
  }

  findAll = async (limit: number = 0, page: number = 0, data: any = {}) => {
    const { result, error, type } = await this.proyecto.findAll({ limit, page, ...data })
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response.mensaje,
        sticky: false,
      })
      this.proyectos = []
      this.totalRecords = 0
      return
    }
    this.proyectos = response.datos.rows
    this.totalRecords = response.datos.count
  }
}
