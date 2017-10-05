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
import {isNullOrUndefined} from 'util';
import {LoggingService} from "./logging.service";
import {NameGroupPair} from '../data/NameGroupPair';
import {Heldendataout} from '../data/heldendataout';

@Injectable()
export class HeldenService {

  private _held: Held

  public heldLoaded: EventEmitter<Held> = new EventEmitter();

  constructor(private attributService: AttributService, private talentService: TalentService, private ausruetungsService: AusruestungService,
              private kampftalentService: KampfTalentService, private restService: RestService,
              private sonderfertigkeitenService: SonderfertigkeitenService, private log: LoggingService ) {
    if (!environment.production) {
      this.loadHeldByXML(this.testHeld);
    }

  }

  public getHelden(): Observable<NameGroupPair[]> {
    return this.restService.get('held/names').map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error))
  }

  public getGroups(): Observable<string[]> {
    return this.restService.get('held/groups').map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error))
  }

  public getHeldByName(name: string, password?: string): Observable<Heldendata> {
    let path = 'held/byname/?name=' + name;
    if (password !== undefined && password !== null) {
      path += '&password=' + password;
    }
    return this.restService.get(path).map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error))
  }

  public saveHeld(held: Held, gruppe: string, password: string): Observable<Response> {
    const data: Heldendataout = {
      name: held.name,
      xml: held.xml,
      gruppe: gruppe,
      password: password
    }
    return this.restService.post('held/upload', data);
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

  private loadHeld(xml : string, callback: (held: Held) => void): void {


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
       this.extractAusruestung(xmlDoc, attribute[7].value, talente.kampftalente, attribute[15].value, attribute[16].value,
         attribute[17].value, sonderfertigkeiten, (ausruestung => {
           const ausweichen = this.extractAusweichen(attribute[16].value, ausruestung.sets[0],  sonderfertigkeiten.kampf);
         const hero = new Held(rasse, geschlecht, profession, apTotal, apFree, name, attribute, vorteile, sonderfertigkeiten, kultur,
           groesseGewicht.groesse, groesseGewicht.gewicht, aussehen, talente, ausruestung, ausweichen, xml);
         talente.processBe(ausruestung.sets[0]);
         callback(hero);
       }));

     })


    });

  }

  private extractAusweichen(paBasis: number, ausruestung: AusruestungsSet, kampfSonderfertigkeiten: Sonderfertigkeit[]) : number {
    let ausweichen = paBasis - ausruestung.ruestungsStats.ebe;
    if(this.hasSonderfertigkeit('Ausweichen I', kampfSonderfertigkeiten)) {
      ausweichen += 3;
      if(this.hasSonderfertigkeit('Ausweichen II', kampfSonderfertigkeiten)) {
        ausweichen += 3;
        if(this.hasSonderfertigkeit('Ausweichen III', kampfSonderfertigkeiten)) {
          ausweichen += 3;
        }
      }
    }

    return Math.floor(ausweichen);
  }

  private extractGewichtGroesse(xmlDoc : Document) : any {
    const node = xmlDoc.getElementsByTagName('groesse')[0];
    const gewicht = parseInt(node.getAttribute('gewicht'));
    const groesse = parseInt(node.getAttribute('value'));
    return {gewicht: gewicht, groesse: groesse}

  }

  private extractAussehen(xmlDoc: Document) : Aussehen {
    const node = xmlDoc.getElementsByTagName('aussehen')[0];
    const alter = parseInt(node.getAttribute('alter'));
    const augenfarbe = node.getAttribute('augenfarbe');
    const haarfarbe = node.getAttribute('haarfarbe');
    const gbjahr = parseInt(node.getAttribute('gbjahr'))
    const gbmonat = parseInt(node.getAttribute('gbmonat'))
    const gbtag = parseInt(node.getAttribute('gbtag'))
    const stand = node.getAttribute('stand');
    const titel = node.getAttribute('titel');

    return new Aussehen(alter, augenfarbe, haarfarbe, gbjahr, gbmonat, gbtag, stand, titel );

  }




  private extractKultur(xmlDoc: Document) : string {
    const node = xmlDoc.getElementsByTagName('kultur')[0];
    const kultur = node.getAttribute('string');
    return kultur;
  }

  private extractProfession(xmlDoc: Document):string {
    const node = xmlDoc.getElementsByTagName('ausbildung')[0];
    const professionSub = node.getAttribute('string')

    let professionMain = node.getAttribute('name');

    professionMain = professionMain.substring(professionMain.lastIndexOf('.')+1)

    return professionMain + ': ' + professionSub;
  }

  private extractRasse(xmlDoc: Document): string {
    const node = xmlDoc.getElementsByTagName('rasse')[0];
    const rasse = node.getAttribute('name');
    return rasse.substring(rasse.lastIndexOf('.') + 1)
  }

  private extractGeschlecht(xmlDoc: Document): string {
    const node = xmlDoc.getElementsByTagName('geschlecht')[0];
    const geschlecht = node.getAttribute('name');
    return geschlecht;
  }

  private extractAlter(xmlDoc: Document): number {
    const node = xmlDoc.getElementsByTagName('aussehen')[0];
    const alter = node.getAttribute('alter');
    return parseInt(alter.substring(alter.lastIndexOf('.') + 1))
  }

  private extractApTotal(xmlDoc: Document) : number {
    const node = xmlDoc.getElementsByTagName('abenteuerpunkte')[0];
    const apTotal = node.getAttribute('value');
    return parseInt(apTotal);
  }

  private extractApFree(xmlDoc: Document) : number {
    const node = xmlDoc.getElementsByTagName('freieabenteuerpunkte')[0];
    const apFree = node.getAttribute('value');
    return parseInt(apFree);
  }

  private extractName(xmlDoc: Document) : string {
    const node = xmlDoc.getElementsByTagName('held')[0];
    const name = node.getAttribute('name');
    return name;
  }

  private extractAttribute(xmlDoc: Document) : Attribut[] {
    const nodes = xmlDoc.getElementsByTagName('eigenschaft')
    const attribute = [];
    for (let i = 0; i < nodes.length; i ++) {
      const node = nodes[i];
      const name = node.getAttribute('name');
      let value = parseInt(node.getAttribute('value'));
      const startwert = parseInt(node.getAttribute('startwert'));
      const mod = parseInt(node.getAttribute('mod'));
      if (name !== 'Magieresistenz') {
        value  += mod;
      } else {
        value = 8 + mod ;
      }
      const attShort = this.attributService.getAttributShortcut(name);

      const attribut = new Attribut(name, value, startwert, mod, attShort);
      attribute.push(attribut);
    }
    return attribute;
  }


  private extractAusruestung(xmlDoc: Document, kk: number, kampftalente: KampfTalent[], atBasis: number, paBasis: number, fkBasis: number,  sonderfertigkeiten: Sonderfertigkeiten, callback: (ausruestung: Ausruestung) => void ){

    const nodes = xmlDoc.getElementsByTagName('heldenausruestung');
    const ausruestungen = [];
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    const ret = new Ausruestung(ausruestungen);
    const hasRgw3 = this.hasSonderfertigkeit('Rüstungsgewöhnung III', sonderfertigkeiten.kampf);
    const hasRgw2 = this.hasSonderfertigkeit('Rüstungsgewöhnung II', sonderfertigkeiten.kampf);


    const ausruestungBatch = [];
    for (let i = 0; i < nodes.length ; i++) {
      const node = nodes[i];
      const type = node.getAttribute('name');
      if (type.startsWith('nkwaffe')) {
        ausruestungBatch.push(
          {
            name: node.getAttribute('waffenname'),
            type: 0
          });
      } else if (type.startsWith('fkwaffe')) {
        ausruestungBatch.push(
          {
            name: node.getAttribute('waffenname'),
            type: 1
          });
      } else if (type.startsWith('schild')) {

        const verwendungsArt =
          ausruestungBatch.push(
            {
              name: node.getAttribute('schildname'),
              type: 2
            });
      } else if (type.startsWith('ruestung')) {

        ausruestungBatch.push(
          {
            name: node.getAttribute('ruestungsname'),
            type: 3
          });
      } else if (type.startsWith('jagtwaffe')) {
        // TODO
      } else {
        console.log(node)
        console.error('Ausruestungs typ unbekannt: ' + type);
      }
    }
    this.ausruetungsService.getEquipmentByNameAndType(ausruestungBatch).subscribe(
      (data: any[]) => {


        for (let i = 0; i < nodes.length; i++) {

          const node = nodes[i];
          const set = parseInt(node.getAttribute('set'));
          if (ausruestungBatch[i] === undefined) {
            continue;
          }
          if (data[i] === null) {
            this.log.error('Unable to extract equipment with name: ' + ausruestungBatch[i].name, 'heldenservice.extractAusruestung');
            continue;
          }
          if (ausruestungBatch[i].type === 0 ) {
            ausruestungen[set].waffen.push(this.extractWaffe(node, data[i], atBasis, paBasis, kk, kampftalente));
          } else if (ausruestungBatch[i].type === 1) {
            ausruestungen[set].fernkampfWafffen.push(this.extractFkWaffe(node, data[i], fkBasis, kampftalente));
          }else if (ausruestungBatch[i].type === 2) {
            ausruestungen[set].schilde.push(this.extractSchild(node, data[i], paBasis, sonderfertigkeiten.kampf))
          }else {
            ausruestungen[set].ruestungen.push(this.extractRuestung(data[i], hasRgw2, sonderfertigkeiten.andereSpezialisierungen))
          }
        }
        for (let i = 0; i < ausruestungen.length; i++) {
          let totalRs = 0;
          let totalBe = 0;
          let eBe = 0;
          ausruestungen[i].ruestungen.forEach(ruestung => {
            totalRs += ruestung.stats.rs;
            totalBe += ruestung.stats.ebe;
          })
          if (hasRgw3) {
            eBe = Math.max(0, totalBe - 2.0);
          } else if (hasRgw2) {
            eBe = Math.max(0, totalBe - 1.0);
          } else {
            eBe = totalBe;
          }
          eBe = Math.round(eBe * 10) / 10;



          ausruestungen[i].ruestungsStats = {
            rs: totalRs,
            ebe: eBe,
            be: totalBe
          }

        }

        callback(ret)
      }
    )

  }

  private extractWaffe(node: Element, data: any, atBasis: number, paBasis: number, kk: number, kampftalente: KampfTalent[]): Waffe {
    const waffe = data as Waffe;
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

    if (waffe.tpKK.minKK > kk - waffe.tpKK.mod) {
      const mod = Math.floor((waffe.tpKK.minKK - kk) / waffe.tpKK.mod);
      waffe.at -= mod;
      waffe.pa -= mod;
      waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix -= mod}

    } else {
      const additionalDamage = Math.floor((kk - waffe.tpKK.minKK) / waffe.tpKK.mod);
      waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix + additionalDamage}

    }

    return waffe;
  }

  private extractFkWaffe(node: Element, data: any, fkBasis: number, kampftalente: KampfTalent[]): FernkampfWaffe {
    const waffe = data as FernkampfWaffe;
    const talentName = node.getAttribute('talent');
    const kampfTalent = this.kampftalentService.extractKampftalent(talentName, kampftalente);
    if (kampfTalent === null) {

      this.talentService.getTalentByName(talentName).subscribe(
        (tdata: TalentData) => {
          if (tdata.be === null) {

          } else {

          }
        }
      )
      console.log('TODO: GET BE FROM BACKEND')
      waffe.fk = fkBasis;
    } else {
      waffe.be =  parseInt(kampfTalent.be.substr(2, kampfTalent.be.length))
      waffe.fk = kampfTalent.value + fkBasis;

    }
    return waffe;

  }

  private extractSchild(node: Element, data: any, paBasis: number, kampfsfs: Sonderfertigkeit[]): Schild {
    let bonusPa = 0;
    const schild = data as Schild;

    if (this.hasSonderfertigkeit('Linkhand', kampfsfs)) {
      bonusPa++;
      if (this.hasSonderfertigkeit('Schildkampf I', kampfsfs)) {
        bonusPa += 2;
      }
      console.log('TODO check schildkampf names')
      if (this.hasSonderfertigkeit('Schildkampf II', kampfsfs)) {
        bonusPa += 2;
      }
    }
    schild.pa = paBasis + bonusPa +  schild.wm.pa;

    return schild;
  }

  private extractRuestung(data: any, hasRgw2: boolean, andereSpezialisierungen: Spezialisierung[]): Ruestung {
    const ruestung = data as Ruestung;
    if (!hasRgw2 && this.hasSpezialisierung('Rüstungsgewöhnung I', andereSpezialisierungen, ruestung.name)) {
      ruestung.stats.ebe = Math.max(0, ruestung.stats.ebe = ruestung.stats.be - 1);
    } else {
      ruestung.stats.ebe = ruestung.stats.be;
    }
    return ruestung;
  }

  private hasSpezialisierung(talent: string, spezialisierungen: Spezialisierung[], name: string, representation?: string ): boolean {
    for (let i = 0; i < spezialisierungen.length; i++) {

      if (spezialisierungen[i].talent === talent && spezialisierungen[i].name === name) {
        if (representation === undefined) {
          return true;
        } else if(representation === spezialisierungen[i].representation) {
          return true;
        }

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

  private extractSonderfertigkeiten(xmlDoc: Document, talente: Talente,  callback: (sonderfertigkeiten: Sonderfertigkeiten) => void ) {
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
      if (name.indexOf('(') !== -1 && node.childNodes.length !== 0) {
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
          const talentName = name.substring(22, name.indexOf('(') - 1);
          const spezialisierung = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
          const ts = new Spezialisierung(talentName, spezialisierung);
          talentSpezialisierungen.push(ts);
          talente.findTalentByName(talentName).attachSpezialisierung(ts);

        } else {
          window.alert('Paddi hat einen Fall vergessen! Fallname: ' + name);
        }
      } else if (node.childNodes.length === 1) {
        // Rüstungsgewöhnung oder Kulturkunde
        const spezialisierung = node.firstChild.attributes.getNamedItem('name').value;
        andereSpezialisierungen.push(new Spezialisierung(name, spezialisierung));

      } else {
        requestData.push(name);


      }


    }
    this.sonderfertigkeitenService.getSfsByName(requestData).subscribe(
      (sfs: Sonderfertigkeit[]) => {

        for ( let i = 0; i < sfs.length; i++) {
          const data = sfs[i];
          if (data === null) {
            window.alert('Sonderfertigkeit nicht in der Datenbank vorhanden: ' + requestData[i]);
            continue;
          }
          if (data.typ === 'magisch') {
            magische.push(data);
          } else if (data.typ === 'profan') {
            profane.push(data)
          } else {
            kampf.push(data);
          }
        }
        callback(sonderfertigkeiten);
      }


    )
  }

  private extractTalente(xmlDoc: Document, fkBasis: number, callback: (talente: Talente) => void) {
    const nodes = Array.prototype.slice.call(xmlDoc.getElementsByTagName('talent'), 0);
    let j = nodes.length;
    while ( j--) {
      if (nodes[j].parentElement.tagName !== 'talentliste') {
        nodes.splice(j, 1 );
      }
    }

    // TODO : Talentspezialisiunergen tragen den Tag talent. der fall muss abgefangen werden
    const talente = [];
    const schriftTalente: SprachTalent[] = [];
    const sprachtalente: SprachTalent[] = [];
    const kampftalente: KampfTalent[] = [];
    const observableBatch: Observable<TalentData>[] = [];
    const kampfMeta = this.buildKampfTalente(xmlDoc);
    const talentData: Talente = new Talente(sprachtalente, schriftTalente, talente, kampftalente)
    const requestData = [];

    for ( let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const name = node.getAttribute('name');

      requestData.push(name);
    }
    this.talentService.getTalenteByName(requestData).subscribe(
      (dataArr: TalentData[]) => {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const name = node.getAttribute('name');
          const data = dataArr[i];
          if (data === null) {
            window.alert('Talent nicht in der Datenbank gefunden. Bitte kontaktieren sie ' +
              'ihren lokale vertrauenswürdigen Entwickler ' + name)
            continue;
          }
          const lernmethode = node.getAttribute('lernmethode');
          const probe = node.getAttribute('probe');
          const value = parseInt(node.getAttribute('value'));


          if (data.kategorie === 'Kampf') {
            const atpa = kampfMeta[name];
            let talent: KampfTalent;
            if (atpa === undefined) {
              // Fernkampf Talent
              talent = new KampfTalent(name, lernmethode, value, data.be, fkBasis + value, null, value)
            } else {
              talent = new KampfTalent(name, lernmethode, value, data.be, atpa.at, atpa.pa, value)
            }

            kampftalente.push(talent);
          } else if (data.kategorie === 'Sprachen') {
            const talent: SprachTalent =  data as SprachTalent;
            talent.value = value;
            sprachtalente.push(talent);

          } else if (data.kategorie === 'Schrift') {
            const talent: SprachTalent =  data as SprachTalent;
            talent.value = value;
            schriftTalente.push(talent);
          } else {
            const talent = new Talent(lernmethode, name, probe, value, data.be);
            talent.komplexitaet = data.komplexitaet;
            talent.kategorie = data.kategorie;
            talente.push(talent);

          }

          }
        callback(talentData);
        })
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


  private readonly testHeld = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="helden.xsl"?><helden Version="5.5.2"><held key="1499118035891" name="Jora Bjarnison" stand="1504461501472"><mods/><basis><geschlecht name="männlich"/><settings name="DSA4.1"/><rasse name="helden.model.rasse.Thorwaler" string="Thorwaler"><groesse gewicht="86" value="181"/><aussehen alter="21" augenfarbe="blau" aussehentext0="" aussehentext1="" aussehentext2="" aussehentext3="" familietext0="" familietext1="" familietext2="" familietext3="" familietext4="" familietext5="" gbjahr="1003" gbmonat="5" gbtag="4" gprest="0" gpstart="110" haarfarbe="rotblond" kalender="Bosparans Fall" stand="" titel=""/><variante name="Thorwaler"/></rasse><kultur name="helden.model.kultur.Thorwal" string="Thorwal"><variante name="Thorwal"/></kultur><ausbildungen><ausbildung art="Hauptprofession" name="helden.model.profession.Magier" string="Halle des Windes zu Olport" tarnidentitaet=""><variante name="Halle des Windes zu Olport"/></ausbildung></ausbildungen><verify value="1"/><notiz notiz0="Notizen" notiz1="" notiz10="" notiz11="" notiz2="" notiz3="" notiz4="" notiz5="" notiz6="" notiz7="" notiz8="" notiz9=""/><portraet value=""/><abenteuerpunkte value="2060"/><freieabenteuerpunkte value="23"/><gilde name="keine"/></basis><eigenschaften><eigenschaft mod="1" name="Mut" startwert="12" value="12"/><eigenschaft mod="0" name="Klugheit" startwert="14" value="14"/><eigenschaft mod="0" name="Intuition" startwert="14" value="14"/><eigenschaft mod="0" name="Charisma" startwert="12" value="12"/><eigenschaft mod="0" name="Fingerfertigkeit" startwert="11" value="11"/><eigenschaft mod="0" name="Gewandtheit" startwert="14" value="15"/><eigenschaft mod="1" name="Konstitution" startwert="11" value="11"/><eigenschaft mod="1" name="Körperkraft" startwert="12" value="12"/><eigenschaft mod="0" name="Sozialstatus" startwert="5" value="5"/><eigenschaft mod="11" name="Lebensenergie" value="0"/><eigenschaft mod="12" name="Ausdauer" value="0"/><eigenschaft grossemeditation="0" mod="18" mrmod="-3" name="Astralenergie" value="0"/><eigenschaft karmalqueste="0" mod="0" name="Karmaenergie" value="0"/><eigenschaft mod="-3" name="Magieresistenz" value="0"/><eigenschaft mod="0" name="ini" value="11"/><eigenschaft mod="0" name="at" value="8"/><eigenschaft mod="0" name="pa" value="8"/><eigenschaft mod="0" name="fk" value="8"/></eigenschaften><vt><vorteil name="Akademische Ausbildung (Magier)"/><vorteil name="Vollzauberer"/><vorteil name="Aberglaube" value="5"/><vorteil name="Arroganz" value="5"/><vorteil name="Artefaktgebunden"/><vorteil name="Autoritätsgläubig" value="8"/><vorteil name="Hitzeempfindlichkeit"/><vorteil name="Impulsiv"/><vorteil name="Jähzorn" value="6"/><vorteil name="Neugier" value="7"/><vorteil name="Randgruppe"/><vorteil name="Sucht" value="Alkohol (6)"/></vt><sf><sonderfertigkeit name="Astrale Meditation"/><sonderfertigkeit name="Beidhändiger Kampf I"/><sonderfertigkeit name="Beidhändiger Kampf II"/><sonderfertigkeit name="Fernzauberei"/><sonderfertigkeit name="Große Meditation"/><sonderfertigkeit name="Kulturkunde"><kultur name="Thorwal"/></sonderfertigkeit><sonderfertigkeit name="Linkhand"/><sonderfertigkeit name="Merkmalskenntnis: Elementar (Luft)"/><sonderfertigkeit name="Merkmalskenntnis: Umwelt"/><sonderfertigkeit name="Regeneration I"/><sonderfertigkeit name="Repräsentation: Magier"/><sonderfertigkeit name="Ritualkenntnis: Gildenmagie"/><sonderfertigkeit name="Stabzauber: Bindung"/><sonderfertigkeit name="Stabzauber: Fackel"/><sonderfertigkeit name="Talentspezialisierung Hiebwaffen (Skraja)"><talent name="Hiebwaffen"/><spezialisierung name="Skraja"/></sonderfertigkeit><sonderfertigkeit name="Wuchtschlag"/><verbilligtesonderfertigkeit name="Merkmalskenntnis: Elementar (Wasser)"/></sf><ereignisse><ereignis obj="max GP für Helden: 110" text="EINSTELLUNG" time="1499118036689" version="HS 5.5.2"/><ereignis obj="max Eigenschafts-GP für Helden: 100" text="EINSTELLUNG" time="1499118036689" version="HS 5.5.2"/><ereignis obj="max Eigenschafts-Wert für Helden: 14" text="EINSTELLUNG" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="5 GP" obj="Rasse: Thorwaler" text="RKP" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="4 GP" obj="Kultur: Thorwal" text="RKP" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="29 GP" obj="Profession: Halle des Windes zu Olport" text="RKP" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="12 GP" obj="Mut: 13" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Klugheit: 14" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Intuition: 14" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="12" kommentar="12 GP" obj="Charisma: 12" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Fingerfertigkeit: 11" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Gewandtheit: 14" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="12" kommentar="11 GP" obj="Konstitution: 12" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="13" kommentar="12 GP" obj="Körperkraft: 13" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="0 GP" obj="Sozialstatus: 5" text="EIGENSCHAFTEN" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="17 AP" obj="Hiebwaffen: 4" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="22 AP" obj="Hiebwaffen: 5" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="27 AP" obj="Hiebwaffen: 6" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="21 AP" obj="Ritualkenntnis: Gildenmagie: 4" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="28 AP" obj="Ritualkenntnis: Gildenmagie: 5" text="TALENT" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="12 AP" obj="Fortifex arkane Wand [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="17 AP" obj="Fortifex arkane Wand [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="2 AP" obj="Aeolitus Windgebraus [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="4 AP" obj="Aeolitus Windgebraus [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Aeolitus Windgebraus [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="4 AP" obj="Flim Flam Funkel [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Flim Flam Funkel [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Silentium [Magier] (HZ): 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="6 AP" obj="Silentium [Magier] (HZ): 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="5 AP" obj="Windstille [Magier] (HZ): 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="6 AP" obj="Windstille [Magier] (HZ): 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="8" kommentar="8 AP" obj="Windstille [Magier] (HZ): 8" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="9" kommentar="9 AP" obj="Windstille [Magier] (HZ): 9" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="10" kommentar="11 AP" obj="Windstille [Magier] (HZ): 10" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="7 AP" obj="Solidirid Weg aus Licht [Magier] (HZ): 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="8 AP" obj="Solidirid Weg aus Licht [Magier] (HZ): 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="8 AP" obj="Adlerauge Luchsenohr [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="11 AP" obj="Adlerauge Luchsenohr [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="1 AP" obj="Orcanofaxius Luftstrahl [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="1 AP" obj="Orcanofaxius Luftstrahl [Magier]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="2 AP" obj="Orcanofaxius Luftstrahl [Magier]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="3 AP" obj="Orcanofaxius Luftstrahl [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="8 AP" obj="Orcanofaxius Luftstrahl [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="11 AP" obj="Orcanofaxius Luftstrahl [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="14 AP" obj="Orcanofaxius Luftstrahl [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="2 AP" obj="Pfeil der Luft [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="8 AP" obj="Wellenlauf [Druide]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="6 AP" obj="Wellenlauf [Druide]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="14 AP" obj="Wellenlauf [Druide]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="22 AP" obj="Wellenlauf [Druide]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="2 AP" obj="Mahlstrom [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="2 AP" obj="Mahlstrom [Magier]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="4 AP" obj="Mahlstrom [Magier]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="9 AP" obj="Mahlstrom [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="13 AP" obj="Mahlstrom [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="5" kommentar="17 AP" obj="Mahlstrom [Magier]: 5" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="6" kommentar="21 AP" obj="Mahlstrom [Magier]: 6" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="7" kommentar="25 AP" obj="Mahlstrom [Magier]: 7" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="3 AP" obj="Hartes schmelze! [Magier]: 0" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="1" kommentar="2 AP" obj="Hartes schmelze! [Magier]: 1" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="2" kommentar="6 AP" obj="Hartes schmelze! [Magier]: 2" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="3" kommentar="9 AP" obj="Hartes schmelze! [Magier]: 3" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="4" kommentar="13 AP" obj="Hartes schmelze! [Magier]: 4" text="ZAUBER" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="6 GP" obj="Linkhand" text="SF" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="38 AP" obj="Regeneration I" text="SF" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="56 AP" obj="Stabzauber: Fackel" text="SF" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Aberglaube: 5" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Akademische Ausbildung (Magier)" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Arroganz: 5" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-7 GP" obj="Artefaktgebunden" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-4 GP" obj="Autoritätsgläubig: 8" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-7 GP" obj="Hitzeempfindlichkeit" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Impulsiv" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Jähzorn: 6" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Neugier: 7" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Randgruppe" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="-6 GP" obj="Sucht: Alkohol (6)" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Vollzauberer" text="VORTEILE" time="1499118036689" version="HS 5.5.2"/><ereignis Abenteuerpunkte="1500" kommentar=" Gesamt AP: 1500 Verfügbare AP: 1500" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1499118055799" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-410" Alt="14" Neu="15" obj="Gewandtheit" text="Eigenschaft steigern" time="1499118071645" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-100" obj="Beidhändiger Kampf I" text="Sonderfertigkeit hinzugefügt" time="1499118080722" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-400" obj="Beidhändiger Kampf II" text="Sonderfertigkeit hinzugefügt" time="1499118081941" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-200" obj="Wuchtschlag" text="Sonderfertigkeit hinzugefügt" time="1499118426910" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-41" Alt="6;5;1" Info="Selbststudium" Neu="7;5;1" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1499119058646" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-160" obj="Talentspezialisierung Hiebwaffen (Skraja)" text="Sonderfertigkeit hinzugefügt" time="1499119079311" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-48" Alt="7;5;1" Info="Selbststudium" Neu="8;5;1" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1499119085645" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-55" Alt="8;5;1" Info="Selbststudium" Neu="9;5;1" obj="Hiebwaffen" text="Nahkampftalent steigern" time="1499119086693" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Boote fahren" text="Talent steigern" time="1499119111799" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-21" Alt="5" Info="Selbststudium" Neu="6" obj="Boote fahren" text="Talent steigern" time="1499119112331" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="Selbststudium" Neu="7" obj="Boote fahren" text="Talent steigern" time="1499119113301" version="HS 5.5.2"/></ereignisse><talentliste><talent lernmethode="Gegenseitiges Lehren" name="Dolche" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Selbststudium" name="Hiebwaffen" probe=" (GE/GE/KK)" value="9"/><talent lernmethode="Gegenseitiges Lehren" name="Raufen" probe=" (GE/GE/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Ringen" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Säbel" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfbeile" probe=" (GE/FF/KK)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfmesser" probe=" (GE/FF/KK)" value="0"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Athletik" probe=" (GE/KO/KK)" value="2"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Klettern" probe=" (MU/GE/KK)" value="1"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Körperbeherrschung" probe=" (MU/IN/GE)" value="2"/><talent be="BE" lernmethode="Gegenseitiges Lehren" name="Schleichen" probe=" (MU/IN/GE)" value="0"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Schwimmen" probe=" (GE/KO/KK)" value="5"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Selbstbeherrschung" probe=" (MU/KO/KK)" value="3"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Sich verstecken" probe=" (MU/IN/GE)" value="0"/><talent be="BE-3" lernmethode="Gegenseitiges Lehren" name="Singen" probe=" (IN/CH/CH)" value="1"/><talent be="0-&gt;BE" lernmethode="Gegenseitiges Lehren" name="Sinnenschärfe" probe=" (KL/IN/IN)" value="4"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Tanzen" probe=" (CH/GE/GE)" value="0"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Zechen" probe=" (IN/KO/KK)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Lehren" probe=" (KL/IN/CH)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Menschenkenntnis" probe=" (KL/IN/CH)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Überreden" probe=" (MU/IN/CH)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Fährtensuchen" probe=" (KL/IN/KO)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Fesseln/Entfesseln" probe=" (FF/GE/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Fischen/Angeln" probe=" (IN/FF/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Orientierung" probe=" (KL/IN/IN)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Wettervorhersage" probe=" (KL/IN/IN)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Wildnisleben" probe=" (IN/GE/KO)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Geografie" probe=" (KL/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Geschichtswissen" probe=" (KL/KL/IN)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Götter und Kulte" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Magiekunde" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Pflanzenkunde" probe=" (KL/IN/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Rechnen" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Rechtskunde" probe=" (KL/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Sagen und Legenden" probe=" (KL/IN/CH)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Sternkunde" probe=" (KL/KL/IN)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Tierkunde" probe=" (MU/KL/IN)" value="1"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Bosparano" probe=" (KL/IN/CH)" value="4"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Garethi" probe=" (KL/IN/CH)" value="10"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Hjaldingsch" probe=" (KL/IN/CH)" value="8"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Isdira" probe=" (KL/IN/CH)" value="4"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Thorwalsch" probe=" (KL/IN/CH)" value="16"/><talent k="16" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Hjaldingsche Runen" probe=" (KL/KL/FF)" value="8"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Isdira/Asdharia" probe=" (KL/KL/FF)" value="4"/><talent k="10" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Kusliker Zeichen" probe=" (KL/KL/FF)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Alchimie" probe=" (MU/KL/FF)" value="2"/><talent lernmethode="Selbststudium" name="Boote fahren" probe=" (GE/KO/KK)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Krankheiten" probe=" (MU/KL/CH)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Wunden" probe=" (KL/CH/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Holzbearbeitung" probe=" (KL/FF/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Kochen" probe=" (KL/IN/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Lederarbeiten" probe=" (KL/FF/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Malen/Zeichnen" probe=" (KL/IN/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Schneidern" probe=" (KL/FF/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Seefahrt" probe=" (FF/GE/KK)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Ritualkenntnis: Gildenmagie" probe=" (--/--/--)" value="5"/></talentliste><zauberliste><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Adlerauge Luchsenohr" probe=" (KL/IN/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Aeolitus Windgebraus" probe=" (KL/CH/KO)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Armatrutz" probe=" (IN/GE/KO)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Attributo" probe=" (KL/CH/**)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Balsam Salabunde" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Elementarbann" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Elementarer Diener" probe=" (MU/KL/CH)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Flim Flam Funkel" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Fortifex arkane Wand" probe=" (IN/KO/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Frigifaxius Eisstrahl" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Hartes schmelze!" probe=" (MU/KL/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Mahlstrom" probe=" (MU/IN/KK)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Manifesto Element" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Nebelwand und Morgendunst" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Gegenseitiges Lehren" name="Odem Arcanum" probe=" (KL/IN/IN)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Orcanofaxius Luftstrahl" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Pfeil der Luft" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="0" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Silentium" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Solidirid Weg aus Licht" probe=" (IN/KO/KK)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" Gauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Wellenlauf" probe=" (MU/GE/GE)" reichweite="" repraesentation="Druide" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="E" kosten="" lernmethode="Gegenseitiges Lehren" name="Wettermeisterschaft" probe=" (MU/CH/GE)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Windhose" probe=" (MU/IN/KK)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Windstille" probe=" (KL/CH/KK)" reichweite="" repraesentation="Magier" value="10" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/></zauberliste><kampf><kampfwerte name="Dolche"><attacke value="9"/><parade value="8"/></kampfwerte><kampfwerte name="Hiebwaffen"><attacke value="15"/><parade value="10"/></kampfwerte><kampfwerte name="Raufen"><attacke value="11"/><parade value="8"/></kampfwerte><kampfwerte name="Ringen"><attacke value="8"/><parade value="8"/></kampfwerte><kampfwerte name="Säbel"><attacke value="8"/><parade value="8"/></kampfwerte></kampf>
<gegenstände>
	<gegenstand anzahl="1" name="Dicke Kleidung" slot="0"/>
	<gegenstand anzahl="1" name="Gambeson" slot="0"/>
	<gegenstand anzahl="1" name="Skraja" slot="0"/><gegenstand anzahl="1" name="Skraja" slot="1"/>
	<gegenstand anzahl="1" name="Wattierte Kappe" slot="0"/>
</gegenstände>
<BoniWaffenlos/><kommentare><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Bindung" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Fackel" wirkung=""/></kommentare>
<ausrüstungen>
<heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="rechts" name="nkwaffe1" schild="0" set="0" slot="0" talent="Hiebwaffen" waffenname="Skraja"/>
<heldenausruestung bezeichner="" bfakt="4" bfmin="4" hand="links" name="nkwaffe2" schild="0" set="0" slot="0" talent="Hiebwaffen" waffenname="Skraja"/>
<heldenausruestung name="bk12" set="0"/>
	<heldenausruestung name="ruestung1" ruestungsname="Gambeson" set="0" slot="0"/>
	<heldenausruestung name="ruestung2" ruestungsname="Dicke Kleidung" set="0" slot="0"/>
	<heldenausruestung name="ruestung3" ruestungsname="Wattierte Kappe" set="0" slot="0"/>
	<heldenausruestung name="jagtwaffe" nummer="0" set="0"/>
	<heldenausruestung name="ruestung1" ruestungsname="Gambeson" set="1" slot="0"/>
	<heldenausruestung name="ruestung2" ruestungsname="Wattierte Kappe" set="1" slot="0"/>
	<heldenausruestung name="jagtwaffe" nummer="0" set="1"/>
</ausrüstungen><verbindungen/><extention/><geldboerse/><plugindata/></held><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>RdaDB2tPygSshxvbwGLETvYJmMw=</DigestValue></Reference></SignedInfo><SignatureValue>aY2+nR/lFe/nCFXuydztK/Z+/Kk7/Vvmx0sHO9mSj/8mKrYfQ48M0Q==</SignatureValue><KeyInfo><KeyValue><DSAKeyValue><P>/KaCzo4Syrom78z3EQ5SbbB4sF7ey80etKII864WF64B81uRpH5t9jQTxeEu0ImbzRMqzVDZkVG9
xD7nN1kuFw==</P><Q>li7dzDacuo67Jg7mtqEm2TRuOMU=</Q><G>Z4Rxsnqc9E7pGknFFH2xqaryRPBaQ01khpMdLRQnG541Awtx/XPaF5Bpsy4pNWMOHCBiNU0Nogps
QW5QvnlMpA==</G><Y>uVrvWkzIbUdL7E80AiD0PJDX3Ck0beY5StXp1wDAA1/ePpemd6rTBNd8YoCzOovNrX016YMcTSiO
iExM4RWtJA==</Y></DSAKeyValue></KeyValue></KeyInfo></Signature></helden>
`



}
