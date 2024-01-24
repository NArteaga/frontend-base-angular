import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '@common/storage.service';
import { ContentModal } from '@modals/general/content/content.component';
import { ModalComponent } from '@modals/general/modal/modal.component';
import { AdministracionService } from '@services/general/administracion.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [
    ContentModal,
    DialogModule,
    ModalComponent,
    ButtonModule
  ],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionPage implements OnInit {
  @ViewChild(ContentModal) contentModal!: ContentModal
  documents: Array<any> = []
  permisos: Array<string> = []
  open = { modify: false}
  constructor (
    private administracionService: AdministracionService,
    private messageService: MessageService,
    private storage: StorageService,
    private router: Router,
  ) {
    const permiso = this.storage.local.getItem('permisos')
    this.permisos = permiso[this.router.url].accion
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
    const { result, error, type } = await this.administracionService.findAll()
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

  async save(administracion: any) {
    const { result, error, type } = await this.administracionService.save(administracion)
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
