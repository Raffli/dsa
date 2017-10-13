import {Spezialisierung} from "./Spezialisierung";
import {AusruestungsSet} from "./ausruestung/AusruestungsSet";
import {Talent} from './talent';
export class TalentBase {


  public eTaw: number;
  private spezialisierungen: Spezialisierung[] = [];
  public attachSpezialisierung(sf: Spezialisierung) {
    this.spezialisierungen.push(sf);
  }

  constructor(public be: string, public value: number) {

  }

  public hasSpezialisierungFor(name: string): boolean {
    for (let i = 0; i < this.spezialisierungen.length; i++) {
      if (this.spezialisierungen[i].name === name) {
        return true;
      }
    }
  }

  public calculateEtaw(eBe: number) {
    if (this.be === null || this.be === '') {
      this.eTaw = this.value;
    } else if (this.be === 'BE') {
      this.eTaw = this.value - eBe;
    } else {
      const beS = this.be.substr(2, this.be.length);
      const val = parseInt(beS.substr(1, beS.length), 10) // beS.length should alway be 2
      if (beS.startsWith('-')) {
        this.eTaw = this.value - Math.max(0, eBe - val)
      } else {
        this.eTaw = this.value - eBe * val;
      }

    }

  }
}
