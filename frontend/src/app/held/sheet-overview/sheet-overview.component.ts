import { Component, OnInit, Input } from '@angular/core';
import {Held} from "../../data/held";
import {Attribut} from "../../data/attribut";

@Component({
  selector: 'app-sheet-overview',
  templateUrl: './sheet-overview.component.html',
  styleUrls: ['./sheet-overview.component.css']
})
export class SheetOverviewComponent implements OnInit {

  public filter: string;

  constructor() { }

  @Input()
  held: Held;

  ngOnInit() {
  }


  getMainAttributes() : Attribut[] {
    let ret = this.held.attribute.slice(0,9);
    ret.push(this.held.attribute[13]);
    return ret;
  }

}
