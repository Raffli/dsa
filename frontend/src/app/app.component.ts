import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MenuItem} from "primeng/components/common/menuitem";
import {SessionStoreService} from "./service/session-store.service";
import {Message} from 'primeng/primeng';
import {MessageService} from './service/message.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  items: MenuItem[] = [
    {
      label: 'Home',
      routerLink: 'home'
    },
    {
      label: 'Held',
      routerLink: 'heldenbogen'
    },
    {
      label: 'Held laden',
      routerLink: 'laden'
    },
    {
      routerLink: 'save',
      label: 'Held speichern'
    },
    {
      label: 'Kampf-Tool',
      routerLink: 'tools/kampf'
    }
  ];
  constructor(private sessionStore: SessionStoreService, private messageService: MessageService) {

  }
  getMessages(): Message[] {
    return this.messageService.messages;
  }

  public get messages(): Message[] {
    return this.messageService.messages;
  }

  public set messages(value: Message[]){
    this.messageService.messages = value;
  }

}
