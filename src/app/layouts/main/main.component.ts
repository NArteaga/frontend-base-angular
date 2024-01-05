import { GlobalService } from './../../common/global.service';
import { SidebarModule } from 'primeng/sidebar';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CookiesService } from '../../common/cookies.service';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../common/theme.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DataViewModule } from 'primeng/dataview';
import { StorageService } from '../../common/storage.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout'
import { Subscription, distinctUntilChanged } from 'rxjs';

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
    RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainLayout implements OnInit, OnDestroy {
  sidebarOpen = false;
  theme = 'sun'
  mediaSubcription!: Subscription
  mediaQuery: string = ''
  queryView = ['xs', 'sm', 'md', 'lg', 'xl']
  constructor(
    private themeService: ThemeService,
    private cookie: CookiesService,
    private storage: StorageService,
    private router: Router,
    private mediaObserver: MediaObserver,
    private global: GlobalService
  ) {
    this.theme = this.cookie.getItem('theme') === 'dark' ? 'moon' : 'sun';
  }

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
        this.mediaQuery = change[0].mqAlias
        this.global.setQuery(change[0].mqAlias)
      })
  }

  toggleSidebar(): void {
    this.sidebarOpen =!this.sidebarOpen;
  }

  changeTheme = () => {
    this.themeService.changeMode()
    const theme = this.cookie.getItem('theme')
    this.theme = theme === 'dark' ? 'moon' : 'sun'
  }

  logout(): void {
    const theme = this.cookie.getItem('theme')
    this.cookie.clear()
    this.storage.local.clear()
    this.storage.session.clear()
    this.cookie.setItem('theme', theme)
    this.router.navigate(['/login'])
  }
}
