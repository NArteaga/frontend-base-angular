import { GlobalService } from '@common/global.service';
import { Icon } from '@common/constants/global.const'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'menu-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuModal implements OnInit {
  @Input() value: any = null
  @Input() tipo: any = null
  @Input() grupo: any = null

  form = new FormGroup({
    id: new FormControl(undefined),
    nombre: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    idAgrupador: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    ruta: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    icon: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    orden: new FormControl<number | null>({ value: null, disabled: false }, [Validators.required, Validators.min(1)]),
    tipo: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
  })

  loading: boolean = false
  @Output() cancel: EventEmitter<any> = new EventEmitter()
  @Output() save: EventEmitter<any> = new EventEmitter()

  optionIcon = Icon

  constructor(
    private global: GlobalService,
  ) {}

  ngOnInit(): void {
    this.loading = false
    this.form = new FormGroup({
      id: new FormControl(undefined),
      nombre: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
      idAgrupador: new FormControl<string | null>({ value: null, disabled: false }),
      ruta: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
      icon: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
      orden: new FormControl<number | null>({ value: null, disabled: false }, [Validators.required, Validators.min(1)]),
      tipo: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    })

    if (this.value)
      this.form.patchValue(this.value)
  }

  eventSave() {
    if (!this.form.valid) return;
    const value = { ...this.form.value }
    this.global.loading(this.form, true)
    this.save.emit(value)
    this.global.loading(this.form, false)
  }

  eventCancel() {
    this.cancel.emit()
  }
}

