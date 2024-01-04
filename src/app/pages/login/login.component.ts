import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { LoginService } from '../../service/login/login.service';
import { ToastModule } from 'primeng/toast';
import { StorageService } from '../../common/storage.service';
import { CookiesService } from '../../common/cookies.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginPages implements OnInit {
  passwordSelect = true;
  passwordIcon = ''
  passwordType = 'password';

  loading = false;
  loadingIcon = '';
  loadingText = 'Iniciar Sesión';

  form = new FormGroup({
    usuario: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private loginService: LoginService,
    private messageService: MessageService,
    private storage: StorageService,
    private cookie: CookiesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const token = this.cookie.getItem('token');
    console.log(token);
    if (token) this.router.navigate(['/app']);
  }

  change = () => {
    this.passwordSelect = !this.passwordSelect;
    this.passwordIcon = this.passwordSelect? '' : '-slash';
    this.passwordType = this.passwordSelect? 'password' : 'text';
  }

  auth = async () => {
    this.loading = true;
    this.loadingIcon = 'pi pi-spin pi-spinner';
    this.loadingText = '';
    if (!this.form.valid) {
      this.loading = false;
      this.loadingIcon = '';
      this.loadingText = 'Iniciar Sesión';
      return;
    }
    const token = await this.recaptchaV3Service.execute('auth').pipe().toPromise()
    if (!token) {
      this.loading = false;
      this.loadingIcon = '';
      this.loadingText = 'Iniciar Sesión';
      return;
    }
    const { error, result, type } = await this.loginService.login(this.form.value, token)
    const response = result || error
    if (type === 'error')
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: response.mensaje,
        sticky: false,
      })

    this.loading = false;
    this.loadingIcon = '';
    this.loadingText = 'Iniciar Sesión';
    this.loadResponse(response)
    this.router.navigate(['/app'])
  }

  loadResponse = (result: any) => {
    this.storage.local.setItem('menu', result?.datos?.menus)
    const permision: any = {}
    result?.datos?.permisos.menus.map(((item: { ruta: string, rolMenu: Array<string>}) => {
      permision[item.ruta] = item.rolMenu
    }))
    this.storage.local.setItem('permisos', permision)
    this.cookie.setItem('usuario', result.datos.usuario)
  }
}
