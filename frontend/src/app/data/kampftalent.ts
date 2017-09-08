import {Talent} from "./talent";
import {Sonderfertigkeit} from "./sonderfertigkeit";
/**
 * Created by Patrick on 09.08.2017.
 */
export class KampfTalent {

  constructor(public name: string, public lernmethode: string, public value: number, public be: string,
              public at: number, public  pa: number, public taw: number) {}


  private sonderfertigkeiten: Sonderfertigkeit[] = [];
  public attachSf(sf: Sonderfertigkeit) {
    this.sonderfertigkeiten.push(sf);
  }

  public hasSfFor(name: string): boolean {
    for(let i = 0; i<this.sonderfertigkeiten.length; i++) {
      if(this.sonderfertigkeiten[i].spezialisierung == name) {
        return true;
      }
    }
    return false;

  }
}

