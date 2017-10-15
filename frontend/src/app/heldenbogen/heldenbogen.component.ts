import { Component, OnInit } from '@angular/core';
import {HeldenService} from "../service/helden.service";
import {Held} from "../data/held";
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-heldenbogen',
  templateUrl: './heldenbogen.component.html',
  styleUrls: ['./heldenbogen.component.css'],
  providers: []
})
export class HeldenbogenComponent implements OnInit {

  constructor(public heldenService: HeldenService) { }

  get held() {
    return this.heldenService.getHeld();
  }
  ngOnInit() {
  }

  isProd() {
    return environment.production;
  }


}
