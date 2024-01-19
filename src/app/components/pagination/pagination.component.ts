import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'pagination-component',
  standalone: true,
  imports: [DropdownModule, PaginatorModule, ReactiveFormsModule, CardModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit {
  @Input() mediaQuery: string = ''

  @Input() total: number = 0;

  @Input() rows?: Array<{ label: number, value: number }> = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 50, value: 50 }
  ];

  row: number = 0
  limit: number = 10

  @Output() changePage: EventEmitter<{ rows: number, page: number }> = new EventEmitter()

  reset(event: any) {
    this.row = 0
    this.limit = event.value
    this.changePage.emit({ rows: event.value, page: 0 })
  }

  page(event: any) {
    this.row = event.first
    this.limit = event.rows || 0
    this.changePage.emit({ rows: event.rows, page: event.page })
  }

  ngOnInit(): void {
    this.reset({ value: this.limit })
  }
}
