import { GlobalService } from './../../common/global.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FilterComponent } from '@components/filter/filter.component'
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'crudtable-component',
  standalone: true,
  imports: [
    ButtonModule,
    FilterComponent,
    PaginationComponent,
    TableModule,
    CardModule,
    DividerModule,
    CommonModule,
  ],
  templateUrl: './crudtable.component.html',
  styleUrl: './crudtable.component.scss'
})
export class CrudtableComponent implements OnInit, OnDestroy {

  @Input() filters: Array<{
    label: string;
    control: string;
    option?: Array<{
      label: string;
      value: string;
    }>;
    style: string;
    type: 'text' | 'chip' | 'select' | 'number';
  }> | undefined;
  @Input() columns: Array<{
    label: string;
    key: string;
    aling: string
  }> = []
  @Input() total: number = 0;
  @Input() rows?: Array<{ label: number, value: number }> = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 50, value: 50 }
  ];
  @Input() items: Array<any> = []
  @Input() content!: TemplateRef<ElementRef>
  @Input() item!: TemplateRef<ElementRef>
  // @Input() action!: TemplateRef<ElementRef>
  @Input() readonly?: boolean = false

  @ViewChild(PaginationComponent) pagination!: PaginationComponent
  @Input() action!: TemplateRef<ElementRef>

  @Output() change: EventEmitter<any> = new EventEmitter()
  @Output() refresh: EventEmitter<any> = new EventEmitter()
  @Output() add: EventEmitter<any> = new EventEmitter()

  informacion: {
    open: { filter: boolean },
    control: { rows: number, page: number },
    mediaQuery: string,
    filter: any,
    loading: boolean
  } = {
    open: { filter: false },
    control: { rows: 10, page: 0 },
    mediaQuery: '',
    filter: {},
    loading: false,
  }

  mediaSubcription!: Subscription

  constructor(
    private mediaObserver: MediaObserver,
    private global: GlobalService
  ) {}

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

  reset() {
    this.pagination.reset({ value: this.informacion.control.rows })
  }

  eventFilter(value: any) {
    this.informacion.filter = value
    this.reset()
  }

  eventRefresh() {
    this.informacion.loading = true
    this.refresh.emit({ control: this.informacion.control, filter: this.informacion.filter })
    this.informacion.loading = false
  }

  addRegister() { this.add.emit() }

  page(event: any) {
    this.informacion.control.page = event.page
    this.informacion.control.rows = event.rows
    this.change.emit({ control: this.informacion.control, filter: this.informacion.filter })
  }

  context(implicit: any, other: any) {
    return {
      '$implicit': implicit,
      ...other
    }
  }
}
