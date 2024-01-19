import { Component, EventEmitter, Output } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { StorageService } from '@common/storage.service'
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { GlobalService } from '@common/global.service';

@Component({
  selector: 'sidebar-component',
  standalone: true,
  imports: [TreeModule, DividerModule, AvatarModule, ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent  {
  menus = new Array<any>()
  usuario: any = {}
  selectedNode!: any
  title = ''
  subTitle = ''
  @Output() selectNode: EventEmitter<any> = new EventEmitter()
  constructor(
    private storage: StorageService,
    private router: Router,
  ) { this.init() }

  init(): void {
    try {
      const menu = this.storage.local.getItem('menu')
      this.usuario = this.storage.local.getItem('usuario')
      this.title = this.nombreCompleto(this.usuario)
      this.subTitle = this.usuario.rol.nombre.toUpperCase()
      this.menus = menu?.map((item: { nombre: string, icon: string, childrens: Array<any>, tipo: string, ruta?: string }, index: number) => ({
        key: `${item.tipo}-${index}`,
        tipo: item.tipo,
        label: item.nombre,
        icon: item.icon,
        expanded: true,
        path: item.ruta,
        children: item.childrens?.map((child: any, subIndex: number) => ({
          key: `${child.tipo}-${index}-${subIndex}`,
          tipo: child.tipo,
          path: child.ruta,
          label: child.nombre,
          icon: child.icon
        }))
      }))
    } catch (error) {}
  }

  nombreCompleto(usuario: any) {
    const nombreCompleto = new Array<string>();
    if (usuario?.nombres) nombreCompleto.push(usuario?.nombres)
    if (usuario?.primerApellido) nombreCompleto.push(usuario?.primerApellido)
    if (usuario?.segundoApellido) nombreCompleto.push(usuario?.segundoApellido)
    return nombreCompleto.join(' ')
  }

  nodeSelect(event: any): void {
    if (event.node.tipo === 'GRUPO_MENU') {
      event.node.expanded = !event.node.expanded
      return;
    }
    this.router.navigate([event.node.path])
    this.selectNode.emit(event.node)
  }
}
