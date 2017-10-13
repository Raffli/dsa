import {Attribut} from "./attribut";
import {Vorteil} from "./vorteil";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {Talent} from "./talent";
import {Aussehen} from "./aussehen";
import {Monate} from "./monate";
import {SprachTalent} from "./sprachtalent";
import {Talente} from "./talente";
import {Ausruestung} from "./ausruestung/Ausruestung";
import {KampfTalent} from "./kampftalent";
import {Sonderfertigkeiten} from "./Sonderfertigkeiten";
import {Ereignis} from "./Ereignis";
import {Zauber} from './Zauber';
/**
 * Created by Patrick on 11.07.2017.
 */
export class Held {

  constructor(public  rasse: string, public geschlecht: string, public profession: string,
              public abenteuerPunkteTotal: number, public abenteuerPunkteFrei: number,
              public name: string, public attribute: Attribut[], public vorteile: Vorteil[],
              public sonderfertigkeiten: Sonderfertigkeiten, public kultur: string,
              public groesse: number, public gewicht: number, public aussehen: Aussehen,
              public talente: Talente, public ausruestung: Ausruestung, public ausweichen: number, public xml: string,
              public ereignisse: Ereignis[])
  {
  }

  public getGeburtstag(): string {
    return this.aussehen.gbtag + '. '+ Monate.VALUES[this.aussehen.gbmonat] + ' ' + this.aussehen.gbjahr + ' BF    '+this.aussehen.alter + ' Jahre';
  }


  public getRingenRaufen(): KampfTalent[] {
    const ret = [];
    for (let i = 0; i < this.talente.kampftalente.length; i++) {
      if (this.talente.kampftalente[i].name == 'Raufen') {
        ret.push(this.talente.kampftalente[i]);
      } else if(this.talente.kampftalente[i].name == 'Ringen') {
        ret.push(this.talente.kampftalente[i]);
        return ret;
      }
    }

    return null;
  }
}
