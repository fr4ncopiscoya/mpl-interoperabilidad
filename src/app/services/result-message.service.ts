import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ResultMessageService {
  private _message = signal<string>('');
  private _style = signal<string>('info');

  setResult(message: string, style: string = 'info') {
    this._message.set(message);
    this._style.set(style);
  }

  clear() {
    this._message.set('');
  }

  message = this._message.asReadonly();
  style = this._style.asReadonly();
}