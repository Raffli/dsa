import {Talent} from "./talent";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {TalentBase} from "./TalentBase";
/**
 * Created by Patrick on 09.08.2017.
 */
export interface KampfTalent extends TalentBase {

  at: number,
  pa: number
}

export function kampfTalentFactory(name: string, value: number, lernmethode: string, be: string, komplexitaet: string, at: number, pa?: number): KampfTalent {
  return {
    name: name,
    value: value,
    lernmethode: lernmethode,
    be: be,
    komplexitaet: komplexitaet,
    at: at,
    pa: pa,
    spezialisierungen: []
  } as KampfTalent

}

