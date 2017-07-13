import {Attribut} from "./attribut";
import {Vorteil} from "./vorteil";
import {Sonderfertigkeit} from "./sonderfertigkeit";
import {Talent} from "./talent";
/**
 * Created by Patrick on 11.07.2017.
 */
export class Held {

  xml:string;

  rasse:string;
  geschlecht:string;
  alter: number;

  profession: string;
  abenteuerPunkteTotal: number;
  abenteuerPunkteFrei: number;
  name: string;

  attribute: Attribut[];
  vorteile: Vorteil[];
  sonderfertigkeiten: Sonderfertigkeit[];
  talente: Talent[];



  constructor(xml: string, rasse: string, geschlecht: string, alter: number, profession: string, abenteuerPunkteTotal: number, abenteuerPunkteFrei: number, name: string, attribute: Attribut[], vorteile: Vorteil[], sonderfertigkeiten: Sonderfertigkeit[],
              talente: Talent[]) {
    this.xml = xml;
    this.rasse = rasse;
    this.geschlecht = geschlecht;
    this.alter = alter;
    this.profession = profession;
    this.abenteuerPunkteTotal = abenteuerPunkteTotal;
    this.abenteuerPunkteFrei = abenteuerPunkteFrei;
    this.name = name;
    this.attribute = attribute;
    this.vorteile = vorteile;
    this.sonderfertigkeiten = sonderfertigkeiten;
    this.talente = talente;
  }
}
