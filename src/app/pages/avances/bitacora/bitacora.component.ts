import { resolve } from 'node:path';
import { MenubarModule } from 'primeng/menubar';
import { Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { StorageService } from '@common/storage.service';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { GlobalService } from '@common/global.service';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MediaChange, MediaObserver } from '@angular/flex-layout'
import { Subscription, distinctUntilChanged } from 'rxjs';
import { BitacoraService } from '@services/avances/bitacora.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ChipsModule } from 'primeng/chips';
import { BitacoraModal } from '@modals/avances/bitacora/bitacora.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DetalleModal } from '@modals/avances/bitacora/detalle/detalle.component';
import { estadoTipoBitacora, rowSelect, tipoBitacora } from '@common/constants/global.const'

@Component({
  selector: 'bitacora-page',
  standalone: true,
  imports: [
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
    ChipsModule,
    DialogModule,
    BitacoraModal,
    DetalleModal,
    ConfirmDialogModule,

  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss'
})
export class BitacoraPage {
  informacion = {
    item: null,
    permisos: new Array<string>(),
    tipo: tipoBitacora,
    bitacoras: new Array<any>(),
    control: { rows: 10, page: 0, total: 0 },
    rowsItem: rowSelect,
    row: 0,
    estados: estadoTipoBitacora,
    open: {
      filter: false,
      modal: false,
      modify: false,
    },
    loading: false,
    mediaQuery: '',
    estado: 'SEGUIMIENTO'
  }

  form = new FormGroup({
    nombre: new FormControl(''),
    palabraClave: new FormControl(''),
    estado: new FormControl(),
  })

  mediaSubcription!: Subscription


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
        this.informacion.mediaQuery = change[0].mqAlias
        this.global.setQuery(change[0].mqAlias)
      })
  }

  constructor(
    private storage: StorageService,
    private router: Router,
    private global: GlobalService,
    private mediaObserver: MediaObserver,
    private bitacora: BitacoraService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    const permiso = this.storage.local.getItem('permisos')
    this.informacion.permisos = permiso[this.router.url].accion
  }

  filterEvent() {
    this.form.value.estado = this.form.value.estado || ''
    this.findAll(this.informacion.control.rows, this.informacion.control.page, this.form.value)
  }

  async refresh() {
    this.informacion.loading = true
    await this.findAll(this.informacion.control.rows, this.informacion.control.page, this.form.value)
    this.informacion.loading = false
  }

  resetear() {
    this.informacion.row = 0
    this.informacion.control.page = 0
    this.findAll(this.informacion.control.rows, 0, this.form.value)
  }

  changePage(event: PaginatorState) {
    this.informacion.control.page = event.page || 0
    this.informacion.control.rows = event.rows || 0
    this.findAll(event.rows, event.page, this.form.value)
  }

  findAll = async (limit: number = 0, page: number = 0, data: any = {}) => {
    if (!data.estado) delete data.estado
    const { result, error, type } = await this.bitacora.findAll({ limit, page, ...data })
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response.mensaje,
        sticky: false,
      })
      this.informacion.bitacoras = []
      this.informacion.control.total = 0
      return
    }
    this.informacion.bitacoras = response.datos.rows
    this.informacion.control.total = response.datos.count
  }

  selectBitacora(bitacora: any) {
    this.informacion.item = bitacora
    this.informacion.open.modify = true
  }

  selectDetalleBitacora(bitacora: any) {
    this.informacion.item = bitacora
    this.informacion.open.modal = true
  }

  async save(bitacora: any) {
    const { result, error, type } = await this.bitacora.save(bitacora)
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.mensaje || response,
        sticky: true,
      })
      return
    }
    this.informacion.open.modify = false
    this.informacion.item = null
    await this.refresh()
  }

  cancel() {
    this.informacion.open.modify = false
    this.informacion.item = null
  }

  cambiarEstado(bitacora: any) {
    if (!this.informacion.permisos.includes('EDITAR')) return
    if (bitacora.estado !== 'SEGUIMIENTO' && !this.informacion.permisos.includes('ADMIN')) return
    this.informacion.estado = bitacora.estado
    this.confirmationService.confirm({
      header: '¿Esta seguro de cambiar el estado de la bitacora?',
      message: `La Bitacora "${bitacora.nombre}" se cambiara, por favor confirme para proceder`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        bitacora.estado = this.informacion.estado
        await this.save(bitacora)
      },
    })
  }
}
