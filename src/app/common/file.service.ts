import { HttpService } from './http.service';
import { Injectable, inject } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  _http = inject(HttpService)
  constructor() { }

  getFile(event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result);
      };
      reader.readAsDataURL(event);
    });
  }

  async getImage(event: any): Promise<any> {
    const image = await this.getFile(event);
    const img = new Image()
    return new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(img)
      }
      img.src = image
    })
  }

  async sendFiles(url: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file)
    })
    return await this._http.execute({
      method: 'POST',
      url: `${url}`,
      data: formData
    })
  }

  async sendFile(url: string, { file, name }: { file: string, name: string }) {
    const upload = this.base64ToFile(file, name)
    const formData = new FormData();
    formData.append('file', upload);
    return await this._http.execute({
      method: 'POST',
      url: `${url}`,
      data: formData
    })
  }

  base64ToFile(base64: string, name = 'file') {
    const arr = base64.split(',')
    const [, mime] = arr[0].match(/:(.*?);/) || []
    const binaryString = atob(arr[1])
    let n = binaryString.length
    const u8arr = new Uint8Array(n)
    while (n--)
      u8arr[n] = binaryString.charCodeAt(n)
    return new File([u8arr], name, { type: mime })
  }

  async urlToFile(url: string, nombre: string): Promise<any> {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    return new File([blob], nombre, { type: blob.type })
  }

  fileSize(byte: number) {
    if (byte < 1024) return `${byte} Bytes`
    byte = byte / 1024
    if (byte < 1024) return `${(byte).toFixed(2)} KB`
    byte = byte / 1024
    if (byte < 1024) return `${(byte).toFixed(2)} MB`
    byte = byte / 1024
    return `${(byte).toFixed(2)} GB`
  }

  async resizeImage(event: any, width: number) {
    const image = await this.getImage(event)
    if (image.width <= width) return image.src
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width
    const diferencial = canvas.width / image.width
    canvas.height = image.height * diferencial
    ctx?.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL(event.type, 1)
  }
}
