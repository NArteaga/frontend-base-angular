import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { FileService } from '@common/file.service';
import { TagModule } from 'primeng/tag';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'bitacora-modal',
  standalone: true,
  imports: [
    DividerModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ChipsModule,
    FileUploadModule,
    TagModule,
    OverlayPanelModule
  ],
  templateUrl: './bitacora.component.html',
  styleUrl: './bitacora.component.scss'
})
export class BitacoraModal implements OnInit {
  title: 'Nueva' | 'Editar' = 'Nueva'
  image: { file: string, name: string } = { file: '', name: '' }
  images: any[] = []
  changeImage: boolean = false
  loading: boolean = false
  @Input() value: any = null
  @Output() cancel: EventEmitter<any> = new EventEmitter()
  @Output() save: EventEmitter<any> = new EventEmitter()
  form = new FormGroup({
    id: new FormControl(undefined),
    nombre: new FormControl<string | undefined>({ value: undefined, disabled: false }, Validators.required),
    palabraClave: new FormControl<Array<string> | undefined>({ value: undefined, disabled: false }, Validators.required),
    descripcion: new FormControl<string | undefined>({ value: undefined, disabled: false }, Validators.required),
  })
  files: any = []

  constructor(
    private fileService: FileService,
  ) {
    this.form = new FormGroup({
      id: new FormControl(undefined),
      nombre: new FormControl<string | undefined>({ value: undefined, disabled: false }, Validators.required),
      palabraClave: new FormControl<Array<string> | undefined>({ value: undefined, disabled: false }, Validators.required),
      descripcion: new FormControl<string | undefined>({ value: undefined, disabled: false }, Validators.required),
    })
    if (this.value) {
      this.title = 'Editar'
      this.form.patchValue(this.value)
    }
  }

  async ngOnInit() {
    this.loading = false
    this.image = { file: '', name: '' }
    this.form = new FormGroup({
      id: new FormControl(undefined),
      nombre: new FormControl<string | undefined>(undefined, Validators.required),
      palabraClave: new FormControl<Array<string> | undefined>(undefined, Validators.required),
      descripcion: new FormControl<string | undefined>(undefined, Validators.required),
    })
    if (this.value) {
      this.title = 'Editar'
      this.form.patchValue(this.value)
      const file = await this.fileService.urlToFile(this.value.adjunto.path, this.value.adjunto.nombre)
      this.image = { file: await this.fileService.getFile(file), name: this.value.adjunto.nombre }
      this.files = [file]
    }
  }

  exit(): void {
    this.cancel.emit()
  }

  loadingEvent(state: boolean) {
    this.loading = state
    for (const key in this.form.controls) {
      if (!state) this.form.get(key)?.enable()
      else this.form.get(key)?.disable()
    }
  }
  async submit() {
    if (!this.form.valid) return;
    if (!this.image) return;
    this.loadingEvent(true)
    let idAdjunto = ''
    if (this.changeImage) {
      const { error, result } = await this.fileService.sendFile('/avances/bitacora/file', this.image)
      if (error) {
        this.loadingEvent(false)
        return
      }
      if (!result?.datos?.url) {
        this.loadingEvent(false)
        return
      }
      idAdjunto = result.datos.id
    }
    const value: any = {
      ...this.form.value,
      estado: this.value?.estado || 'SEGUIMIENTO',
    }
    if (idAdjunto) value.idAdjunto = idAdjunto
    this.loadingEvent(false)
    this.save.emit(value)
  }

  async fileUpload(event: any) {
    this.image.file = ''
    if (!event.currentFiles[0]) return
    this.image.file = await this.fileService.resizeImage(event.currentFiles[0], 300)
    this.image.name = event.currentFiles[0].name
    this.changeImage = true
  }

  fileSize(byte: number) {
    return this.fileService.fileSize(byte)
  }

  removeFiles(files: Array<any>, index: number) {
    files.splice(index, 1)
    this.image = { file: '', name: '' }
  }

  changeNameFiles(newName: string, op: any) {
    if (!newName) return
    const [_, ext] = this.image.name.split('.')
    this.image.name = `${newName}.${ext}`
    this.changeImage = true
    op.hide()
  }
  addNuevaPalabraClave(event: any) {
    if (!Array.isArray(this.form.value.palabraClave)) return
    const contenido = [...this.form.value.palabraClave]
    contenido.splice(-1, 1)
    const nuevaPalabra = event.value.toUpperCase()
    this.form.patchValue({ palabraClave: [...contenido, nuevaPalabra] })
  }
}
