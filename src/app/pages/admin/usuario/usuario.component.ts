import { RolService } from './../../../services/admin/rol.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudtableComponent } from '@components/crudtable/crudtable.component';
import { UsuarioModal } from '@modals/admin/usuario/usuario.component';
import { UnidadService } from '@services/admin/unidad.service';
import { UsuarioService } from '@services/admin/usuario.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'usuario-page',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    CrudtableComponent,
    ChipModule,
    ButtonModule,
    DialogModule,
    UsuarioModal
  ],
  providers: [ConfirmationService],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioPage implements OnInit {
  @ViewChild(CrudtableComponent) table!: CrudtableComponent;
  columns = [
    { key: 'funcionario', label: 'Funcionario', aling: 'center' },
    { key: 'usuario', label: 'Usuario', aling: 'center' },
    { key: 'correo', label: 'Correo Institucional', aling: 'center' },
    { key: 'rol', label: 'Rol', aling: 'center' },
    { key: 'unidad', label: 'Unidad', aling: 'center' },
    { key: 'estado', label: 'Estado', aling: 'center' },
  ]

  filters: { label: string, control: string, type: 'text' | 'select', options?: Array<{ value: string, label: string }>, style: string }[] = [
    { label: 'Funcionario', control: 'nombres', type: 'text', style: 'col-12 md:col-4' },
    { label: 'Usuario', control: 'usuario', type: 'text', style: 'col-12 md:col-4' },
    {
      label: 'Estado',
      control: 'estado',
      type: 'select',
      options: [{ label: 'ACTIVO', value: 'ACTIVO' }, { label: 'INACTIVO', value: 'INACTIVO' }],
      style: 'col-12 md:col-4'
    },
    {
      label: 'Rol',
      control: 'rol',
      type: 'select',
      options: [{ label: 'ACTIVO', value: 'ACTIVO' }, { label: 'INACTIVO', value: 'INACTIVO' }],
      style: 'col-12 md:col-6'
    },
    {
      label: 'Unidad',
      control: 'unidad',
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
    private unidadService: UnidadService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  async ngOnInit() {
    const { result: { datos: roles } } = await this.rolService.findList()
    const { result: { datos: unidades } } = await this.unidadService.findList()
    this.filters[3].options = roles.map((rol: any) => ({ value: rol.id, label: rol.nombre.toUpperCase() }))
    this.filters[4].options = unidades.map((unidad: any) => ({ value: unidad.id, label: unidad.nombre }))
  }

  async change({ control: { rows, page }, filter }: any) {
    const { result, error, type } = await this.usuarioService.findAll({ limit: rows, page: page, ...filter })
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

  fullname(row: any) {
    const fullname: Array<string> = []
    if (row.nombres) fullname.push(row.nombres.trim())
    if (row.primerApellido) fullname.push(row.primerApellido.trim())
    if (row.segundoApellido) fullname.push(row.segundoApellido.trim())
    return fullname.join(' ')
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
    const { result, error, type } = await this.usuarioService.save(row)
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
      header: '¿Esta seguro de cambiar el estado del funcionario?',
      message: `El funcionario "${this.fullname(row)}" se cambiara el estado ${ row.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }, por favor confirme para proceder`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const select = { id: row.id, estado: row.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' }
        await this.save(select)
      },
    })
  }
}
