import {Spezialisierung} from "./Spezialisierung";
export class TalentBase {


  private spezialisierungen: Spezialisierung[] = [];
  public attachSpezialisierung(sf: Spezialisierung) {
    this.spezialisierungen.push(sf);
  }

  public hasSpezialisierungFor(name: string): boolean {
    for(let i = 0; i<this.spezialisierungen.length; i++) {
      if(this.spezialisierungen[i].name === name) {
        return true;
      }
    }
  }
}
