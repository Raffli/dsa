import {Spezialisierung} from "./Spezialisierung";
import {AusruestungsSet} from "./ausruestung/AusruestungsSet";
import {Talent} from './talent';
export interface TalentBase {

  eTaw: number,
  spezialisierungen: Spezialisierung[],
  name: string,
  value: number,
  lernmethode: string,
  be: string,
  komplexitaet: string

}
