import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '@common/storage.service';
import { ContentModal } from '@modals/general/content/content.component';
import { ModalComponent } from '@modals/general/modal/modal.component';
import { FaripService } from '@services/general/farip.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-farip',
  standalone: true,
  imports: [
    ContentModal,
    DialogModule,
    ModalComponent,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './farip.component.html',
  styleUrl: './farip.component.scss'
})
export class FaripPage implements OnInit {
  @ViewChild(ContentModal) contentModal!: ContentModal
  documents: Array<any> = []
  permisos: Array<string> = []
  open = { modify: false }
  document: any = null

  constructor (
    private faripService: FaripService,
    private messageService: MessageService,
    private storage: StorageService,
    private router: Router,
    private confirmationService: ConfirmationService,
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
    const { result, error, type } = await this.faripService.findAll()
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

  async save(farip: any) {
    const { result, error, type } = await this.faripService.save(farip)
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

  edit(institucion: any) {
    this.document = institucion
    this.open.modify = true
  }

  add() {
    this.document = null
    this.open.modify = true
  }

  async delete(institucion: any) {
    this.confirmationService.confirm({
      header: '¿Esta seguro de eliminar el documento?',
      message: `El documento "${institucion.nombre}" se eliminara, por favor confirme para proceder`,
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        await this.faripService.deleteById(institucion.id)
        await this.refresh()
      },
    })
  }
}
