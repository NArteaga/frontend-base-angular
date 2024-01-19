import { Component, ViewChild } from '@angular/core';
import { CrudtableComponent } from '@components/crudtable/crudtable.component';
import { RolModal } from '@modals/admin/rol/rol.component';
import { RolService } from '@services/admin/rol.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'rol-page',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    CrudtableComponent,
    ChipModule,
    ButtonModule,
    DialogModule,
    RolModal
  ],
  providers: [ConfirmationService],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.scss'
})
export class RolPage {
  @ViewChild(CrudtableComponent) table!: CrudtableComponent;
  columns = [
    { key: 'nombre', label: 'Nombre', aling: 'center' },
    { key: 'descripcion', label: 'Descripción', aling: 'center' },
    { key: 'estado', label: 'Estado', aling: 'center' },
  ]

  filters: { label: string, control: string, type: 'text' | 'select', options?: Array<{ label: string, value: string }>, style: string }[] = [
    { label: 'Nombre', control: 'nombre', type: 'text', style: 'col-12 md:col-6' },
    {
      label: 'Estado',
      control: 'estado',
      type: 'select',
      options: [{ label: 'ACTIVO', value: 'ACTIVO' }, { label: 'INACTIVO', value: 'INACTIVO' }],
      style: 'col-12 md:col-6'
    },
  ]

  items: Array<any> = []

  total = 0

  open = { modify: false }

  select: any = null

  constructor(
    private rolService: RolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  async change({ control: { rows, page }, filter }: any) {
    const { result, error, type } = await this.rolService.findAll({ limit: rows, page: page, ...filter })
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
    this.total = response.datos.rows?.length
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
    const { result, error, type } = await this.rolService.save(row)
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
