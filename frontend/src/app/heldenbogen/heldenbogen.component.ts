import { Component, OnInit } from '@angular/core';
import {HeldenService} from "../service/helden.service";
import {Held} from "../data/held";

@Component({
  selector: 'app-heldenbogen',
  templateUrl: './heldenbogen.component.html',
  styleUrls: ['./heldenbogen.component.css'],
  providers: []
})
export class HeldenbogenComponent implements OnInit {

  constructor(public heldenService:HeldenService) { }

  ngOnInit() {
  }


}
