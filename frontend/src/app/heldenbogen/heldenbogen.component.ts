import { Component, OnInit } from '@angular/core';
import {HeldenService} from "../service/helden.service";
import {Held} from "../data/held";

@Component({
  selector: 'app-heldenbogen',
  templateUrl: './heldenbogen.component.html',
  styleUrls: ['./heldenbogen.component.css'],
  providers: [HeldenService]
})
export class HeldenbogenComponent implements OnInit {

  constructor(private heldenService:HeldenService) { }

  ngOnInit() {
  }

  heldChanged(held: Held) {
    this.heldenService.setHeld(held);
  }


}
