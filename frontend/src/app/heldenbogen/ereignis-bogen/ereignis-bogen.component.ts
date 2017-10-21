import {Component, OnInit, Input} from '@angular/core';
import {Held} from "../../data/held";
import {Ereignis} from "../../data/Ereignis";

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

  public getChange(data: Ereignis) {
    if(data.alterWert && data.neuerWert) {
      return data.alterWert + '->' + data.neuerWert;
    }
    return '';
  }

}
