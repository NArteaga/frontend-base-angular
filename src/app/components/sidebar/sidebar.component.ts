import { Component, AfterContentInit } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { StorageService } from '../../common/storage.service'
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { CookiesService } from '../../common/cookies.service';

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
  constructor(
    private storage: StorageService,
    private cookie: CookiesService,
    private router: Router,
  ) {
    this.init()
  }

  init(): void {
    try {
      const menu = this.storage.local.getItem('menu')
      this.usuario = this.cookie.getItem('usuario')
      this.title = [this?.usuario?.nombres, this?.usuario?.primerApellido, this?.usuario?.segundoApellido].join(' ')
      this.subTitle = this.usuario.rol.nombre.toUpperCase()
      this.menus = menu?.map((item: { nombre: string, icon: string, childrens: Array<any>, tipo: string }, index: number) => ({
        key: `${item.tipo}-${index}`,
        tipo: item.tipo,
        label: item.nombre,
        icon: item.icon,
        expanded: true,
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

  nodeSelect(event: any): void {
    if (event.node.tipo === 'GRUPO_MENU') {
      event.node.expanded = !event.node.expanded
      return;
    }
    this.storage.session.setItem('select', { title: event.node.label, icon: event.node.icon })
    this.router.navigate([event.node.path])
  }
}
