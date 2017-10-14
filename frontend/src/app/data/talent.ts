import {Lernmethode} from "./enums/lernmethode";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {Spezialisierung} from "./Spezialisierung";
import {TalentBase} from "./TalentBase";
/**
 * Created by Patrick on 12.07.2017.
 */
export interface Talent extends TalentBase {

  kategorie: string,

}
