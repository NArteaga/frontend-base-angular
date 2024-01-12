import { GlobalService } from '@common/global.service';
import { SidebarModule } from 'primeng/sidebar';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from '@common/theme.service';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DataViewModule } from 'primeng/dataview';
import { StorageService } from '@common/storage.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout'
import { Subscription, distinctUntilChanged } from 'rxjs';
import { FieldsetModule } from 'primeng/fieldset';
import { SocketService } from '@common/socket.service';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'layout-main',
  standalone: true,
  imports: [
    SidebarComponent,
    ButtonModule,
    CardModule,
    SidebarModule,
    TooltipModule,
    DataViewModule,
    ToolbarModule,
    OverlayPanelModule,
    FieldsetModule,
    RouterOutlet,
    DividerModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainLayout implements OnInit, OnDestroy {
  sidebarOpen = false;
  theme = 'sun'
  mediaSubcription!: Subscription
  socketSubcription: Array<Subscription> = []
  mediaQuery: string = ''
  queryView = ['xs', 'sm', 'md', 'lg', 'xl']
  info = { title: '', icon: '' }
  notify: Array<any> = []

  year = new Date().getFullYear()

  constructor(
    private themeService: ThemeService,
    private storage: StorageService,
    private router: Router,
    private mediaObserver: MediaObserver,
    private global: GlobalService,
    private socket: SocketService,
    private messageService: MessageService
  ) {
    const menu = this.storage.local.getItem('menu')
    const elements: Array<any> = []
    for (const item of menu)
      elements.push(...item.childrens)
    const element = elements.find((item: any) => item.ruta === router.url)
    this.info = { title: element?.nombre, icon: element?.icon }
    this.theme = this.storage.local.getItem('theme') === 'dark' ? 'moon' : 'sun';
  }

  ngOnDestroy(): void {
    this.mediaSubcription.unsubscribe()
    for (const subscribe of this.socketSubcription)
      subscribe.unsubscribe()
  }

  ngOnInit(): void {
    this.themeService.getTheme();
    const getAlias = (MediaChange: MediaChange[]) => MediaChange[0].mqAlias
    this.mediaSubcription = this.mediaObserver
      .asObservable()
      .pipe(
        distinctUntilChanged((x: MediaChange[], y: MediaChange[]) => getAlias(x) === getAlias(y))
      )
      .subscribe((change) => {
        this.mediaQuery = change[0].mqAlias
        this.global.setQuery(change[0].mqAlias)
      })
    this.socketSubcription.push(
      this.socket
        .getLoginCorrecto()
        .subscribe((informacion: any) => {
          this.messageService.add({
            severity:'success',
            summary: 'Autentificación correcto',
            detail: informacion.message
          })
        })
    )
    this.socketSubcription.push(
      this.socket
        .getChannel('notify')
        .subscribe((data: any) => {
          this.notify = [{
            title: data.content.nombre,
            type: data.content.type,
            description: data.content.descripcion
          }, ...this.notify]
          this.messageService.add({
            severity:'info',
            summary: 'Notificacion',
            detail: data.message
          })
        })
    )
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  changeTheme = () => {
    this.themeService.changeMode()
    const theme = this.storage.local.getItem('theme')
    this.theme = theme === 'dark' ? 'moon' : 'sun'
  }

  changeContent = (node: any) => {
    this.info = { title: node.label, icon: node.icon }
  }

  logout(): void {
    this.global.logout()
    this.router.navigate(['/login'])
  }
}
