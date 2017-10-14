import {Lernmethode} from "./enums/lernmethode";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {Spezialisierung} from "./Spezialisierung";
import {TalentBase} from "./TalentBase";
/**
 * Created by Patrick on 12.07.2017.
 */
export interface Talent extends TalentBase {

  kategorie: string;
  probe: string;

}

export function talentFactory(name: string, value: number, lernmethode: string, be: string, komplexitaet: string, kategorie: string, probe: string): Talent {
  return {
    name: name,
    value: value,
    lernmethode: lernmethode,
    be: be,
    komplexitaet: komplexitaet,
    kategorie: kategorie,
    probe: probe,
    spezialisierungen: []
  } as Talent

}
