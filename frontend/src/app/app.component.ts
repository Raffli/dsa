import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MenuItem} from "primeng/components/common/menuitem";
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
      label: 'Kampf-Tool',
      routerLink:'tools/kampf'
    }
  ];

}
