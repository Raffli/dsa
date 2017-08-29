import {SprachTalent} from "./sprachtalent";
import {Talent} from "./talent";
import {KampfTalent} from "./kampftalent";
/**
 * Created by pahil on 29.08.2017.
 */
export class Talente {

  constructor(public sprachen: SprachTalent[], public schriften: SprachTalent[], public talente: Talent[],
              public kampftalente: KampfTalent[]){

  }
}
