import { Component, OnInit, Input } from '@angular/core';
import {Kampfteilnehmer} from "../../../data/kampf/Kampfteilnehmer";
import {Attacke} from "../../../data/kampf/Attacke";
import {RuestungStats} from "../../../data/ausruestung/RuestungStats";

@Component({
  selector: 'app-create-kampf',
  templateUrl: './create-kampf.component.html',
  styleUrls: ['./create-kampf.component.css']
})
export class CreateKampfComponent implements OnInit {

  @Input()
  public visible: boolean;

  public teilnehmer: Kampfteilnehmer[] = [];

  constructor() { }

  ngOnInit() {
//    teilnehmer.push()
    const attacken = [new Attacke({w6: 1, fix: 3}, 12, 'Schwert') ]
    const rsStats: RuestungStats = {
      rs: 1,
      kopf: 1,
      brust: 1,
      ruecken: 1,
      bauch: 1,
      linkerarm: 1,
      rechterarm: 1,
      linkesbein: 1,
      rechtsbein: 1,
      be: 1,
      ebe: 1
    }

    this.teilnehmer.push(new Kampfteilnehmer(attacken, 12, 14, rsStats, false, 31, 11));
  }

}
