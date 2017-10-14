import {Spezialisierung} from './Spezialisierung';
import {TalentBase} from './TalentBase';
/**
 * Created by pahil on 08.10.2017.
 */
export interface Zauber extends TalentBase{
  hauszauber: boolean;
  representation: string;
  probe: string;


}
export function zauberFactory(name: string, value: number, lernmethode: string, be: string, komplexitaet: string, hauszauber: boolean, representation: string, probe: string): Zauber {
  return {
    name: name,
    value: value,
    lernmethode: lernmethode,
    be: be,
    komplexitaet: komplexitaet,
    hauszauber: hauszauber,
    representation: representation,
    probe: probe,
    spezialisierungen: []
  } as Zauber

}
