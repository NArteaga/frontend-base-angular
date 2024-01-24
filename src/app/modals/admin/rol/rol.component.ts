import { MenuService } from '@services/admin/menu.service';
import { RolService } from './../../../services/admin/rol.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AccordionModule  } from 'primeng/accordion'
import { GlobalService } from '@common/global.service';
import { InplaceModule } from 'primeng/inplace';
import { BadgeModule } from 'primeng/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import { optionsMenus, optionsApis } from '@common/constants/global.const'
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'rol-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    AccordionModule,
    InplaceModule,
    BadgeModule,
    MultiSelectModule,
    ButtonModule,
    InputSwitchModule,
  ],
  templateUrl: './rol.component.html',
  styleUrl: './rol.component.scss'
})
export class RolModal {
  @Input() value: any = null

  form = new FormGroup({
    id: new FormControl(undefined),
    nombre: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    descripcion: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
    apis: new FormControl<any>({}),
    menus: new FormControl<any>({}),
    views: new FormControl<any>({}),
  })

  options = {
    menus: optionsMenus,
    apis: optionsApis
  }

  loading: boolean = false

  list: any = {
    menus: [],
    views: [],
    apis: [],
  }

  @Output() cancel: EventEmitter<any> = new EventEmitter()
  @Output() save: EventEmitter<any> = new EventEmitter()

  constructor(
    private global: GlobalService,
    private menuService: MenuService,
  ) {}

  async ngOnInit() {
    this.loading = false
    this.form = new FormGroup({
      id: new FormControl(undefined),
      nombre: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
      descripcion: new FormControl<string | null>({ value: null, disabled: false }, [Validators.required]),
      apis: new FormControl<Array<{ id: string, rolMenu: { accion: Array<string> } }>>([]),
      menus: new FormControl<Array<{ id: string, rolMenu: { accion: Array<string> } }>>([]),
      views: new FormControl<Array<{ id: string, rolMenu: { accion: Array<string> } }>>([]),
    })
    if (this.value) this.form.patchValue(this.value)
    await this.loadAllMenus()
  }

  async loadAllMenus() {
    const { API, MENU, VISTA } = this.key()
    this.form.patchValue({ apis: API, menus: MENU, views: VISTA })
    this.list.apis = await this.loadMenus('API', API)
    this.list.menus = await this.loadMenus('MENU', MENU)
    this.list.views = await this.loadMenus('VISTA', VISTA)
  }

  key() {
    const smenu: any = { API: {}, MENU: {}, VISTA: {} }
    if (!this.value?.menus) return smenu;
    for (const menu of this.value.menus) {
      smenu[menu.tipo][menu.id] = menu
    }
    return smenu
  }

  async loadMenus(tipo: 'MENU' | 'API' | 'VISTA', key: any) {
    let { result: { datos: menu } } = await this.menuService.findGroup(tipo)
    menu = menu.map((menu: any) => key[menu.id] || menu)
    return menu
  }

  lists(select: any, inplace: any, index: number, tipo: 'apis' | 'menus' | 'views') {
    const rolMenu: any = { accion: select.value }
    this.list[tipo][index].rolMenu = rolMenu
    inplace.deactivate()
  }

  eventSave() {
    if (!this.form.valid) return;
    const value: any = { ...this.form.value, menus: {}, apis: {}, views: {} }
    for (const menu of this.list.menus)
      if (menu?.rolMenu?.accion?.length > 0)
        value.menus[menu.id] = { accion: menu.rolMenu.accion }
    for (const menu of this.list.apis)
      if (menu?.rolMenu?.accion?.length > 0)
        value.apis[menu.id] = { accion: menu.rolMenu.accion }
    for (const menu of this.list.views)
      if (menu?.rolMenu?.accion?.length > 0)
        value.views[menu.id] = { accion: menu.rolMenu.accion }
    this.global.loading(this.form, true)
    this.save.emit(value)
    this.global.loading(this.form, false)
  }

  eventCancel() {
    this.cancel.emit()
  }
}
