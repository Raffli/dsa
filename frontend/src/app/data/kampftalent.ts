import {Talent} from "./talent";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {TalentBase} from "./TalentBase";
/**
 * Created by Patrick on 09.08.2017.
 */
export class KampfTalent extends TalentBase {

  constructor(public name: string, public lernmethode: string, public value: number, public be: string,
              public at: number, public  pa: number, public taw: number) {
    super();
  }

}

