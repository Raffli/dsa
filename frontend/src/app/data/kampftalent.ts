import {Talent} from "./talent";
/**
 * Created by Patrick on 09.08.2017.
 */
export class KampfTalent {
  lernmethode: string;
  name: string;
  value: number;
  be: string;
  at: number;
  pa: number;

  constructor(talent: Talent) {
    this.lernmethode = talent.lernmethode;
    this.name = talent.name;
    this.value = talent.value;
    this.be = talent.be;
  }
}

