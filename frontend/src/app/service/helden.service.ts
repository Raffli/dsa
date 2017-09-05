import { Injectable } from '@angular/core';
import {Held} from "../data/held";
import {Attribut} from "../data/attribut";
import {Vorteil} from "../data/vorteil";
import {Sonderfertigkeit} from "../data/sonderfertigkeit";
import {Talent} from "../data/talent";
import {Lernmethode} from "../data/enums/lernmethode";
import {AttributService} from "./attribut.service";
import {TalentService} from "./talent.service";
import {TalentData} from "../data/talentdata";
import {Observable, Observer} from 'rxjs/Rx'
import {Aussehen} from "../data/aussehen";
import {SprachTalent} from "../data/sprachtalent";
import {KampfTalent} from "../data/kampftalent";
import {Talente} from "../data/talente";
import {AtPaPair} from "../data/AtPaPair";
import {Ausruestung} from "../data/ausruestung/Ausruestung";
import {AusruestungService} from "./ausruestung.service";
import {Waffe} from "../data/ausruestung/Waffe";
import {Hand} from "../data/ausruestung/Hand";
import {AusruestungsSet} from "../data/ausruestung/AusruestungsSet";
import {KampfTalentService} from "./kampf-talent.service";

@Injectable()
export class HeldenService {

  private _held: Held

  constructor(private attributService: AttributService, private talentService: TalentService, private ausruetungsService: AusruestungService, private kampftalentService: KampfTalentService) {
    this.loadHeld(this.testHeld, (held: Held) => {
      this._held = held;
    })
  }

  getHeld(): Held {
    return this._held;
  }


  setHeld(value: Held) {
    this._held = value;
  }

  loadHeld(xml : string, callback : (held:Held) => void):void {


    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    const profession = this.extractProfession(xmlDoc);
    const rasse = this.extractRasse(xmlDoc);
    const geschlecht = this.extractGeschlecht(xmlDoc);
    const alter = this.extractAlter(xmlDoc);
    const apTotal = this.extractApTotal(xmlDoc);
    const apFree = this.extractApFree(xmlDoc);
    const name = this.extractName(xmlDoc);
    const attribute = this.extractAttribute(xmlDoc);
    const vorteile = this.extractVorteile(xmlDoc);
    const sonderfertigkeiten = this.extractSonderfertigkeiten(xmlDoc);
    const kultur = this.extractKultur(xmlDoc);
    const groesseGewicht = this.extractGewichtGroesse(xmlDoc);
    const aussehen = this.extractAussehen(xmlDoc);
    this.extractTalente(xmlDoc, attribute[17].value, (talente: Talente) => {

      const ausruestung = this.extractAusruestung(xmlDoc, attribute[7].value, talente.kampftalente, attribute[15].value, attribute[16].value);
      const hero = new Held(rasse, geschlecht, profession, apTotal, apFree, name, attribute, vorteile, sonderfertigkeiten, kultur, groesseGewicht.groesse, groesseGewicht.gewicht, aussehen, talente, ausruestung);
      callback(hero);
    });

  }

  private extractGewichtGroesse(xmlDoc : Document) : any {
    let node = xmlDoc.getElementsByTagName('groesse')[0];
    let gewicht = parseInt(node.getAttribute('gewicht'));
    let groesse = parseInt(node.getAttribute('value'));
    return {gewicht:gewicht, groesse:groesse}

  }

  private extractAussehen(xmlDoc: Document) : Aussehen {
    //gbjahr, gbmonat, gbtag
    let node = xmlDoc.getElementsByTagName('aussehen')[0];
    let alter = parseInt(node.getAttribute('alter'));
    let augenfarbe = node.getAttribute('augenfarbe');
    let haarfarbe = node.getAttribute('haarfarbe');
    let gbjahr = parseInt(node.getAttribute('gbjahr'))
    let gbmonat = parseInt(node.getAttribute('gbmonat'))
    let gbtag = parseInt(node.getAttribute('gbtag'))
    let stand = node.getAttribute('stand');
    let titel = node.getAttribute('titel');

    return new Aussehen(alter,augenfarbe,haarfarbe, gbjahr, gbmonat, gbtag, stand,titel );

  }




  private extractKultur(xmlDoc: Document) : string {
    let node = xmlDoc.getElementsByTagName('kultur')[0];
    let kultur = node.getAttribute('string');
    return kultur;
  }

  private extractProfession(xmlDoc: Document):string {
    let node = xmlDoc.getElementsByTagName('ausbildung')[0];
    let professionSub = node.getAttribute('string')

    let professionMain = node.getAttribute('name');

    professionMain = professionMain.substring(professionMain.lastIndexOf('.')+1)

    return professionMain+': '+professionSub;
  }

  private extractRasse(xmlDoc: Document) : string {
    let node = xmlDoc.getElementsByTagName('rasse')[0];
    let rasse = node.getAttribute('name');
    return rasse.substring(rasse.lastIndexOf('.')+1)
  }

  private extractGeschlecht(xmlDoc: Document) : string {
    let node = xmlDoc.getElementsByTagName('geschlecht')[0];
    let geschlecht = node.getAttribute('name');
    return geschlecht;
  }

  private extractAlter(xmlDoc: Document) : number {
    let node = xmlDoc.getElementsByTagName('aussehen')[0];
    let alter = node.getAttribute('alter');
    return parseInt(alter.substring(alter.lastIndexOf('.')+1))
  }

  private extractApTotal(xmlDoc: Document) : number {
    let node = xmlDoc.getElementsByTagName('abenteuerpunkte')[0];
    let apTotal = node.getAttribute('value');
    return parseInt(apTotal);
  }

  private extractApFree(xmlDoc: Document) : number {
    let node = xmlDoc.getElementsByTagName('freieabenteuerpunkte')[0];
    let apFree = node.getAttribute('value');
    return parseInt(apFree);
  }

  private extractName(xmlDoc: Document) : string {
    let node = xmlDoc.getElementsByTagName('held')[0];
    let name = node.getAttribute('name');
    return name;
  }

  private extractAttribute(xmlDoc: Document) : Attribut[] {
    let nodes = xmlDoc.getElementsByTagName('eigenschaft')
    let attribute = [];
    for(let i=0; i<nodes.length;i++) {
      let node = nodes[i];
      let name = node.getAttribute('name');
      let value = parseInt(node.getAttribute('value'));
      let startwert = parseInt(node.getAttribute('startwert'));
      let mod = parseInt(node.getAttribute('mod'));
      if(name!='Magieresistenz') {
        value +=mod;
      } else {
        value = 8+mod ;
      }
      let attShort = this.attributService.getAttributShortcut(name);

      let attribut = new Attribut(name, value, startwert, mod, attShort);
      attribute.push(attribut);
    }
    return attribute;
  }

  private extractAusruestung(xmlDoc: Document, kk: number, kampftalente: KampfTalent[], atBasis: number, paBasis: number): Ausruestung {

    const nodes = xmlDoc.getElementsByTagName('heldenausruestung');
    const ausruestungen = [];
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    const ret = new Ausruestung(ausruestungen);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];


      const type = node.getAttribute('name');
      if (type.startsWith('nkwaffe')) {
        const name = node.getAttribute('waffenname');
        this.ausruetungsService.getWaffeByName(name).subscribe(
          (waffe: Waffe) => {
            if (node.getAttribute('hand') === 'links') {
              waffe.hand = Hand.links;
            } else {
              waffe.hand = Hand.rechts
            }
            if (waffe.tpKK.minKK > kk) {

              console.log('handle not enough kk')
            } else {
              const additionalDamage = (kk - waffe.tpKK.minKK) / waffe.tpKK.mod;
              waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix + additionalDamage}
              const kampfTalent = this.kampftalentService.extractKampftalentByShort(waffe.typ, kampftalente);
              if (kampfTalent === null) {
                console.log('unlearned talent: ' + waffe.typ)
                waffe.at = atBasis - waffe.wm.at;
                waffe.pa = paBasis - waffe.wm.pa;
              } else {
                waffe.at = kampfTalent.at - waffe.wm.at;
                waffe.pa = kampfTalent.pa - waffe.wm.pa;
              }

            }
            const slot = parseInt(node.getAttribute('slot'));
            ausruestungen[slot].waffen.push(waffe);
          }
        )
      } else if(type.startsWith('fkwaffe')) {

      } else if(type.startsWith('schild')) {

      } else if(type.startsWith('ruestung')) {

      }
    }

    return ret;
  }

  private extractVorteile(xmlDoc: Document) : Vorteil[] {
    let nodes = xmlDoc.getElementsByTagName('vorteil')
    let vorteile = [];
    for(let i=0; i<nodes.length;i++) {
      let node = nodes[i];
      let name = node.getAttribute('name');
      let value= parseInt(node.getAttribute('value'));


      let vorteil = new Vorteil(name, value);
      vorteile.push(vorteil);
    }
    return vorteile;
  }

  private extractSonderfertigkeiten(xmlDoc: Document) : Sonderfertigkeit[] {
    const nodes = xmlDoc.getElementsByTagName('sonderfertigkeit')
    const sonderfertigkeiten = [];
    for (let i = 0; i < nodes.length ; i++) {
      const node = nodes.item(i);
      const name = node.getAttribute('name');
      let info = null;
      console.log(node)
      if (node.childNodes.length != 0) {

        let child = node.childNodes[0];
        info = child.attributes.getNamedItem('name')
        //TODO: handle zauberspezialisierung
      }
      let sonderfertigkeit = new Sonderfertigkeit(name, info);
      sonderfertigkeiten.push(sonderfertigkeit);
    }
    return sonderfertigkeiten;
  }

  private extractTalente(xmlDoc: Document, fkBasis: number, callback: (talente: Talente) => void) : Talent[] {
    const nodes = xmlDoc.getElementsByTagName('talent')
    const talente = [];
    const schriftTalente: SprachTalent[] = [];
    const sprachtalente: SprachTalent[] = [];
    const kampftalente: KampfTalent[] = [];
    const observableBatch: Observable<TalentData>[] = [];
    const kampfMeta = this.buildKampfTalente(xmlDoc);
    const talentData: Talente = new Talente(sprachtalente, schriftTalente, talente, kampftalente)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const lernmethode = node.getAttribute('lernmethode');
      const name = node.getAttribute('name');
      const probe = node.getAttribute('probe');
      const value = parseInt(node.getAttribute('value'));
      const be = node.getAttribute('be');

      const obs = this.talentService.getTalentByName(name);
      observableBatch.push(obs);
      obs.subscribe(
        (data: TalentData) => {
          if(data.kategorie === 'Kampf') {
            const atpa = kampfMeta[name];
            let talent: KampfTalent;
            if (atpa === undefined) {
              // Fernkampf Talent
              talent = new KampfTalent(name, lernmethode, value, be, fkBasis + value, null)
            } else {
              talent = new KampfTalent(name, lernmethode, value, be, atpa.at, atpa.pa)
            }

            kampftalente.push(talent);
          } else if(data.kategorie === 'Sprachen') {
            const talent: SprachTalent =  data as SprachTalent;
            talent.value = value;
            sprachtalente.push(talent);

          } else if(data.kategorie == 'Schrift') {
            const talent: SprachTalent =  data as SprachTalent;
            talent.value = value;
            schriftTalente.push(talent);
          } else {
            const talent = new Talent(lernmethode, name, probe, value, be);
            talent.komplexitaet = data.komplexitaet;
            talent.kategorie = data.kategorie;
            talente.push(talent);

          }
          if (i === nodes.length -1) {
            callback(talentData);

          }
        }, (error:any) => {
          console.log(error)
          console.log(name)
        }
      )

      let zipped = Observable.zip(observableBatch);
      zipped.subscribe(
        () => {
          console.log("all finished")
        }
      )





    }

    return talente;
  }

  private buildKampfTalente(xml: Document): {[key:string]: AtPaPair} {
    const values = {};
    const nodes = xml.getElementsByTagName('kampfwerte')
    for (let i = 0 ; i < nodes.length; i++) {
      const node = nodes[i];
      const name = node.getAttribute('name');
      const at = parseInt(node.childNodes[0].attributes.getNamedItem('value').value);
      const pa = parseInt(node.childNodes[1].attributes.getNamedItem('value').value);
      values[name] = new AtPaPair(at, pa);

    }
    return values;
  }


  private readonly testHeld = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="helden.xsl"?><helden Version="5.5.3"><held key="1499118035891" name="Jure Eshdarson" stand="1504528087994"><mods/><basis><geschlecht name="männlich"/><settings name="DSA4.1"/><rasse name="helden.model.rasse.Thorwaler" string="Thorwaler"><groesse gewicht="86" value="181"/><aussehen alter="21" augenfarbe="blau" aussehentext0="" aussehentext1="" aussehentext2="" aussehentext3="" familietext0="" familietext1="" familietext2="" familietext3="" familietext4="" familietext5="" gbjahr="1003" gbmonat="5" gbtag="4" gprest="0" gpstart="110" haarfarbe="rotblond" kalender="Bosparans Fall" stand="" titel=""/><variante name="Thorwaler"/></rasse><kultur name="helden.model.kultur.Thorwal" string="Thorwal"><variante name="Thorwal"/></kultur><ausbildungen><ausbildung art="Hauptprofession" name="helden.model.profession.Magier" string="Halle des Windes zu Olport" tarnidentitaet=""><variante name="Halle des Windes zu Olport"/></ausbildung></ausbildungen><verify value="1"/><notiz notiz0="Notizen" notiz1="" notiz10="" notiz11="" notiz2="" notiz3="" notiz4="" notiz5="" notiz6="" notiz7="" notiz8="" notiz9=""/><portraet value=""/><abenteuerpunkte value="2710"/><freieabenteuerpunkte value="80"/><gilde name="keine"/></basis><eigenschaften><eigenschaft mod="1" name="Mut" startwert="12" value="12"/><eigenschaft mod="0" name="Klugheit" startwert="14" value="14"/><eigenschaft mod="0" name="Intuition" startwert="14" value="14"/><eigenschaft mod="0" name="Charisma" startwert="12" value="12"/><eigenschaft mod="0" name="Fingerfertigkeit" startwert="11" value="11"/><eigenschaft mod="0" name="Gewandtheit" startwert="14" value="15"/><eigenschaft mod="1" name="Konstitution" startwert="11" value="11"/><eigenschaft mod="1" name="Körperkraft" startwert="12" value="20"/><eigenschaft mod="0" name="Sozialstatus" startwert="5" value="5"/><eigenschaft mod="11" name="Lebensenergie" value="0"/><eigenschaft mod="12" name="Ausdauer" value="0"/><eigenschaft grossemeditation="0" mod="18" mrmod="-3" name="Astralenergie" value="0"/><eigenschaft karmalqueste="0" mod="0" name="Karmaenergie" value="0"/><eigenschaft mod="-3" name="Magieresistenz" value="0"/><eigenschaft mod="0" name="ini" value="11"/><eigenschaft mod="0" name="at" value="8"/><eigenschaft mod="0" name="pa" value="8"/><eigenschaft mod="0" name="fk" value="8"/></eigenschaften><vt><vorteil name="Akademische Ausbildung (Magier)"/><vorteil name="Vollzauberer"/><vorteil name="Aberglaube" value="5"/><vorteil name="Arroganz" value="5"/><vorteil name="Artefaktgebunden"/><vorteil name="Autoritätsgläubig" value="8"/><vorteil name="Hitzeempfindlichkeit"/><vorteil name="Impulsiv"/><vorteil name="Jähzorn" value="6"/><vorteil name="Neugier" value="7"/><vorteil name="Randgruppe"/><vorteil name="Sucht" value="Alkohol (6)"/></vt><sf><sonderfertigkeit name="Astrale Meditation"/><sonderfertigkeit name="Beidhändiger Kampf I"/><sonderfertigkeit name="Beidhändiger Kampf II"/><sonderfertigkeit name="Fernzauberei"/><sonderfertigkeit name="Große Meditation"/><sonderfertigkeit name="Kulturkunde"><kultur name="Thorwal"/></sonderfertigkeit><sonderfertigkeit name="Linkhand"/><sonderfertigkeit name="Merkmalskenntnis: Elementar (Luft)"/><sonderfertigkeit name="Merkmalskenntnis: Umwelt"/><sonderfertigkeit name="Regeneration I"/><sonderfertigkeit name="Repräsentation: Magier"/><sonderfertigkeit name="Ritualkenntnis: Gildenmagie"/><sonderfertigkeit name="Stabzauber: Bindung"/><sonderfertigkeit name="Stabzauber: Fackel"/><sonderfertigkeit name="Talentspezialisierung Hiebwaffen (Skraja)"><talent name="Hiebwaffen"/><spezialisierung name="Skraja"/></sonderfertigkeit><sonderfertigkeit name="Wuchtschlag"/><verbilligtesonderfertigkeit name="Merkmalskenntnis: Elementar (Wasser)"/></sf><ereignisse><ereignis obj="max GP für Helden: 110" text="EINSTELLUNG" time="1499118036689" version="HS 5.5.2"/><ereignis obj="max Eigenschafts-GP für Helden: 100" text="EINSTELLUNG" time="1499118036689" version="HS 5.5.2"/><ereignis obj="max Eigenschafts-Wert für Helden: 14" text="EINSTELLUNG" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="5 GP" obj="Rasse: Thorwaler" text="RKP" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="4 GP" obj="Kultur: Thorwal" text="RKP" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="29 GP" obj="Profession: Halle des Windes zu Olport" text="RKP" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="12 GP" obj="Mut: 13" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Klugheit: 14" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Intuition: 14" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="12" kommentar="12 GP" obj="Charisma: 12" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Fingerfertigkeit: 11" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Gewandtheit: 14" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="12" kommentar="11 GP" obj="Konstitution: 12" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="12 GP" obj="Körperkraft: 13" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="0 GP" obj="Sozialstatus: 5" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="17 AP" obj="Hiebwaffen: 4" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="22 AP" obj="Hiebwaffen: 5" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="27 AP" obj="Hiebwaffen: 6" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="21 AP" obj="Ritualkenntnis: Gildenmagie: 4" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="28 AP" obj="Ritualkenntnis: Gildenmagie: 5" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="12 AP" obj="Fortifex arkane Wand [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="17 AP" obj="Fortifex arkane Wand [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="2 AP" obj="Aeolitus Windgebraus [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="4 AP" obj="Aeolitus Windgebraus [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Aeolitus Windgebraus [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="4 AP" obj="Flim Flam Funkel [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Flim Flam Funkel [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Silentium [Magier] (HZ): 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="6 AP" obj="Silentium [Magier] (HZ): 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Windstille [Magier] (HZ): 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="6 AP" obj="Windstille [Magier] (HZ): 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="8" kommentar="8 AP" obj="Windstille [Magier] (HZ): 8" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="9" kommentar="9 AP" obj="Windstille [Magier] (HZ): 9" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="10" kommentar="11 AP" obj="Windstille [Magier] (HZ): 10" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="7 AP" obj="Solidirid Weg aus Licht [Magier] (HZ): 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="8 AP" obj="Solidirid Weg aus Licht [Magier] (HZ): 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="8 AP" obj="Adlerauge Luchsenohr [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="11 AP" obj="Adlerauge Luchsenohr [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="1 AP" obj="Orcanofaxius Luftstrahl [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="1 AP" obj="Orcanofaxius Luftstrahl [Magier]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="2 AP" obj="Orcanofaxius Luftstrahl [Magier]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="3 AP" obj="Orcanofaxius Luftstrahl [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="8 AP" obj="Orcanofaxius Luftstrahl [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="11 AP" obj="Orcanofaxius Luftstrahl [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="14 AP" obj="Orcanofaxius Luftstrahl [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="2 AP" obj="Pfeil der Luft [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="8 AP" obj="Wellenlauf [Druide]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="6 AP" obj="Wellenlauf [Druide]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="14 AP" obj="Wellenlauf [Druide]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="22 AP" obj="Wellenlauf [Druide]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="2 AP" obj="Mahlstrom [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="2 AP" obj="Mahlstrom [Magier]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="4 AP" obj="Mahlstrom [Magier]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="9 AP" obj="Mahlstrom [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="13 AP" obj="Mahlstrom [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="17 AP" obj="Mahlstrom [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="21 AP" obj="Mahlstrom [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="25 AP" obj="Mahlstrom [Magier]: 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="3 AP" obj="Hartes schmelze! [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="2 AP" obj="Hartes schmelze! [Magier]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="6 AP" obj="Hartes schmelze! [Magier]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="9 AP" obj="Hartes schmelze! [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="13 AP" obj="Hartes schmelze! [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="6 GP" obj="Linkhand" text="SF" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="38 AP" obj="Regeneration I" text="SF" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="56 AP" obj="Stabzauber: Fackel" text="SF" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Aberglaube: 5" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Akademische Ausbildung (Magier)" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Arroganz: 5" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-7 GP" obj="Artefaktgebunden" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-4 GP" obj="Autoritätsgläubig: 8" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-7 GP" obj="Hitzeempfindlichkeit" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Impulsiv" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Jähzorn: 6" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Neugier: 7" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Randgruppe" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-6 GP" obj="Sucht: Alkohol (6)" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Vollzauberer" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Abenteuerpunkte="1500" kommentar=" Gesamt AP: 1500 Verfügbare AP: 1500" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1499118055799" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-410" Alt="14" Neu="15" obj="Gewandtheit" text="Eigenschaft steigern" time="1499118071645" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-100" obj="Beidhändiger Kampf I" text="Sonderfertigkeit hinzugefügt" time="1499118080722" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-400" obj="Beidhändiger Kampf II" text="Sonderfertigkeit hinzugefügt" time="1499118081941" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-200" obj="Wuchtschlag" text="Sonderfertigkeit hinzugefügt" time="1499118426910" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-41" Alt="6;5;1" Info="Selbststudium" Neu="7;5;1" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1499119058646" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-160" obj="Talentspezialisierung Hiebwaffen (Skraja)" text="Sonderfertigkeit hinzugefügt" time="1499119079311" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-48" Alt="7;5;1" Info="Selbststudium" Neu="8;5;1" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1499119085645" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-55" Alt="8;5;1" Info="Selbststudium" Neu="9;5;1" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1499119086693" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Boote fahren" text="Talent steigern" time="1499119111799" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-21" Alt="5" Info="Selbststudium" Neu="6" obj="Boote fahren" text="Talent steigern" time="1499119112331" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="Selbststudium" Neu="7" obj="Boote fahren" text="Talent steigern" time="1499119113301" version="HS 5.5.2"/><ereignis Abenteuerpunkte="250" kommentar="Zweihörnigen Kopfschwänzler gefangen Gesamt AP: 250 Verfügbare AP: 250" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1502049665621" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="SE, Selbststudium" Neu="8" obj="Boote fahren" text="Talent steigern" time="1502049724214" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-20" Neu="0" obj="Caldofrigo heiß und kalt [Magier]" text="Zauber aktivieren" time="1502049736046" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-4" Alt="0" Info="Selbststudium" Neu="1" obj="Caldofrigo heiß und kalt [Magier]" text="Zauber steigern" time="1502049741865" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-9" Alt="1" Info="Selbststudium" Neu="2" obj="Caldofrigo heiß und kalt [Magier]" text="Zauber steigern" time="1502049742097" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-15" Alt="2" Info="Selbststudium" Neu="3" obj="Caldofrigo heiß und kalt [Magier]" text="Zauber steigern" time="1502049742296" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-21" Alt="3" Info="Selbststudium" Neu="4" obj="Caldofrigo heiß und kalt [Magier]" text="Zauber steigern" time="1502049742525" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-4" Alt="4" Info="SE, Gegenseitiges Lehren" Neu="5" obj="Odem Arcanum [Magier]" text="Zauber steigern" time="1502049755386" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-10" Alt="7" Info="SE, Selbststudium" Neu="8" obj="Solidirid Weg aus Licht [Magier]" text="Zauber steigern" time="1502049764668" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-2" Alt="1" Info="SE, Gegenseitiges Lehren" Neu="2" obj="Tierkunde" text="Talent steigern" time="1502049792611" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-28" Alt="10" Info="Selbststudium" Neu="11" obj="Windstille [Magier]" text="Zauber steigern" time="1502049827440" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-9" Alt="1" Info="Selbststudium" Neu="2" obj="Klettern" text="Talent steigern" time="1502049882410" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-15" Alt="2" Info="Selbststudium" Neu="3" obj="Athletik" text="Talent steigern" time="1502049890080" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-21" Alt="3" Info="Selbststudium" Neu="4" obj="Athletik" text="Talent steigern" time="1502049890234" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-6" Alt="2" Info="Selbststudium" Neu="3" obj="Windhose [Magier]" text="Zauber steigern" time="1502049903738" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Selbststudium" Neu="4" obj="Windhose [Magier]" text="Zauber steigern" time="1502049903872" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-28" Alt="4" Info="Selbststudium" Neu="5" obj="Fortifex arkane Wand [Magier]" text="Zauber steigern" time="1502049911410" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Selbststudium" Neu="3" obj="Armatrutz [Magier]" text="Zauber steigern" time="1502049918623" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-22" Alt="8" Info="Selbststudium" Neu="9" obj="Solidirid Weg aus Licht [Magier]" text="Zauber steigern" time="1502049989968" version="HS 5.5.3"/><ereignis Abenteuerpunkte="400" kommentar="Der Turm der perversen ASP Gesamt AP: 400 Verfügbare AP: 400" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1504466307608" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-28" Alt="4" Info="Selbststudium" Neu="5" obj="Caldofrigo heiß und kalt [Magier]" text="Zauber steigern" time="1504466313777" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Selbststudium" Neu="1" obj="Pfeil der Luft [Magier]" text="Zauber steigern" time="1504466323148" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-6" Alt="1" Info="Selbststudium" Neu="2" obj="Pfeil der Luft [Magier]" text="Zauber steigern" time="1504466323292" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Selbststudium" Neu="6" obj="Odem Arcanum [Magier]" text="Zauber steigern" time="1504466331842" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Selbststudium" Neu="5" obj="Windhose [Magier]" text="Zauber steigern" time="1504466337571" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-6" Alt="1" Info="SE, Gegenseitiges Lehren" Neu="2" obj="Singen" text="Talent steigern" time="1504466345265" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="SE, Gegenseitiges Lehren" Neu="5" obj="Athletik" text="Talent steigern" time="1504466351240" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-34" Alt="5" Info="Selbststudium" Neu="6" obj="Athletik" text="Talent steigern" time="1504466362929" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-15" Alt="2" Info="Selbststudium" Neu="3" obj="Klettern" text="Talent steigern" time="1504466368676" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-65" Alt="9;7;2" Info="Selbststudium" Neu="10;7;2" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504466431218" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-21" Alt="3" Info="Selbststudium" Neu="4" obj="Selbstbeherrschung" text="Talent steigern" time="1504466438154" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-28" Alt="4" Info="Selbststudium" Neu="5" obj="Sinnenschärfe" text="Talent steigern" time="1504466444156" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-21" Alt="3" Info="Selbststudium" Neu="4" obj="Klettern" text="Talent steigern" time="1504466483934" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-9" Alt="2" Info="Selbststudium" Neu="3" obj="Attributo [Magier]" text="Zauber steigern" time="1504466489653" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Selbststudium" Neu="6" obj="Windhose [Magier]" text="Zauber steigern" time="1504466497626" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Wettermeisterschaft [Magier]" text="Zauber steigern" time="1504466531394" version="HS 5.5.3"/><ereignis Abenteuerpunkte="-32" Alt="11" Info="Selbststudium" Neu="12" obj="Windstille [Magier]" text="Zauber steigern" time="1504466596069" version="HS 5.5.3"/></ereignisse><talentliste><talent lernmethode="Gegenseitiges Lehren" name="Dolche" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Selbststudium" name="Hiebwaffen" probe=" (GE/GE/KK)" value="10"/><talent lernmethode="Gegenseitiges Lehren" name="Raufen" probe=" (GE/GE/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Ringen" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Säbel" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfbeile" probe=" (GE/FF/KK)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfmesser" probe=" (GE/FF/KK)" value="0"/><talent be="BEx2" lernmethode="Selbststudium" name="Athletik" probe=" (GE/KO/KK)" value="6"/><talent be="BEx2" lernmethode="Selbststudium" name="Klettern" probe=" (MU/GE/KK)" value="4"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Körperbeherrschung" probe=" (MU/IN/GE)" value="2"/><talent be="BE" lernmethode="Gegenseitiges Lehren" name="Schleichen" probe=" (MU/IN/GE)" value="0"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Schwimmen" probe=" (GE/KO/KK)" value="5"/><talent be="" lernmethode="Selbststudium" name="Selbstbeherrschung" probe=" (MU/KO/KK)" value="4"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Sich verstecken" probe=" (MU/IN/GE)" value="0"/><talent be="BE-3" lernmethode="Gegenseitiges Lehren" name="Singen" probe=" (IN/CH/CH)" value="2"/><talent be="0-&gt;BE" lernmethode="Selbststudium" name="Sinnenschärfe" probe=" (KL/IN/IN)" value="5"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Tanzen" probe=" (CH/GE/GE)" value="0"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Zechen" probe=" (IN/KO/KK)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Lehren" probe=" (KL/IN/CH)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Menschenkenntnis" probe=" (KL/IN/CH)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Überreden" probe=" (MU/IN/CH)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Fährtensuchen" probe=" (KL/IN/KO)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Fesseln/Entfesseln" probe=" (FF/GE/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Fischen/Angeln" probe=" (IN/FF/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Orientierung" probe=" (KL/IN/IN)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Wettervorhersage" probe=" (KL/IN/IN)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Wildnisleben" probe=" (IN/GE/KO)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Geografie" probe=" (KL/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Geschichtswissen" probe=" (KL/KL/IN)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Götter und Kulte" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Magiekunde" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Pflanzenkunde" probe=" (KL/IN/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Rechnen" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Rechtskunde" probe=" (KL/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Sagen und Legenden" probe=" (KL/IN/CH)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Sternkunde" probe=" (KL/KL/IN)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Tierkunde" probe=" (MU/KL/IN)" value="2"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Bosparano" probe=" (KL/IN/CH)" value="4"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Garethi" probe=" (KL/IN/CH)" value="10"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Hjaldingsch" probe=" (KL/IN/CH)" value="8"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Isdira" probe=" (KL/IN/CH)" value="4"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Thorwalsch" probe=" (KL/IN/CH)" value="16"/><talent k="16" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Hjaldingsche Runen" probe=" (KL/KL/FF)" value="8"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Isdira/Asdharia" probe=" (KL/KL/FF)" value="4"/><talent k="10" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Kusliker Zeichen" probe=" (KL/KL/FF)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Alchimie" probe=" (MU/KL/FF)" value="2"/><talent lernmethode="Selbststudium" name="Boote fahren" probe=" (GE/KO/KK)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Krankheiten" probe=" (MU/KL/CH)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Wunden" probe=" (KL/CH/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Holzbearbeitung" probe=" (KL/FF/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Kochen" probe=" (KL/IN/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Lederarbeiten" probe=" (KL/FF/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Malen/Zeichnen" probe=" (KL/IN/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Schneidern" probe=" (KL/FF/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Seefahrt" probe=" (FF/GE/KK)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Ritualkenntnis: Gildenmagie" probe=" (--/--/--)" value="5"/></talentliste><zauberliste><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Adlerauge Luchsenohr" probe=" (KL/IN/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Aeolitus Windgebraus" probe=" (KL/CH/KO)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Selbststudium" name="Armatrutz" probe=" (IN/GE/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Selbststudium" name="Attributo" probe=" (KL/CH/**)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Balsam Salabunde" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="E" kosten="" lernmethode="Selbststudium" name="Caldofrigo heiß und kalt" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Elementarbann" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Elementarer Diener" probe=" (MU/KL/CH)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Flim Flam Funkel" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Fortifex arkane Wand" probe=" (IN/KO/KK)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Frigifaxius Eisstrahl" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Hartes schmelze!" probe=" (MU/KL/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Mahlstrom" probe=" (MU/IN/KK)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Manifesto Element" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Nebelwand und Morgendunst" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Selbststudium" name="Odem Arcanum" probe=" (KL/IN/IN)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Orcanofaxius Luftstrahl" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Pfeil der Luft" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Silentium" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="D" kosten="" lernmethode="Selbststudium" name="Solidirid Weg aus Licht" probe=" (IN/KO/KK)" reichweite="" repraesentation="Magier" value="9" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Unitatio Geistesbund" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Veränderung aufheben" probe=" (KL/IN/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Wellenlauf" probe=" (MU/GE/GE)" reichweite="" repraesentation="Druide" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="E" kosten="" lernmethode="Selbststudium" name="Wettermeisterschaft" probe=" (MU/CH/GE)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Windhose" probe=" (MU/IN/KK)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Selbststudium" name="Windstille" probe=" (KL/CH/KK)" reichweite="" repraesentation="Magier" value="12" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/></zauberliste><kampf><kampfwerte name="Dolche"><attacke value="9"/><parade value="8"/></kampfwerte><kampfwerte name="Hiebwaffen"><attacke value="15"/><parade value="11"/></kampfwerte><kampfwerte name="Raufen"><attacke value="11"/><parade value="8"/></kampfwerte><kampfwerte name="Ringen"><attacke value="8"/><parade value="8"/></kampfwerte><kampfwerte name="Säbel"><attacke value="8"/><parade value="8"/></kampfwerte></kampf><gegenstände><gegenstand anzahl="1" name="Dicke Kleidung" slot="0"/><gegenstand anzahl="1" name="Gambeson" slot="0"/><gegenstand anzahl="1" name="Großschild" slot="0"/><gegenstand anzahl="1" name="Skraja" slot="0"/><gegenstand anzahl="1" name="Skraja" slot="1"/><gegenstand anzahl="1" name="Wattierte Kappe" slot="0"/><gegenstand anzahl="1" name="Wurfbeil" slot="0"><Fernkampfwaffe><talente kampftalent="Wurfbeile"/></Fernkampfwaffe></gegenstand></gegenstände><BoniWaffenlos/><kommentare><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Bindung" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Fackel" wirkung=""/></kommentare><ausrüstungen><heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="rechts" name="nkwaffe1" schild="0" set="0" slot="0" talent="Hiebwaffen" waffenname="Skraja"/><heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="links" name="nkwaffe2" schild="0" set="0" slot="0" talent="Hiebwaffen" waffenname="Skraja"/><heldenausruestung name="bk12" set="0"/><heldenausruestung name="fkwaffe1" set="0" slot="0" talent="Wurfbeile" waffenname="Wurfbeil"/><heldenausruestung name="schild1" schildname="Großschild" set="0" slot="0" verwendungsArt="Schild"/><heldenausruestung name="ruestung1" ruestungsname="Gambeson" set="0" slot="0"/><heldenausruestung name="ruestung2" ruestungsname="Dicke Kleidung" set="0" slot="0"/><heldenausruestung name="ruestung3" ruestungsname="Wattierte Kappe" set="0" slot="0"/><heldenausruestung name="jagtwaffe" nummer="0" set="0"/><heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="rechts" name="nkwaffe1" schild="0" set="1" slot="0" talent="Hiebwaffen" waffenname="Skraja"/><heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="rechts" name="nkwaffe2" schild="0" set="1" slot="1" talent="Hiebwaffen" waffenname="Skraja"/><heldenausruestung name="schild1" schildname="Großschild" set="1" slot="0" verwendungsArt="Schild"/><heldenausruestung name="jagtwaffe" nummer="0" set="1"/></ausrüstungen><verbindungen/><extention/><geldboerse/><plugindata/></held><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>NVptIvloRJwR4xt0+D31twf5kwE=</DigestValue></Reference></SignedInfo><SignatureValue>EGV4Q80t2DuK3mbQOzp6BCummulvoEqO7vRPY+r1s6sEqPDSuz0AAw==</SignatureValue><KeyInfo><KeyValue><DSAKeyValue><P>/KaCzo4Syrom78z3EQ5SbbB4sF7ey80etKII864WF64B81uRpH5t9jQTxeEu0ImbzRMqzVDZkVG9
xD7nN1kuFw==</P><Q>li7dzDacuo67Jg7mtqEm2TRuOMU=</Q><G>Z4Rxsnqc9E7pGknFFH2xqaryRPBaQ01khpMdLRQnG541Awtx/XPaF5Bpsy4pNWMOHCBiNU0Nogps
QW5QvnlMpA==</G><Y>uVrvWkzIbUdL7E80AiD0PJDX3Ck0beY5StXp1wDAA1/ePpemd6rTBNd8YoCzOovNrX016YMcTSiO
iExM4RWtJA==</Y></DSAKeyValue></KeyValue></KeyInfo></Signature></helden>
`



}
