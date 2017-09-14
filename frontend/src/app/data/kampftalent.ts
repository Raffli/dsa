import {Talent} from "./talent";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {TalentBase} from "./TalentBase";
/**
 * Created by Patrick on 09.08.2017.
 */
export class KampfTalent extends TalentBase {

  constructor(public name: string, public lernmethode: string, value: number, be: string,
              public at: number, public  pa: number, public taw: number) {
    super(be, value);
  }

  public calculateEtawWithATPA(eBe: number) {
    this.calculateEtaw(eBe);
    if (this.eTaw < this.value) {
      const diff = this.value - this.eTaw;
      console.log(diff)
      console.log(Math.ceil(diff/2))
      console.log(Math.floor(diff/2))

      this.at -= Math.ceil(diff / 2);
      this.pa -= Math.floor(diff / 2);
    }
  }

}

