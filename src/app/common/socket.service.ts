import { Injectable, inject } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';
// import { io } from 'socket.io-client';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  identifierUse = new Set<string>()
  /* private socket = io(environment.baseUrl.socket, {
    withCredentials: true
  }) */
  private storage = inject(StorageService)
  constructor() { }

  /*getLoginCorrecto() {
    const usuario = this.storage.local.getItem('username');
    return new Observable<{ message: string, content: any }>
      ((observer) => {
        this.socket.on(`auth-${usuario}`, (data) => {
          if (this.identifierUse.has(data.id)) return
          this.identifierUse.add(data.id)
          observer.next({ message: data.message, content: data.content })
        });
        return () => { this.socket.disconnect() }
      })
  }

  getChannel(channel: string) {
    return new Observable<{ message: string, content: any }>
      ((observer) => {
        this.socket.on(channel, (data) => {
          if (this.identifierUse.has(data.id)) return
          this.identifierUse.add(data.id)
          observer.next({ content: data.content, message: data.message })
        });
        return () => { this.socket.disconnect() }
      })
  }

  setEmitter(channel: string, content: any) {
    this.socket.emit(channel, content)
  } */
}
