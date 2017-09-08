import {Sonderfertigkeit} from './sonderfertigkeit';
import {Spezialisierung} from "./Spezialisierung";
/**
 * Created by pahil on 08.09.2017.
 */
export class Sonderfertigkeiten {

  constructor(public kampf: Sonderfertigkeit[], public magische: Sonderfertigkeit[],
              public profane: Sonderfertigkeit[], public zauberSpezialisierungen: Spezialisierung[],
  talentSpezialisierung: Spezialisierung[], public andereSpezialisierungen: Spezialisierung[]) {

  }
}
