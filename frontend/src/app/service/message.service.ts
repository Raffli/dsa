import { Injectable } from '@angular/core';
import {Message} from 'primeng/primeng';

@Injectable()
export class MessageService {

  private _messages: Message[] = [];

  constructor() { }

  public addMessage(message: Message) {
    this._messages.push(message);
  }

  get messages() {
    return this._messages;
  }

}
