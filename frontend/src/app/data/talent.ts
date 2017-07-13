import {Lernmethode} from "./enums/lernmethode";
/**
 * Created by Patrick on 12.07.2017.
 */
export class Talent {
  lernmethode: Lernmethode;
  name: string;
  probe: string;
  value: number;


  constructor(lernmethode: Lernmethode, name: string, probe: string, value: number) {
    this.lernmethode = lernmethode;
    this.name = name;
    this.probe = probe;
    this.value = value;
  }
}
