import {Lernmethode} from "./enums/lernmethode";
/**
 * Created by Patrick on 12.07.2017.
 */
export class Talent {
  lernmethode: string;
  name: string;
  probe: string;
  value: number;
  be: string;
  komplexitaet: string;
  kategoroie: string;


  constructor(lernmethode: string, name: string, probe: string, value: number, be:string) {
    this.lernmethode = lernmethode;
    this.name = name;
    this.probe = probe;
    this.value = value;
    this.be = be;
  }
}
