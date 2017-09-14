import {Lernmethode} from "./enums/lernmethode";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {Spezialisierung} from "./Spezialisierung";
import {TalentBase} from "./TalentBase";
/**
 * Created by Patrick on 12.07.2017.
 */
export class Talent extends TalentBase{



  public komplexitaet: number;
  public kategorie: string;
  constructor(public lernmethode: string, public name: string, public probe: string, value: number, be: string) {
    super(be, value);
  }


}
