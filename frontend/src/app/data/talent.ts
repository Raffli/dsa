import {Lernmethode} from "./enums/lernmethode";
import {Sonderfertigkeit} from "./sonderfertigkeit";
/**
 * Created by Patrick on 12.07.2017.
 */
export class Talent {



  public komplexitaet: number;
  public kategorie: string;

  constructor(public lernmethode: string, public name: string, public probe: string, value: number, be: string) {

  }

  private sonderfertigkeiten: Sonderfertigkeit[] = [];
  public attachSf(sf: Sonderfertigkeit) {
    this.sonderfertigkeiten.push(sf);
  }

}
