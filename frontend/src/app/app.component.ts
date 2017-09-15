import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MenuItem} from "primeng/components/common/menuitem";
import {SessionStoreService} from "./service/session-store.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private sessionStore: SessionStoreService) {

  }

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
      label: 'Kampf-Tool',
      routerLink:'tools/kampf'
    }
  ];

}
