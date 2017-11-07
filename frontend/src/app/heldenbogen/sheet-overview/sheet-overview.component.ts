import {Component, OnInit, Input, ElementRef, OnChanges, ViewChild} from '@angular/core';
import {Held} from "../../data/held";
import {Attribut} from "../../data/attribut";
import {Talente} from "../../data/talente";
import {SprachTalent} from "../../data/sprachtalent";
import {Talent} from "../../data/talent";
import {KampfTalent} from "../../data/kampftalent";
import {TalentBase} from '../../data/TalentBase';
import {Sonderfertigkeiten} from "../../data/Sonderfertigkeiten";
import {Sonderfertigkeit} from "../../data/sonderfertigkeit";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-sheet-overview',
  templateUrl: './sheet-overview.component.html',
  styleUrls: ['./sheet-overview.component.css']
})
export class SheetOverviewComponent implements OnInit{

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
    this.filteredTalente = new Talente(sprachTalente, schriftTalente, talente, kampfTalente, []);

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

  getSpezialisierungen(talent: TalentBase): string {
    if (talent.spezialisierungen.length === 0) {
      return ''
    }
    let ret = '(';
    for (let i = 0; i < talent.spezialisierungen.length; i++) {
      ret += talent.spezialisierungen[i].name
      if (i !== talent.spezialisierungen.length - 1) {
        ret += ' |'
      }
    }
    ret += ')';
    return ret;
  }

  getVorteileNachteile(): string {
    let ret = '';
    for (let i = 0; i < this.held.vorteile.length; i++) {
      const vorteil = this.held.vorteile[i];
      ret += vorteil.name;
      if (vorteil.value) {
        ret += ': ' + vorteil.value;
      }
      if (i !== this.held.vorteile.length - 1) {
        ret += '; '
      }
    }

    return ret;
  }

  getSonderfertigkeiten(): string {
    let ret = '';
    ret = this.appendSonderfertigkeite(this.held.sonderfertigkeiten.magische, ret);
    ret = this.appendSonderfertigkeite(this.held.sonderfertigkeiten.kampf, ret);
    ret = this.appendSonderfertigkeite(this.held.sonderfertigkeiten.profane, ret);

    return ret;
  }

  private appendSonderfertigkeite(sonderfertigkeiten: Sonderfertigkeit[], s: string) {
    if (sonderfertigkeiten.length === 0) {
      return s;
    }

    for (let i = 0; i < sonderfertigkeiten.length; i++) {
      s += sonderfertigkeiten[i].name
      s += '; '

    }

    return s;
  }

  public getAtBasis() {
    return this.held.attribute[Attribut.at].value;
  }

  public getPaBasis() {
    return this.held.attribute[Attribut.pa].value;
  }

  public getFkBasis() {
    return this.held.attribute[Attribut.fk].value;

  }

  public getIniBasis() {
    return this.held.attribute[Attribut.ini].value;

  }

  public test(talent) {
    console.log(talent)
  }
}
