import { DetalleBitacoraService } from './../../../../services/avances/detalle-bitacora.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { estadoTipoBitacora } from '@common/constants/global.const';
import { FileService } from '@common/file.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BlockUIModule } from 'primeng/blockui';
import { DeferModule } from 'primeng/defer';
import { StorageService } from '@common/storage.service';
import { Router } from '@angular/router';
import { InplaceModule } from 'primeng/inplace';
import { GlobalService } from '@common/global.service';

@Component({
  selector: 'detalle-modal',
  standalone: true,
  imports: [
    TimelineModule,
    CardModule,
    TagModule,
    ButtonModule,
    AvatarModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ConfirmDialogModule,
    ToggleButtonModule,
    ReactiveFormsModule,
    BlockUIModule,
    DeferModule,
    InplaceModule
  ],
  providers: [ConfirmationService],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.scss'
})
export class DetalleModal implements OnInit {
  @Input() value: any = null
  @Input() loading: boolean = false
  informacion = {
    estados: estadoTipoBitacora,
    changeImage: false,
    image: '',
    nameImage: '',
    files: new Array<File>(),
    adjuntos: new Array<File>(),
    identificador: '',
    open: { adjunto: false, imagen: false },
    event: 'list',
    removeAdjunto: new Set(),
    loading: false,
    permisos: new Array<string>()
  }

  item: { row: any, position: number, adjuntos: File[] } = { row: null, position: 0, adjuntos: [] }

  form = new FormGroup({
    aporte: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required])
  })

  detalles: any[] = []

  constructor(
    private fileService: FileService,
    private storage: StorageService,
    private confirmationService: ConfirmationService,
    private detalleBitacoraService: DetalleBitacoraService,
    private messageService: MessageService,
    private router: Router
  ) {
    const permiso = this.storage.local.getItem('permisos')
    this.informacion.permisos = permiso[this.router.url].accion
    this.informacion.identificador = this.storage.local.getItem('usuario').id
  }

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
    const { result, error, type } = await this.detalleBitacoraService.findAll(this.value.id)
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
    if (this.value.estado === 'SEGUIMIENTO' && this.informacion.permisos.includes('CREAR'))
      this.detalles = [{type: 'create'}, ...response.datos.rows]
    else this.detalles = [...response.datos.rows]
  }

  async fileUpload(event: any) {
    this.informacion.image = ''
    if (!event.currentFiles[0]) return
    this.informacion.image = await this.fileService.resizeImage(event.currentFiles[0], 300)
    this.informacion.nameImage = event.currentFiles[0].name
    if (this.item.position > 0) this.informacion.changeImage = true
  }

  removeFile(adjunto: any) {
    if (this.informacion.removeAdjunto.has(adjunto.id)) {
      this.informacion.removeAdjunto.delete(adjunto.id)
      return
    }
    this.informacion.removeAdjunto.add(adjunto.id)
  }

  async upload(event: any) {
    this.item.adjuntos = [...event.currentFiles]
  }

  remove(index: number, files: any) {
    files.splice(index, 1)
    this.item.adjuntos = [...files]
  }

  fileSize(byte: number) {
    return this.fileService.fileSize(byte)
  }

  eliminarPublicacion() {
    this.confirmationService.confirm({
      header: '¿Estás seguro de realizar esta acción?',
      message: `Actualmente se encuentra modificando esta publicación, se perdera el avance realizado`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        if (this.item.position > 0) {
          delete this.detalles[this.item.position].type
          this.item = { position: 0, adjuntos: [], row: null }
        }
        this.informacion.event = 'list'
        this.item.position = 0
      },
    })
  }

  nombreCompleto(usuario: any) {
    const nombreCompleto = new Array<string>();
    if (usuario?.nombres) nombreCompleto.push(usuario?.nombres)
    if (usuario?.primerApellido) nombreCompleto.push(usuario?.primerApellido)
    if (usuario?.segundoApellido) nombreCompleto.push(usuario?.segundoApellido)
    return nombreCompleto.join(' ')
  }

  async publicar() {
    if (!this.form.valid) return
    this.loadingEvent(true)
    const value: any = { ...this.form.value, idBitacora: this.value.id, estado: 'ACTIVO' }
    if (this.informacion.open.imagen && this.informacion.image) {
      const { error, result } = await this.fileService.sendFile(
        `/avances/detalle-bitacora/image/${this.value.id}`,
        { file: this.informacion.image, name: this.informacion.nameImage }
      )
      if (error) {
        this.loadingEvent(false)
        return
      }
      if (!result?.datos?.id) {
        this.loadingEvent(false)
        return
      }
      value.idAdjunto = result.datos.id
    }
    if (this.informacion.open.adjunto && this.item.adjuntos.length > 0) {
      const { error, result } = await this.fileService.sendFiles(
        `/avances/detalle-bitacora/file/${this.value.id}`,
        this.item.adjuntos
      )
      if (error) {
        this.loadingEvent(false)
        return
      }
      value.adjuntos = result.datos
    }
    const { result, error, type } = await this.detalleBitacoraService.save(value)
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.mensaje || response,
        sticky: true,
      })
      this.loadingEvent(false)
      return
    }
    this.addRow(response.datos)
    this.loadingEvent(false)
    this.informacion.event = 'list'
  }

  async actualizarPublicar() {
    if (!this.form.valid) return
    this.loadingEvent(true)
    const value: any = { ...this.form.value, idBitacora: this.value.id, estado: 'ACTIVO', id: this.item.row.id }
    if (this.informacion.open.adjunto && this.item.adjuntos.length > 0) {
      const { error, result } = await this.fileService.sendFiles(
        `/avances/detalle-bitacora/file/${this.value.id}`,
        this.item.adjuntos
      )
      if (error) {
        this.loadingEvent(false)
        return
      }
      value.adjuntos = result.datos
    }
    if (this.informacion.removeAdjunto.size > 0)
      value.removeAdjunto = Array.from(this.informacion.removeAdjunto)
    if (!this.informacion.open.imagen) value.idAdjunto = null
    if (this.informacion.open.imagen && this.informacion.image && this.informacion.changeImage) {
      const { error, result } = await this.fileService.sendFile(
        `/avances/detalle-bitacora/image/${this.value.id}`,
        { file: this.informacion.image, name: this.informacion.nameImage }
      )
      if (error) {
        this.loadingEvent(false)
        return
      }
      if (!result?.datos?.id) {
        this.loadingEvent(false)
        return
      }
      value.idAdjunto = result.datos.id
    }
    const { result, error, type } = await this.detalleBitacoraService.save(value)
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response?.mensaje || response,
        sticky: true,
      })
      this.loadingEvent(false)
      return
    }
    const detalles = this.detalles
    detalles[this.item.position] = response.datos
    this.detalles = [...detalles]
    this.informacion.event = 'list'
    this.loadingEvent(false)
    this.item = { adjuntos: [], position: 0, row: null }
  }

  addRow(row: any) {
    const detalles = this.detalles
    detalles.splice(0, 1)
    this.detalles = [{ type: 'create' }, row, ...detalles]
  }

  download(adjunto: any) {
    const link = document.createElement('a')
    link.download = adjunto.nombre
    link.href = adjunto.path
    link.target = "_blank";
    link.click()
  }

  loadingEvent(state: boolean) {
    this.loading = state
    for (const key in this.form.controls) {
      if (!state) this.form.get(key)?.enable()
      else this.form.get(key)?.disable()
    }
  }

  async changeEvent(event: 'create' | 'update' | 'list', position: number = 0) {
    this.informacion.image = ''
    this.informacion.open = { adjunto: false, imagen: false }
    this.form = new FormGroup({
      aporte: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    })
    this.item.adjuntos = []
    this.informacion.files = []
    this.informacion.removeAdjunto = new Set()
    this.informacion.changeImage = false
    if (this.informacion.event === 'list') {
      this.informacion.event = event
      if (position) {
        this.item.position = position
        this.item.row = this.detalles[position]
        this.detalles[position].type = 'update'
        this.form.patchValue(this.item.row)
        this.informacion.image = this.item.row?.imagen?.path
        if (this.informacion.image) {
          const file = await this.fileService.urlToFile(this.item.row?.imagen?.path, this.item.row?.imagen.nombre)
          this.informacion.files = [file]
        }
        this.informacion.open.adjunto = false
        this.informacion.open.imagen = !!this.item.row?.imagen
      } else this.item.position = 0
      return
    }
    this.confirmationService.confirm({
      header: '¿Esta seguro de realizar esta acción?',
      message: `Actualmente se encuentra ${ this.informacion.event === 'create' ? 'creando' : 'actualizando' } otra publicación, se perdera el avance de la otra publicación.`,
      accept: async () => {
        this.informacion.event = event;
        if (this.item.position > 0)
          delete this.detalles[this.item.position].type
        if (position) {
          this.item.position = position
          this.detalles[position].type = 'update'
          this.item.row = this.detalles[position]
          this.form.patchValue(this.item.row)
          this.informacion.image = this.item.row?.imagen?.path
          if (this.informacion.image) {
            const file = await this.fileService.urlToFile(this.item.row?.imagen?.path, this.item.row?.imagen.nombre)
            this.informacion.files = [file]
          }
          this.informacion.open.adjunto = false
          this.informacion.open.imagen = !!this.item.row?.imagen
        } else this.item.position = 0
      },
    })
  }
}
