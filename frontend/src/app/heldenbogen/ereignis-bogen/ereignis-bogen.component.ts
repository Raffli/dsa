import {Component, OnInit, Input} from '@angular/core';
import {Held} from "../../data/held";

@Component({
  selector: 'app-ereignis-bogen',
  templateUrl: './ereignis-bogen.component.html',
  styleUrls: ['./ereignis-bogen.component.css']
})
export class EreignisBogenComponent implements OnInit {

  constructor() { }

  @Input()
  public held: Held

  ngOnInit() {
  }

}
