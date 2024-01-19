import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudtableComponent } from '@components/crudtable/crudtable.component';
import { MenuModal } from '@modals/admin/menu/menu.component';
import { UsuarioModal } from '@modals/admin/usuario/usuario.component';
import { MenuService } from '@services/admin/menu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'menu-page',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    CrudtableComponent,
    ChipModule,
    ButtonModule,
    DialogModule,
    MenuModal
  ],
  providers: [ConfirmationService],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuPage implements OnInit {
  @ViewChild(CrudtableComponent) table!: CrudtableComponent;
  columns = [
    { key: 'nombre', label: 'Nombre', aling: 'center' },
    { key: 'icono', label: 'Icono', aling: 'center' },
    { key: 'ruta', label: 'Ruta', aling: 'center' },
    { key: 'tipo', label: 'Tipo', aling: 'center' },
    { key: 'estado', label: 'Estado', aling: 'center' },
  ]

  filters: { label: string, control: string, type: 'text' | 'select', options?: Array<{ value: string, label: string }>, style: string }[] = [
    { label: 'Nombre', control: 'nombre', type: 'text', style: 'col-12 md:col-4' },
    { label: 'Ruta', control: 'ruta', type: 'text', style: 'col-12 md:col-4' },
    {
      label: 'Estado',
      control: 'estado',
      type: 'select',
      options: [{ label: 'ACTIVO', value: 'ACTIVO' }, { label: 'INACTIVO', value: 'INACTIVO' }],
      style: 'col-12 md:col-4'
    },
    {
      label: 'Tipo',
      control: 'tipo',
      type: 'select',
      options: [
        { label: 'AGRUPADOR', value: 'GRUPO_MENU' },
        { label: 'MENU', value: 'MENU' },
        { label: 'VISTA', value: 'VISTA' },
        { label: 'API', value: 'API' }
      ],
      style: 'col-12 md:col-6'
    },
    {
      label: 'Grupo de Menu',
      control: 'idAgrupador',
      type: 'select',
      options: [],
      style: 'col-12 md:col-6'
    },

  ]

  items: Array<any> = []
  total = 0

  open = { modify: false }

  select: any = null

  constructor(
    private menuService: MenuService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  async ngOnInit() {
    const { result, error } = await this.menuService.findGroup('GRUPO_MENU')
    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message })
      return
    }
    this.filters[4].options = result.datos.map((menu: any) => ({
      label: menu.nombre,
      value: menu.id
    }))
  }

  async change({ control: { rows, page }, filter }: any) {
    const { result, error, type } = await this.menuService.findAll({ limit: rows, page: page, ...filter })
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response.mensaje,
        sticky: false,
      })
      this.total = 0
      this.items = []
      return
    }
    this.total = response.datos.count
    this.items = response.datos.rows
  }

  async refresh(event: any) {
    await this.change(event)
  }

  add() {
    this.open.modify = true
  }

  modify(row: any) {
    this.select = row
    this.open.modify = true
  }

  cancel() {
    this.open.modify = false
    this.select = null
  }

  async save(row: any) {
    console.log(row)
    const { result, error, type } = await this.menuService.save(row)
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.mensaje || result,
        sticky: false,
      })
      return
    }
    this.open.modify = false
    this.select = null
    this.table.reset()
  }

  changeEstado(row: any) {
    this.confirmationService.confirm({
      header: '¿Esta seguro de cambiar el estado del menu?',
      message: `El menu "${row.nombre}" se cambiara el estado ${ row.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }, por favor confirme para proceder`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const select = { id: row.id, estado: row.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        await this.save(select)
      },
    })
  }
}
