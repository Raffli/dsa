import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Response} from "@angular/http"
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
import {FernkampfWaffe} from "../data/ausruestung/FernkampfWaffe";
import {Schild} from "../data/ausruestung/Schild";
import {Ruestung} from "../data/ausruestung/Ruestung";
import {environment} from "../../environments/environment";
import {RestService} from "./rest.service";
import {Heldendata} from "../data/heldendata";
import {Sonderfertigkeiten} from "../data/Sonderfertigkeiten";
import {Spezialisierung} from "../data/Spezialisierung";
import {SonderfertigkeitenService} from "./sonderfertigkeiten.service";

@Injectable()
export class HeldenService {

  private _held: Held

  public heldLoaded: EventEmitter<Held> = new EventEmitter();

  constructor(private attributService: AttributService, private talentService: TalentService, private ausruetungsService: AusruestungService,
              private kampftalentService: KampfTalentService, private restService:RestService, private sonderfertigkeitenService: SonderfertigkeitenService) {
    if (!environment.production) {
      this.loadHeldByXML(this.testHeld);
    }

  }

  public getHeldenNamen() : Observable<String[]> {
    return this.restService.get('held/names').map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getHeldByName(name: string): Observable<Heldendata> {
    return this.restService.get('held/byname/?name=' + name).map((response: Response) => response.json())
      .catch((error:any) => Observable.throw(error))
  }

  getHeld(): Held {
    return this._held;
  }


  setHeld(value: Held) {
    this._held = value;
  }


  public loadHeldByXML(xml) {
    this.loadHeld(xml, (held: Held) => {
      this._held = held;
      this.heldLoaded.emit(held);
    })
  }

  private loadHeld(xml : string, callback : (held:Held) => void):void {


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

    const kultur = this.extractKultur(xmlDoc);
    const groesseGewicht = this.extractGewichtGroesse(xmlDoc);
    const aussehen = this.extractAussehen(xmlDoc);
    this.extractTalente(xmlDoc, attribute[17].value, (talente: Talente) => {


     this.extractSonderfertigkeiten(xmlDoc, talente, (sonderfertigkeiten: Sonderfertigkeiten) => {
       const ausruestung = this.extractAusruestung(xmlDoc, attribute[7].value, talente.kampftalente, attribute[15].value, attribute[16].value, attribute[17].value, sonderfertigkeiten);
       const hero = new Held(rasse, geschlecht, profession, apTotal, apFree, name, attribute, vorteile, sonderfertigkeiten, kultur, groesseGewicht.groesse, groesseGewicht.gewicht, aussehen, talente, ausruestung);
       callback(hero);
     })


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

  private extractAusruestung(xmlDoc: Document, kk: number, kampftalente: KampfTalent[], atBasis: number, paBasis: number, fkBasis: number,  sonderfertigkeiten: Sonderfertigkeiten): Ausruestung {

    const nodes = xmlDoc.getElementsByTagName('heldenausruestung');
    const ausruestungen = [];
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    const ret = new Ausruestung(ausruestungen);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];


      const type = node.getAttribute('name');
      const set = parseInt(node.getAttribute('set'));
      if (type.startsWith('nkwaffe')) {
        const name = node.getAttribute('waffenname');
        this.ausruetungsService.getWaffeByName(name).subscribe(
          (waffe: Waffe) => {
            if (node.getAttribute('hand') === 'links') {
              waffe.hand = Hand.links;
            } else {
              waffe.hand = Hand.rechts
            }
            const talentName = node.getAttribute('talent');
            const kampfTalent = this.kampftalentService.extractKampftalent(talentName, kampftalente);
            waffe.be = parseInt(kampfTalent.be.substr(2, kampfTalent.be.length));
            if (kampfTalent === null) {
              console.log('unlearned talent: ' + waffe.typ)
              waffe.at = atBasis + waffe.wm.at;
              waffe.pa = paBasis + waffe.wm.pa;
            } else {
              waffe.at = kampfTalent.at + waffe.wm.at;
              waffe.pa = kampfTalent.pa + waffe.wm.pa;

              if (kampfTalent.hasSpezialisierungFor(waffe.name)) {
                waffe.at ++;
                waffe.pa ++;
              }
            }

            if (waffe.tpKK.minKK > kk) {
              waffe.at --;
              waffe.pa --;
              waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix -1}

            } else {
              const additionalDamage = Math.floor((kk - waffe.tpKK.minKK) / waffe.tpKK.mod);
              waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix + additionalDamage}

            }

            ausruestungen[set].waffen.push(waffe);
          }
        )
      } else if(type.startsWith('fkwaffe')) {
        const name = node.getAttribute('waffenname');
        this.ausruetungsService.getFkWaffeByName(name).subscribe(
          (waffe: FernkampfWaffe) => {
            const talentName = node.getAttribute('talent');
            const kampfTalent = this.kampftalentService.extractKampftalent(talentName, kampftalente);
            ausruestungen[set].fernkampfWafffen.push(waffe);
            if (kampfTalent === null) {
              console.log('TODO: GET BE FROM BACKEND')
              waffe.fk = fkBasis;
            }
            else {
              waffe.be =  parseInt(kampfTalent.be.substr(2, kampfTalent.be.length))
              waffe.fk = kampfTalent.value + fkBasis;

            }


          })

      } else if (type.startsWith('schild')) {
        const verwendungsArt = node.getAttribute('verwendungsArt');
        const name = node.getAttribute('schildname');
        if (verwendungsArt === 'Schild') {
          this.ausruetungsService.getSchildByName(name).subscribe(
            (data: Schild) => {
              let bonusPa = 0;

              ausruestungen[set].schilde.push(data);
              if (this.hasSonderfertigkeit('Linkhand', sonderfertigkeiten.kampf)) {
                bonusPa++;
                if (this.hasSonderfertigkeit('Schildkampf I', sonderfertigkeiten.kampf)) {
                  bonusPa += 2;
                }
                console.log('TODO check schildkampf names')
                if (this.hasSonderfertigkeit('Schildkampf II', sonderfertigkeiten.kampf)) {
                  bonusPa += 2;
                }
              }
              data.pa = paBasis + bonusPa +  data.wm.pa;
            }
          )
        } else {
          console.log('TODO: parierwaffen')
          console.log(node)

        }

      } else if (type.startsWith('ruestung')) {
        const name = node.getAttribute('ruestungsname');
        this.ausruetungsService.getRuestungByName(name).subscribe(
          (data: Ruestung) => {
            ausruestungen[set].ruestungen.push(data);
            if (this.hasSpezialisierung('Rüstungsgewöhnung I', sonderfertigkeiten.andereSpezialisierungen, data.name)) {
              Math.max(0, data.eBe = data.be - 1);
            } else {
              data.eBe = data.be;
            }
          })

      }
    }

    return ret;
  }

  private hasSpezialisierung(talent: string, spezialisierungen: Spezialisierung[], name: string, representation?: string ): boolean {
    for (let i = 0; i < spezialisierungen.length; i++) {
      if(spezialisierungen[i].talent === talent && spezialisierungen[i].name === name) {
        if(representation === undefined)
        return true;
      } else if(representation === spezialisierungen[i].representation) {
        return true;
      }
    }
    return false;
  }

  private hasSonderfertigkeit(name: string, sonderfertigkeiten: Sonderfertigkeit[]): boolean {
    for (let i = 0; i < sonderfertigkeiten.length; i++) {
      if (sonderfertigkeiten[i].name === name) {
        return true;

      }
    }
    return false;
  }

  private extractVorteile(xmlDoc: Document) : Vorteil[] {
    const nodes = xmlDoc.getElementsByTagName('vorteil')
    const vorteile = [];
    for (let i = 0; i < nodes.length; i ++) {
      const node = nodes[i];
      const name = node.getAttribute('name');
      const value = parseInt(node.getAttribute('value'));


      let vorteil = new Vorteil(name, value);
      vorteile.push(vorteil);
    }
    return vorteile;
  }

  private extractSonderfertigkeiten(xmlDoc: Document, talente: Talente,  callback : (sonderfertigkeiten: Sonderfertigkeiten) => void ) {
    const nodes = xmlDoc.getElementsByTagName('sonderfertigkeit')
    const profane: Sonderfertigkeit[] = [];
    const magische: Sonderfertigkeit[] = [];
    const kampf: Sonderfertigkeit[] = [];
    const talentSpezialisierungen: Spezialisierung[] = [];
    const zauberSpezialisierungen: Spezialisierung[] = [];
    const andereSpezialisierungen: Spezialisierung[] = []; //Kulturkunde Rüstung etc


    const sonderfertigkeiten = new Sonderfertigkeiten(kampf, magische, profane, zauberSpezialisierungen, talentSpezialisierungen, andereSpezialisierungen);

    const requestData = [];
    for (let i = 0; i < nodes.length ; i++) {
      const node = nodes.item(i);
      const name = node.getAttribute('name');
      //console.log(name)
      if(name.indexOf('(') !== -1) {
        //Talent / Zauberspezialisierung
        const type = node.childNodes[0].nodeName;
        if(type === 'zauber') {
          const zauberName = name.substring(22, name.indexOf('[')- 1);
          const representation = name.substring(name.indexOf('[') + 1, name.indexOf(']'));
          const spezialisierung = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
          //TODO: Append zs to zauber
          const zs = new Spezialisierung(zauberName, spezialisierung, representation);
         // talente.findZauberByName(zauberName).attachSpezialisierung(zs);
          zauberSpezialisierungen.push(zs)
        } else if( type === 'talent') {
          const talentName = name.substring(22, name.indexOf('(')- 1);
          const spezialisierung = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
          const ts = new Spezialisierung(talentName, spezialisierung);
          talentSpezialisierungen.push(ts);
          talente.findTalentByName(talentName).attachSpezialisierung(ts);

        } else {
          window.alert('Paddi hat einen Fall vergessen! Fallname: ' + name);
        }
      } else if (node.childNodes.length === 1) {
        //Rüstungsgewöhnung oder Kulturkunde
        const spezialisierung = node.firstChild.attributes.getNamedItem('name').value;
        andereSpezialisierungen.push(new Spezialisierung(name, spezialisierung));

      } else {
        requestData.push(name);


      }


    }
    this.sonderfertigkeitenService.getSfsByName(requestData).subscribe(
      (sfs: Sonderfertigkeit[]) => {

        for( let i = 0; i< sfs.length; i++) {
          const data = sfs[i];
          if(data.typ === 'magisch') {
            magische.push(data);
          } else if(data.typ === 'profan') {
            profane.push(data)
          } else {
            kampf.push(data);
          }
        }
        callback(sonderfertigkeiten);
      }


    )
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

      const obs = this.talentService.getTalentByName(name);
      observableBatch.push(obs);
      obs.subscribe(
        (data: TalentData) => {
          if(data.kategorie === 'Kampf') {
            const atpa = kampfMeta[name];
            let talent: KampfTalent;
            if (atpa === undefined) {
              // Fernkampf Talent
              talent = new KampfTalent(name, lernmethode, value, data.be, fkBasis + value, null, value)
            } else {
              talent = new KampfTalent(name, lernmethode, value, data.be, atpa.at, atpa.pa, value)
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
            const talent = new Talent(lernmethode, name, probe, value, data.be);
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


  private readonly testHeld = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="helden.xsl"?><helden Version="5.5.2"><held key="1504796685848" name="Test" stand="1504813150772"><mods/><basis><geschlecht name="männlich"/><settings name="DSA4.1"/><rasse name="helden.model.rasse.Mittellaender" string="Mittelländer"><groesse gewicht="94" value="194"/><aussehen alter="19" augenfarbe="dunkelbraun" aussehentext0="" aussehentext1="" aussehentext2="" aussehentext3="" familietext0="" familietext1="" familietext2="" familietext3="" familietext4="" familietext5="" gbjahr="1003" gbmonat="2" gbtag="3" gprest="0" gpstart="110" haarfarbe="dunkelblond" kalender="Bosparans Fall" stand="" titel=""/></rasse><kultur name="helden.model.kultur.AndergastNostria" string="Andergast/Nostria"/><ausbildungen><ausbildung art="Hauptprofession" name="helden.model.profession.Magier" string="Arcanes Institut Punin - Metamagie, magische Hellsicht, Kraftlinien, Artefakte" tarnidentitaet=""><variante name="Arcanes Institut Punin - Metamagie, magische Hellsicht, Kraftlinien, Artefakte"/></ausbildung></ausbildungen><verify value="8"/><notiz notiz0="Notizen" notiz1="" notiz10="" notiz11="" notiz2="" notiz3="" notiz4="" notiz5="" notiz6="" notiz7="" notiz8="" notiz9=""/><portraet value=""/><abenteuerpunkte value="5600"/><freieabenteuerpunkte value="4362"/><gilde name="grau"/></basis><eigenschaften><eigenschaft mod="0" name="Mut" startwert="13" value="13"/><eigenschaft mod="0" name="Klugheit" startwert="14" value="14"/><eigenschaft mod="0" name="Intuition" startwert="14" value="14"/><eigenschaft mod="0" name="Charisma" startwert="13" value="13"/><eigenschaft mod="0" name="Fingerfertigkeit" startwert="13" value="13"/><eigenschaft mod="0" name="Gewandtheit" startwert="11" value="11"/><eigenschaft mod="0" name="Konstitution" startwert="11" value="11"/><eigenschaft mod="0" name="Körperkraft" startwert="12" value="12"/><eigenschaft mod="0" name="Sozialstatus" startwert="12" value="12"/><eigenschaft mod="11" name="Lebensenergie" value="0"/><eigenschaft mod="12" name="Ausdauer" value="0"/><eigenschaft grossemeditation="0" mod="18" mrmod="-2" name="Astralenergie" value="0"/><eigenschaft karmalqueste="0" mod="0" name="Karmaenergie" value="0"/><eigenschaft mod="-2" name="Magieresistenz" value="0"/><eigenschaft mod="0" name="ini" value="10"/><eigenschaft mod="0" name="at" value="7"/><eigenschaft mod="0" name="pa" value="7"/><eigenschaft mod="0" name="fk" value="8"/></eigenschaften><vt><vorteil name="Akademische Ausbildung (Magier)"/><vorteil name="Vollzauberer"/><vorteil name="Arroganz" value="7"/><vorteil name="Fettleibig"/><vorteil name="Gesucht" value="3"/><vorteil name="Neugier" value="7"/><vorteil name="Schulden" value="1500"/><vorteil name="Stubenhocker"/><vorteil name="Verpflichtungen"/><vorteil name="Weltfremd bzgl."><auswahl position="0" value="6"/><auswahl position="1" value="gesellschaftliches Leben"/></vorteil></vt><sf><sonderfertigkeit name="Astrale Meditation"/><sonderfertigkeit name="Große Meditation"/><sonderfertigkeit name="Kraftlinienmagie I"/><sonderfertigkeit name="Kulturkunde"><kultur name="Andergast/Nostria"/></sonderfertigkeit><sonderfertigkeit name="Linkhand"/><sonderfertigkeit name="Meister der Improvisation"/><sonderfertigkeit name="Merkmalskenntnis: Hellsicht"/><sonderfertigkeit name="Merkmalskenntnis: Metamagie"/><sonderfertigkeit name="Repräsentation: Magier"/><sonderfertigkeit name="Ritualkenntnis: Gildenmagie"/><sonderfertigkeit name="Rüstungsgewöhnung I"><gegenstand name="Gambeson"/></sonderfertigkeit><sonderfertigkeit name="Rüstungsgewöhnung II"/><sonderfertigkeit name="Stabzauber: Bindung"/><sonderfertigkeit name="Talentspezialisierung Hiebwaffen (Skraja)"><talent name="Hiebwaffen"/><spezialisierung name="Skraja"/></sonderfertigkeit><sonderfertigkeit name="Zauberspezialisierung Analys Arkanstruktur [Magier] (Zauberdauer)"><zauber name="Analys Arkanstruktur" repraesentation="Magier" variante=""/><spezialisierung name="Zauberdauer"/></sonderfertigkeit></sf><ereignisse><ereignis obj="max GP für Helden: 110" text="EINSTELLUNG" time="1504796686377" version="HS 5.5.2"/><ereignis obj="max Eigenschafts-GP für Helden: 100" text="EINSTELLUNG" time="1504796686377" version="HS 5.5.2"/><ereignis obj="max Eigenschafts-Wert für Helden: 14" text="EINSTELLUNG" time="1504796686377" version="HS 5.5.2"/><ereignis obj="Eine größere Menge (560) AP wurde nicht genutzt und dem Helden gut geschrieben" text="Meistergenehmigung notwendig" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Rasse: Mittelländer" text="RKP" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="6 GP" obj="Kultur: Andergast/Nostria" text="RKP" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="30 GP" obj="Profession: Arcanes Institut Punin - Metamagie, magische Hellsicht, Kraftlinien, Artefakte" text="RKP" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="13 GP" obj="Mut: 13" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Klugheit: 14" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Intuition: 14" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="13 GP" obj="Charisma: 13" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="13 GP" obj="Fingerfertigkeit: 13" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Gewandtheit: 11" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Konstitution: 11" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Körperkraft: 11" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="12" kommentar="4 GP" obj="Sozialstatus: 12" text="EIGENSCHAFTEN" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Akademische Ausbildung (Magier)" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Arroganz: 7" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-15 GP" obj="Fettleibig" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-15 GP" obj="Gesucht: 3" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Neugier: 7" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Schulden: 1500" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Stubenhocker" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Verpflichtungen" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Vollzauberer" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Weltfremd bzgl.: gesellschaftliches Leben 6" text="VORTEILE" time="1504796686377" version="HS 5.5.2"/><ereignis Neu="1" obj="Auswahl" text="Abrichten" time="1504796686377" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-300" obj="Linkhand" text="Sonderfertigkeit hinzugefügt" time="1504813134884" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-225" obj="Rüstungsgewöhnung I (Gambeson)" text="Sonderfertigkeit hinzugefügt" time="1504813150772" version="HS 5.5.2"/><ereignis kommentar="[ALLESHELDENSOFTWARE]" obj="Held wurde extern verändert. Änderungskontrolle wieder aktiviert." text="Änderungskontrolle" time="1504813721618" version="HS 5.5.2"/><ereignis Abenteuerpunkte="5040" Alt="560" Neu="5600" text="Abenteuerpunkte" time="1504813730451" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-450" obj="Rüstungsgewöhnung II" text="Sonderfertigkeit hinzugefügt" time="1504813783612" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-9" Alt="1;1;0" Info="Gegenseitiges Lehren" Neu="2;1;0" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504888096197" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-15" Alt="2;1;0" Info="Gegenseitiges Lehren" Neu="3;1;0" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504888096451" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-21" Alt="3;1;0" Info="Gegenseitiges Lehren" Neu="4;1;0" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504888096698" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-28" Alt="4;1;0" Info="Gegenseitiges Lehren" Neu="5;1;0" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504888097246" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-34" Alt="5;1;0" Info="Gegenseitiges Lehren" Neu="6;1;0" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504888097577" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-41" Alt="6;1;0" Info="Gegenseitiges Lehren" Neu="7;1;0" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1504888098116" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-100" obj="Talentspezialisierung Hiebwaffen (Skraja)" text="Sonderfertigkeit hinzugefügt" time="1504888112609" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-15" obj="Zauberspezialisierung Analys Arkanstruktur [Magier] (Zauberdauer)" text="Sonderfertigkeit hinzugefügt" time="1504912040899" version="HS 5.5.2"/></ereignisse><talentliste><talent lernmethode="Gegenseitiges Lehren" name="Dolche" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Hiebwaffen" probe=" (GE/GE/KK)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Raufen" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Ringen" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Säbel" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Speere" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfmesser" probe=" (GE/FF/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfspeere" probe=" (GE/FF/KK)" value="1"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Athletik" probe=" (GE/KO/KK)" value="1"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Klettern" probe=" (MU/GE/KK)" value="0"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Körperbeherrschung" probe=" (MU/IN/GE)" value="0"/><talent be="BE" lernmethode="Gegenseitiges Lehren" name="Schleichen" probe=" (MU/IN/GE)" value="1"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Schwimmen" probe=" (GE/KO/KK)" value="0"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Selbstbeherrschung" probe=" (MU/KO/KK)" value="4"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Sich verstecken" probe=" (MU/IN/GE)" value="1"/><talent be="BE-3" lernmethode="Gegenseitiges Lehren" name="Singen" probe=" (IN/CH/CH)" value="0"/><talent be="0-&gt;BE" lernmethode="Gegenseitiges Lehren" name="Sinnenschärfe" probe=" (KL/IN/IN)" value="2"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Tanzen" probe=" (CH/GE/GE)" value="0"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Zechen" probe=" (IN/KO/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Etikette" probe=" (KL/IN/CH)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Lehren" probe=" (KL/IN/CH)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Menschenkenntnis" probe=" (KL/IN/CH)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Schriftlicher Ausdruck" probe=" (KL/IN/IN)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Überreden" probe=" (MU/IN/CH)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Fährtensuchen" probe=" (KL/IN/KO)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Fallen stellen" probe=" (KL/FF/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Orientierung" probe=" (KL/IN/IN)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Wildnisleben" probe=" (IN/GE/KO)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Geschichtswissen" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Götter und Kulte" probe=" (KL/KL/IN)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Magiekunde" probe=" (KL/KL/IN)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Pflanzenkunde" probe=" (KL/IN/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Philosophie" probe=" (KL/KL/IN)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Rechnen" probe=" (KL/KL/IN)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Rechtskunde" probe=" (KL/KL/IN)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Sagen und Legenden" probe=" (KL/IN/CH)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Sternkunde" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Tierkunde" probe=" (MU/KL/IN)" value="4"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Alt-Imperial/Aureliani" probe=" (KL/IN/CH)" value="4"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Bosparano" probe=" (KL/IN/CH)" value="10"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Garethi" probe=" (KL/IN/CH)" value="12"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Isdira" probe=" (KL/IN/CH)" value="5"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Tulamidya" probe=" (KL/IN/CH)" value="6"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Urtulamidya" probe=" (KL/IN/CH)" value="5"/><talent k="15" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Zhayad" probe=" (KL/IN/CH)" value="5"/><talent k="12" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben (Alt-)Imperiale Zeichen" probe=" (KL/KL/FF)" value="4"/><talent k="10" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Kusliker Zeichen" probe=" (KL/KL/FF)" value="8"/><talent k="10" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Nanduria" probe=" (KL/KL/FF)" value="4"/><talent k="14" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Tulamidya" probe=" (KL/KL/FF)" value="5"/><talent k="16" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Urtulamidya" probe=" (KL/KL/FF)" value="5"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Zhayad" probe=" (KL/KL/FF)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Abrichten" probe=" (MU/IN/CH)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Ackerbau" probe=" (IN/FF/KO)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Alchimie" probe=" (MU/KL/FF)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Wunden" probe=" (KL/CH/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Holzbearbeitung" probe=" (KL/FF/KK)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Kochen" probe=" (KL/IN/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Lederarbeiten" probe=" (KL/FF/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Malen/Zeichnen" probe=" (KL/IN/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Schneidern" probe=" (KL/FF/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Ritualkenntnis: Gildenmagie" probe=" (--/--/--)" value="3"/></talentliste><zauberliste><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Adlerauge Luchsenohr" probe=" (KL/IN/FF)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Analys Arkanstruktur" probe=" (KL/KL/IN)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Applicatus Zauberspeicher" probe=" (KL/FF/FF)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Arcanovi Artefakt" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Attributo" probe=" (KL/CH/**)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Balsam Salabunde" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Band und Fessel" probe=" (KL/CH/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Custodosigil Diebesbann" probe=" (KL/FF/FF)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Destructibo Arcanitas" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Dschinnenruf" probe=" (MU/KL/CH)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Flim Flam Funkel" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Gardianum Zauberschild" probe=" (KL/IN/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Hellsicht trüben" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Illusion auflösen" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Invocatio minor" probe=" (MU/MU/CH)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Memorans Gedächtniskraft" probe=" (KL/KL/IN)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Motoricus" probe=" (KL/FF/KK)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Objectovoco" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Objekt entzaubern" probe=" (KL/IN/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Oculus Astralis" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Odem Arcanum" probe=" (KL/IN/IN)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Penetrizzel Tiefenblick" probe=" (KL/KL/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Pentagramma Sphärenbann" probe=" (MU/MU/CH)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Psychostabilis" probe=" (MU/KL/KO)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Reversalis Revidum" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Unitatio Geistesbund" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Xenographus Schriftenkunde" probe=" (KL/KL/IN)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/></zauberliste><kampf><kampfwerte name="Dolche"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Hiebwaffen"><attacke value="8"/><parade value="7"/></kampfwerte><kampfwerte name="Raufen"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Ringen"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Säbel"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Speere"><attacke value="7"/><parade value="7"/></kampfwerte></kampf><gegenstände><gegenstand anzahl="1" name="Drachenhelm" slot="0"/><gegenstand anzahl="1" name="Gambeson" slot="0"/><gegenstand anzahl="1" name="Großschild" slot="0"/><gegenstand anzahl="1" name="Kettenhemd, Lang" slot="0"/><gegenstand anzahl="1" name="Linkhand" slot="0"/><gegenstand anzahl="1" name="Skraja" slot="0"/><gegenstand anzahl="1" name="Wurfbeil" slot="0"><Fernkampfwaffe><talente kampftalent="Wurfbeile"/></Fernkampfwaffe></gegenstand></gegenstände><BoniWaffenlos/><kommentare><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Bindung" wirkung=""/></kommentare><ausrüstungen><heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="rechts" name="nkwaffe1" schild="0" set="0" slot="0" talent="Hiebwaffen" waffenname="Skraja"/><heldenausruestung name="fkwaffe1" set="0" slot="0" talent="Wurfbeile" waffenname="Wurfbeil"/><heldenausruestung name="schild1" schildname="Großschild" set="0" slot="0" verwendungsArt="Schild"/><heldenausruestung name="schild2" schildname="Linkhand" set="0" slot="0" verwendungsArt="Paradewaffe"/><heldenausruestung name="ruestung1" ruestungsname="Kettenhemd, Lang" set="0" slot="0"/><heldenausruestung name="ruestung2" ruestungsname="Gambeson" set="0" slot="0"/><heldenausruestung name="ruestung3" ruestungsname="Drachenhelm" set="0" slot="0"/><heldenausruestung name="jagtwaffe" nummer="0" set="0"/></ausrüstungen><verbindungen/><extention/><geldboerse/><plugindata/></held><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>XwOWWSupra+u7IP6bc5wFCDhOI8=</DigestValue></Reference></SignedInfo><SignatureValue>DFcP2d783mqM6kpcQ1viPKmugkgC9Aac4OqexxMPbGF8MdHvsTbUCg==</SignatureValue><KeyInfo><KeyValue><DSAKeyValue><P>/KaCzo4Syrom78z3EQ5SbbB4sF7ey80etKII864WF64B81uRpH5t9jQTxeEu0ImbzRMqzVDZkVG9
xD7nN1kuFw==</P><Q>li7dzDacuo67Jg7mtqEm2TRuOMU=</Q><G>Z4Rxsnqc9E7pGknFFH2xqaryRPBaQ01khpMdLRQnG541Awtx/XPaF5Bpsy4pNWMOHCBiNU0Nogps
QW5QvnlMpA==</G><Y>uVrvWkzIbUdL7E80AiD0PJDX3Ck0beY5StXp1wDAA1/ePpemd6rTBNd8YoCzOovNrX016YMcTSiO
iExM4RWtJA==</Y></DSAKeyValue></KeyValue></KeyInfo></Signature></helden>
`



}
