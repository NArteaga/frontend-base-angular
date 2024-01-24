import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalService } from '@common/global.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'content-modal',
  standalone: true,
  imports: [
    NgxDocViewerModule,
    ReactiveFormsModule,
    CarouselModule,
    DividerModule,
    TagModule,
    ButtonModule,
    TagModule,
    GalleriaModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentModal {
  mediaQuery: string = '';
  index: number = 0;
  visor: {
    icon: 'pi pi-image' | 'pi pi-folder-open',
    active: boolean
  } = {
    icon: 'pi pi-image',
    active: true
  }

  @Input() permisos: Array<string> = [];
  @Input() documents: Array<any> = [];
  @Output() download: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();

  constructor(
    private global: GlobalService,
  ) { this.global.query$.subscribe(result => this.mediaQuery = result) }

  isType(document: any, type: string){
    if (document.documento.tipo === 'pdf') return type === 'pdf'
    if (document.documento.mime.startsWith('image/')) return type === 'image'
    return !['pdf', 'image'].includes(type)
  }

  detectIcon(document: any) {
    if (document.documento.tipo === 'pdf') return 'pi pi-file-pdf'
    if (document.documento.mime.startsWith('image/')) return 'pi pi-image'
    return 'pi pi-file'
  }

  downloadDocument(document: any) {
    this.download.emit(document)
  }

  reset() {
    this.index = 0
    this.refresh.emit()
  }

  change(event: any) {
    this.index = event;
  }

  changeVisor() {
    if (this.visor.active) {
      this.visor.icon = 'pi pi-folder-open'
      this.visor.active = false
    } else {
      this.visor.icon = 'pi pi-image'
      this.visor.active = true
    }
  }

  create() {
    this.add.emit()
  }
}
