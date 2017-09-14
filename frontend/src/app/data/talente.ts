import {SprachTalent} from "./sprachtalent";
import {Talent} from "./talent";
import {KampfTalent} from "./kampftalent";
import {AusruestungsSet} from "./ausruestung/AusruestungsSet";
/**
 * Created by pahil on 29.08.2017.
 */
export class Talente {

  constructor(public sprachen: SprachTalent[], public schriften: SprachTalent[], public talente: Talent[],
              public kampftalente: KampfTalent[]){

  }

  public findTalentByName(name: string) {
    for (let i = 0; i < this.talente.length; i++) {
      if (this.talente[i].name === name) {
        return this.talente[i];
      }
    }
    for (let i = 0; i < this.kampftalente.length; i++) {
      if (this.kampftalente[i].name === name) {
        return this.kampftalente[i];
      }
    }
  }

  // TODO
  public findZauberByName(name: string) {
    for (let i = 0; i < this.talente.length; i++) {
      if (this.talente[i].name === name) {
        return this.talente[i];
      }
    }
  }

  public processBe(ausruestung: AusruestungsSet) {
    const eBe = Math.floor(ausruestung.ruestungsStats.ebe);
    this.talente.forEach(talent => talent.calculateEtaw(eBe))
    this.kampftalente.forEach(talent => talent.calculateEtawWithATPA(eBe))
  }

}
