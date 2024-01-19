import { MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '@services/admin/usuario.service';
import { InputGroupModule } from 'primeng/inputgroup'
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'usuario-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputGroupModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioModal implements OnInit {
  form = new FormGroup({
    id: new FormControl(undefined),
    nombres: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
    primerApellido: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
    segundoApellido: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
    usuario: new FormControl<string>({ value: '', disabled: false }, [Validators.required]),
    correo: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
    codigoLdap: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
    idUnidad: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    idRol: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
  })

  loading: boolean = false
  title: string = 'Crear'
  usuario: any = {}
  action: boolean = false

  @Input() value: any = null
  @Input() roles?: Array<any> = []
  @Input() unidades?: Array<any> = []
  @Output() cancel: EventEmitter<any> = new EventEmitter()
  @Output() save: EventEmitter<any> = new EventEmitter()

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loading = false
    this.form = new FormGroup({
      id: new FormControl(undefined),
      nombres: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
      primerApellido: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
      segundoApellido: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
      usuario: new FormControl<string>({ value: '', disabled: false }, [Validators.required]),
      correo: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
      codigoLdap: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
      idUnidad: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
      idRol: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    })

    if (this.value) {
      this.action = true;
      this.usuario = this.value
      this.title = 'Editar'
      this.form.get('usuario')?.disable()
      this.form.patchValue(this.value)
    }
  }

  async searchUsuario() {
    if (!this.form?.value?.usuario) return;
    const { result, type } = await this.usuarioService.infoUsuario(this.form?.value?.usuario)
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontro pudo encontrar el usuario requerido',
        sticky: false,
      })
    }
    this.action = true
    this.usuario = {
      codigoLdap: result.datos.codigo,
      correo: result.datos.correoInstitucional,
      nombres: result.datos.nombres,
      primerApellido: result.datos.primerApellido,
      segundoApellido: result.datos.segundoApellido,
    }
    this.form.patchValue({
      codigoLdap: result.datos.codigo,
      correo: result.datos.correoInstitucional,
      nombres: result.datos.nombres,
      primerApellido: result.datos.primerApellido,
      segundoApellido: result.datos.segundoApellido,
    })
  }

  disabled(key: string) {
    if (this.loading)
      this.form.get(key)?.disable()
    else
      this.form.get(key)?.enable()
  }

  changeLoading() {
    this.loading =!this.loading
    if (!this.value)
      this.disabled('usuario')
    this.disabled('idUnidad')
    this.disabled('idRol')
  }

  eventSave() {
    if (!this.form.valid) return;
    if (!this.action) return;
    const value = { ...this.usuario, ...this.form.value }
    this.changeLoading()
    this.save.emit(value)
    this.changeLoading()
  }

  eventCancel() {
    this.cancel.emit()
  }
}
