import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  photo = 'http://bilder.bild.de/fotos/bild-de-15401182/Bild/20.bild.png';
  links = [
    {
      name:'Home',
      href:''
    },
    {
      name:'Heldenbogen',
      href:'heldenbogen'
    }
  ]
}
