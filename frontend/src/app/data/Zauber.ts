import {Spezialisierung} from './Spezialisierung';
/**
 * Created by pahil on 08.10.2017.
 */
export interface Zauber {
  hauszauber: boolean;
  komplexitaet: string;
  lernmethode: string;
  representation: string;
  value: number;
  name: string;
  probe: string;
  spezialisierungen: Spezialisierung[];
}
