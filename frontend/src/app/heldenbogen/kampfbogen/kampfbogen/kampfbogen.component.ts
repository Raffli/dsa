import {Component, Input, OnInit} from '@angular/core';
import {Held} from "../../../data/held";
import {Attribut} from "../../../data/attribut";

@Component({
  selector: 'app-kampfbogen',
  templateUrl: './kampfbogen.component.html',
  styleUrls: ['./kampfbogen.component.css']
})
export class KampfbogenComponent implements OnInit {

  @Input()
  public held: Held

  constructor() { }

  ngOnInit() {
  }

  public getCombatAttributes() : any[] {
    const ret = this.held.attribute.slice(15, 18) as any[];
    ret.push(this.held.attribute[14])
    ret.push({value: 12, shortcut: 'GS'})
    ret.push({value: 12, shortcut: 'BE'})

    return ret;
  }

}
