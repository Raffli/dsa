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

