import {Component, Input, OnInit} from '@angular/core';
import {Held} from "../../../data/held";
import {Attribut} from "../../../data/attribut";
import {AusruestungsSet} from "../../../data/ausruestung/AusruestungsSet";
import {Waffe} from "../../../data/ausruestung/Waffe";
import {TpKK} from "../../../data/ausruestung/tpkk";

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

  public getPrimaryAusruestungsSet(): AusruestungsSet {
    return this.held.ausruestung.sets[0];
  }

  public getBonusDmgWaffenlos() {
    return Math.floor((this.held.attribute[7].value-10)/3)
  }

  public totalRuestung() {
    let ret = 0;
    this.getPrimaryAusruestungsSet().ruestungen.forEach(ruestung => {
      ret += ruestung.rs;
    })
    return ret;
  }

  public totalBe() {
    let ret = 0;
    //TODO: RGW 2 / 3
    this.getPrimaryAusruestungsSet().ruestungen.forEach(ruestung => {
      ret += ruestung.eBe;
    })
    return ret;
  }
}
