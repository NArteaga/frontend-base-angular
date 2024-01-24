import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { FileService } from '@common/file.service'
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    FileUploadModule,
    ReactiveFormsModule,
    TagModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  document: { file: string; name: string,  } = { file: '', name: '' };
  files: any[] = [];
  change: boolean = false;

  @Input() value?: any;
  @Input() type: string = ''
  @Output() cancel: EventEmitter<any> = new EventEmitter()
  @Output() save: EventEmitter<any> = new EventEmitter()

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    nombre: new FormControl<string | undefined>({ value: undefined, disabled: false }, Validators.required),
  })

  constructor(
    private fileService: FileService,
  ) {}

  async ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl<string | null>(null),
      nombre: new FormControl<string | undefined>({ value: undefined, disabled: false }, Validators.required),
    })
    if (this.value) {
      this.form.patchValue({ ...this.value })
      const file = await this.fileService.urlToFile(this.value.documento.path, this.value.documento.nombre)
      this.files = [file]
    }
  }

  async upload(event: any) {
    this.document.file = ''
    this.document.file = await this.fileService.getFile(event.currentFiles[0])
    this.document.name = event.currentFiles[0].name
    this.change = true
  }

  fileSize(byte: number) {
    return this.fileService.fileSize(byte)
  }

  remove(files: Array<any>, index: number) {
    files.splice(index, 1)
    this.document = { file: '', name: '' }
  }

  async submit() {
    if (!this.form.valid) return;
    if (!this.document) return;
    const value: any = { ...this.form.value }
    if (!this.change && !this.form.value.id) return
    if (this.change) {
      let idDocument = ''
      const { error, result } = await this.fileService.sendFile(`/general/${this.type}/file`, this.document)
      if (error) return
      if (!result?.datos?.id) return
      idDocument = result.datos.id
      if (idDocument) value.idDocument = idDocument
    }
    this.save.emit(value)
  }

  exit(): void {
    this.cancel.emit()
  }
}
