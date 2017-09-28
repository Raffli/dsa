import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Held} from "../../data/held";
import {HeldenService} from "../../service/helden.service";
import {Attribut} from "../../data/attribut";

@Component({
  selector: 'held-detail',
  templateUrl: './held-detail.component.html',
  styleUrls: ['./held-detail.component.css']
})
export class HeldDetailComponent implements OnInit {

  @Input()
  held: Held;

  constructor() { }

  ngOnInit() {
  }

}
