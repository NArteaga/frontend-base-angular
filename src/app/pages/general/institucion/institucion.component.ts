import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '@common/storage.service';
import { ContentModal } from '@modals/general/content/content.component';
import { ModalComponent } from '@modals/general/modal/modal.component';
import { InstitucionService } from '@services/general/institucion.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { GlobalService } from '@common/global.service';

@Component({
  selector: 'app-institucion',
  standalone: true,
  imports: [
    ContentModal,
    DialogModule,
    ModalComponent,
    ButtonModule
  ],
  templateUrl: './institucion.component.html',
  styleUrl: './institucion.component.scss'
})
export class InstitucionPage implements OnInit {
  @ViewChild(ContentModal) contentModal?: ContentModal
  documents: Array<any> = []
  permisos: Array<string> = []
  open = { modify: false}
  mediaQuery: string = ''

  constructor (
    private institucionService: InstitucionService,
    private messageService: MessageService,
    private storage: StorageService,
    private router: Router,
    private global: GlobalService,
  ) {
    const permiso = this.storage.local.getItem('permisos')
    this.permisos = permiso[this.router.url].accion
    this.global.query$.subscribe(result => this.mediaQuery = result)
  }

  async ngOnInit() {
    await this.refresh()
  }

  download(item: any) {
    const link = document.createElement('a')
    link.download = item.documento.nombre
    link.href = item.documento.path
    link.target = "_blank";
    link.click()
  }

  close() {
    this.open.modify = false
  }

  async refresh() {
    const { result, error, type } = await this.institucionService.findAll()
    const response = result || error
    if (type === 'error') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response.mensaje,
        sticky: false,
      })
      this.documents = []
      return
    }
    this.documents = response.datos.rows
    if (this.contentModal)
      this.contentModal.index = 0
  }

  async save(institucion: any) {
    const { result, error, type } = await this.institucionService.save(institucion)
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
    this.open.modify = false
    await this.refresh()
  }
}
