import { Component, OnInit } from '@angular/core';
import { GlobalService } from '@common/global.service';
import { StorageService } from '@common/storage.service';
import { CarouselModule } from 'primeng/carousel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomePage implements OnInit {
  nombre = 'Nicolas Bryan Arteaga Gutierrez'
  menus: Array<any> = []
  responsive = [
    {
      breakpoint: '2400px',
      numVisible: 5,
      numScroll: 5
    },
    {
      breakpoint: '1800px',
      numVisible: 4,
      numScroll: 4
    },
    {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '1000px',
        numVisible: 2,
        numScroll: 2
    }
  ];
  mediaQuery: string = '';

  constructor (
    private storage: StorageService,
    private global: GlobalService,
    private router: Router,
  ) {
    this.global.query$.subscribe(result => this.mediaQuery = result)
  }

  ngOnInit(): void {
    const usuario = this.storage.local.getItem('usuario')
    this.menus = this.storage.local.getItem('menu').filter((menu: any) => menu.tipo === 'GRUPO_MENU')
    this.nombre = this.fullname(usuario)
  }

  fullname(row: any) {
    const fullname: Array<string> = []
    if (row.nombres) fullname.push(row.nombres.trim())
    if (row.primerApellido) fullname.push(row.primerApellido.trim())
    if (row.segundoApellido) fullname.push(row.segundoApellido.trim())
    return fullname.join(' ')
  }

  redirect(menu: any) {
    this.global.changeSelect({ icon: menu.icon, title: menu.nombre })
    this.router.navigate([menu.ruta])
  }
}
