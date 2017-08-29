import {Attribut} from "./attribut";
import {Vorteil} from "./vorteil";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {Talent} from "./talent";
import {Aussehen} from "./aussehen";
import {Monate} from "./monate";
import {SprachTalent} from "./sprachtalent";
import {Talente} from "./talente";
/**
 * Created by Patrick on 11.07.2017.
 */
export class Held {





  constructor(public  rasse: string, public geschlecht: string, public profession: string,
              public abenteuerPunkteTotal: number, public abenteuerPunkteFrei: number,
              public name: string, public attribute: Attribut[], public vorteile: Vorteil[],
              public sonderfertigkeiten: Sonderfertigkeit[], public kultur: string,
              public groesse: number, public gewicht: number, public aussehen: Aussehen,
              public talente: Talente) {
  }

  public getGeburtstag(): string {
    return this.aussehen.gbtag+ '. '+Monate.VALUES[this.aussehen.gbmonat] + ' '+this.aussehen.gbjahr+ ' BF    '+this.aussehen.alter + ' Jahre';
  }
}
