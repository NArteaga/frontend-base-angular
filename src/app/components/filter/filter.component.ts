import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ChipsModule } from 'primeng/chips';
import { Filters } from '../../models/crud'
@Component({
  selector: 'filter-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    DropdownModule,
    ChipsModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {

  @Input() filters: Array<Filters> | undefined;

  @Output() filter: EventEmitter<any> = new EventEmitter()

  form: FormGroup = new FormGroup<any>({});

  ngOnInit(): void {
    if (!this.filters) return
    const form: any = {}
    for (const { control } of this.filters)
      form[control] = new FormControl()
    this.form = new FormGroup (form)
  }

  eventFilter(): void {
    const filter: any = {}
    for (const key in this.form.value)
      if (this.form.value[key])
        filter[key] = this.form.value[key]
    this.filter.emit(filter)
  }

  addNuevaPalabraClave(event: any) {
    if (!Array.isArray(this.form.value.palabraClave)) return
    const contenido = [...this.form.value.palabraClave]
    contenido.splice(-1, 1)
    const nuevaPalabra = event.value.toUpperCase()
    this.form.patchValue({ palabraClave: [...contenido, nuevaPalabra] })
  }
}
