import { Injectable } from '@angular/core';
import {Message} from 'primeng/primeng';

@Injectable()
export class MessageService {

  public messages: Message[] = [];

  constructor() { }

  public addMessage(message: Message) {
    this.messages.push(message);

    setTimeout(() => {
      this.messages.splice(this.messages.indexOf(message), 1)
    }, 5000)
  }

  public error(message: string) {
    const data: Message = {
      detail: message,
      severity: 'error'
    }
    this.addMessage(data);
  }

  public info(message: string) {
    const data: Message = {
      detail: message,
      severity: 'info'
    }
    this.addMessage(data);
  }

}
