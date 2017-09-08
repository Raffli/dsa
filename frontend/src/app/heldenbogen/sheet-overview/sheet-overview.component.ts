import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {Held} from "../../data/held";
import {Attribut} from "../../data/attribut";
import {Talente} from "../../data/talente";
import {SprachTalent} from "../../data/sprachtalent";
import {Talent} from "../../data/talent";
import {KampfTalent} from "../../data/kampftalent";

@Component({
  selector: 'app-sheet-overview',
  templateUrl: './sheet-overview.component.html',
  styleUrls: ['./sheet-overview.component.css']
})
export class SheetOverviewComponent implements OnInit {

  public filter: string;

  public filteredTalente: Talente;


  @Input()
  held: Held;

  constructor() { }


  ngOnInit() {
    this.filteredTalente = this.held.talente;
  }


  public getMainAttributes(): Attribut[] {
    const ret = this.held.attribute.slice(0,9);
    ret.push(this.held.attribute[13]);
    return ret;
  }

  public filterChanged() {
    const sprachTalente: SprachTalent[] = [];
    const schriftTalente: SprachTalent[] = [];
    const talente: Talent[] = [];
    const kampfTalente: KampfTalent[] = [];
    this.filteredTalente = new Talente(sprachTalente, schriftTalente, talente, kampfTalente);

    this.held.talente.talente.forEach(talent => {
      if (talent.name.toLowerCase().indexOf(this.filter.toLowerCase() ) !== -1) {
        talente.push(talent);
      }
    })

    this.held.talente.sprachen.forEach(sprache => {
      if (sprache.name.toLowerCase().indexOf(this.filter.toLowerCase() ) !== -1) {
        sprachTalente.push(sprache);
      }
    })

    this.held.talente.schriften.forEach(schrift => {
      if (schrift.name.toLowerCase().indexOf(this.filter.toLowerCase() ) !== -1) {
        schriftTalente.push(schrift);
      }
    })

    this.held.talente.kampftalente.forEach(talent => {
      if(talent.name.toLowerCase().indexOf(this.filter.toLowerCase()) !== -1) {
        kampfTalente.push(talent);
      }
    })
  }

  onEnter() {


  }

}
