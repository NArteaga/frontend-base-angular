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
  selectSubcription!: Subscription
  socketSubcription: Array<Subscription> = []
  mediaQuery: string = ''
  queryView = ['xs', 'sm', 'md', 'lg', 'xl']
  info = { title: '404', icon: '404' }
  notify: Array<any> = []

  year = new Date().getFullYear()

  constructor(
    private themeService: ThemeService,
    private storage: StorageService,
    private router: Router,
    private mediaObserver: MediaObserver,
    private global: GlobalService,
  ) {
    this.theme = this.storage.local.getItem('theme') === 'dark' ? 'moon' : 'sun';
  }

  ngOnDestroy(): void {
    this.mediaSubcription.unsubscribe()
    this.selectSubcription.unsubscribe()
    for (const subscribe of this.socketSubcription)
      subscribe.unsubscribe()
  }

  ngOnInit(): void {
    const menu = this.storage.local.getItem('menu')
    const elements: Array<any> = []
    for (const item of menu) {
      if (item.tipo === 'GRUPO_MENU')
        elements.push(...item.childrens)
      if (item.tipo === 'MENU')
        elements.push(item)
    }
    const element = elements.find((item: any) => item.ruta === this.router.url)
    this.themeService.getTheme();
    const getAlias = (MediaChange: MediaChange[]) => MediaChange[0].mqAlias
    this.selectSubcription = this.global.select$.subscribe(result => this.info = result)
    this.mediaSubcription = this.mediaObserver
      .asObservable()
      .pipe(
        distinctUntilChanged((x: MediaChange[], y: MediaChange[]) => getAlias(x) === getAlias(y))
      )
      .subscribe((change) => {
        this.mediaQuery = change[0].mqAlias
        this.global.setQuery(change[0].mqAlias)
      })
    if (element)
      this.info = { title: element?.nombre, icon: element?.icon }
    else
      this.info = { title: '404', icon: 'pi pi-spin pi-globe' }
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
