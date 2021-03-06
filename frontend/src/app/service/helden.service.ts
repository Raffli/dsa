import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Response} from '@angular/http'
import {Held} from '../data/held';
import {Attribut} from '../data/attribut';
import {Vorteil} from '../data/vorteil';
import {Sonderfertigkeit} from '../data/sonderfertigkeit';
import {Talent, talentFactory} from '../data/talent';
import {Lernmethode} from '../data/enums/lernmethode';
import {AttributService} from './attribut.service';
import {TalentService} from './talent.service';
import {TalentData} from '../data/talentdata';
import {Observable, Observer} from 'rxjs/Rx'
import {Aussehen} from '../data/aussehen';
import {SprachTalent} from '../data/sprachtalent';
import {KampfTalent, kampfTalentFactory} from '../data/kampftalent';
import {Talente} from '../data/talente';
import {AtPaPair} from '../data/AtPaPair';
import {Ausruestung} from '../data/ausruestung/Ausruestung';
import {AusruestungService} from './ausruestung.service';
import {Waffe} from '../data/ausruestung/Waffe';
import {Hand} from '../data/ausruestung/Hand';
import {AusruestungsSet} from '../data/ausruestung/AusruestungsSet';
import {KampfTalentService} from './kampf-talent.service';
import {FernkampfWaffe} from '../data/ausruestung/FernkampfWaffe';
import {Schild} from '../data/ausruestung/Schild';
import {Ruestung} from '../data/ausruestung/Ruestung';
import {environment} from '../../environments/environment';
import {RestService} from './rest.service';
import {Heldendata} from '../data/heldendata';
import {Sonderfertigkeiten} from '../data/Sonderfertigkeiten';
import {Spezialisierung} from '../data/Spezialisierung';
import {SonderfertigkeitenService} from './sonderfertigkeiten.service';
import {isNullOrUndefined} from 'util';
import {LoggingService} from './logging.service';
import {NameGroupPair} from '../data/NameGroupPair';
import {Heldendataout} from '../data/heldendataout';
import {RuestungStats} from '../data/ausruestung/RuestungStats';
import {Ereignis} from '../data/Ereignis';
import {Zauber, zauberFactory} from '../data/Zauber';
import {skip} from 'rxjs/operator/skip';
import {Schaden} from '../data/ausruestung/schaden';
import {MessageService} from './message.service';
import {UploadInfo} from '../data/UploadInfo';

@Injectable()
export class HeldenService {

  private _held: Held

  public heldLoaded: EventEmitter<Held> = new EventEmitter();

  constructor(private attributService: AttributService,
              private talentService: TalentService,
              private ausruetungsService: AusruestungService,
              private kampftalentService: KampfTalentService,
              private restService: RestService,
              private sonderfertigkeitenService: SonderfertigkeitenService,
              private log: LoggingService, private messageService: MessageService ) {
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

  public getUploadInfos(): Observable<UploadInfo[]> {
    return this.restService.get('held/uploads').map((response: Response) => response.json());
  }

  public updateHeld(name: string, downloadLink: string): Observable<Heldendata> {
    return this.restService.get('held/update?name=' + name + '&downloadLink=' + downloadLink).map((response: Response) => response.json());

  }



  public saveHeld(held: Held, gruppe: string, password: string): Observable<Response> {
    while(held.name[held.name.length-1] == ' ') {
      held.name = held.name.substring(0, held.name.length-1);
      console.log(held.name)
    }
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
      this.messageService.info('Lade held: ' + name)

    const attribute = this.extractAttribute(xmlDoc);
    const vorteile = this.extractVorteile(xmlDoc);
    const lep = this.extractLep(attribute, xmlDoc);
    const aup = this.extractAup(attribute, xmlDoc);
    const ereignisse = this.extractEreignisse(xmlDoc);
    const kultur = this.extractKultur(xmlDoc);
    const groesseGewicht = this.extractGewichtGroesse(xmlDoc);
    const aussehen = this.extractAussehen(xmlDoc);
    this.extractTalente(xmlDoc, attribute[17].value, (talente: Talente) => {

      this.extractSonderfertigkeiten(xmlDoc, talente, (sonderfertigkeiten: Sonderfertigkeiten) => {
        this.extractAusruestung(xmlDoc, attribute[7].value, talente.kampftalente, attribute[15].value, attribute[16].value,
          attribute[17].value, sonderfertigkeiten, (ausruestung => {
            const ausweichen = this.extractAusweichen(attribute[16].value,
              ausruestung.sets[0],  sonderfertigkeiten.kampf);
            const hero = new Held(rasse, geschlecht, profession, apTotal, apFree, name, attribute,
              vorteile, sonderfertigkeiten, kultur, groesseGewicht.groesse, groesseGewicht.gewicht,
              aussehen, talente, ausruestung, ausweichen, xml, ereignisse, lep, aup);
            this.processBe(talente, ausruestung.sets[0])
            callback(hero)
          }));
      })
    });

  }

  private extractLep(attribute: Attribut[], doc: XMLDocument): number {
    const ko = attribute[Attribut.Konstitution].value;
    const kk = attribute[Attribut.Körperkraft].value;
    const leMods = attribute[Attribut.Lebensenergie];
    // TODO Vorteile
    return Math.round((ko + ko + kk) /2 + leMods.value);
  }

  private extractAup(attribute: Attribut[], doc: XMLDocument): number {
    const mu = attribute[Attribut.MUT].value;
    const ko = attribute[Attribut.Konstitution].value;
    const ge = attribute[Attribut.Gewandhteit].value;
    const auMods = attribute[Attribut.Ausdauer];
    // TODO Vorteile
    return Math.round((mu + ko + ge) / 2 + auMods.value);
  }


  private extractZauber(doc: XMLDocument): Zauber[] {
    const nodes = Array.prototype.slice.call(doc.getElementsByTagName('zauber'), 0);
    let j = nodes.length;
    while ( j--) {
      if (nodes[j].parentElement.tagName !== 'zauberliste') {
        nodes.splice(j, 1 );
      }
    }
    const result = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const hauszauber = node.getAttribute('hauszauber') === 'true';
      const komplexitaet = node.getAttribute('k')
      const lernmethode = node.getAttribute('lernmethode')
      const value = parseInt(node.getAttribute('value'), 10);
      const name = node.getAttribute('name')
      const probe = node.getAttribute('probe')
      const repraesentation = node.getAttribute('repraesentation')
      const zauber = zauberFactory(name, value, lernmethode, '0', komplexitaet, hauszauber, repraesentation, probe)

      result.push(zauber);
    }
    return result;
  }

  public processBe(talente: Talente,  ausruestung: AusruestungsSet) {
    const eBe = Math.round(ausruestung.ruestungsStats.ebe);
    talente.talente.forEach(talent => this.talentService.calculateEtaw(eBe, talent))
    talente.kampftalente.forEach(talent => this.talentService.calculateEtawWithATPA(eBe, talent))
  }

  private extractAusweichen(paBasis: number, ausruestung: AusruestungsSet, kampfSonderfertigkeiten: Sonderfertigkeit[]) : number {
    let ausweichen = paBasis
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

  private extractGewichtGroesse(xmlDoc: Document): any {
    const node = xmlDoc.getElementsByTagName('groesse')[0];
    const gewicht = parseInt(node.getAttribute('gewicht'), 10);
    const groesse = parseInt(node.getAttribute('value'), 10);
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

  private extractEreignisse(xmlDoc: Document): Ereignis[] {
    const nodes = xmlDoc.getElementsByTagName('ereignis')
    const ereignisse: Ereignis[] = [];
    for (let i = 0; i < nodes.length; i ++) {
      const node = nodes[i];
      //console.log(node);
      const ap = parseInt(node.getAttribute('Abenteuerpunkte'),10); //Optional
      const lernmethode = node.getAttribute('Info'); //Optional
      const datum = new Date(parseInt(node.getAttribute('time'),10))
      const alterWert = parseInt(node.getAttribute('Alt'),10); //Optional
      const neuerWert = parseInt(node.getAttribute('Neu'),10); //Optional
      const text = node.getAttribute('text');
      const kommentar = node.getAttribute('kommentar'); //Optional
      const obj = node.getAttribute('obj');

      const ereignis: Ereignis = {
        text: text,
        datum: datum,
        obj: obj
      }
      if(!Number.isNaN(ap)) ereignis.ap = ap;
      if(kommentar !== null) ereignis.kommentar = kommentar;
      if(lernmethode !== null) ereignis.lernmethode = lernmethode;
      if(!Number.isNaN(alterWert)) ereignis.alterWert = alterWert;
      if(!Number.isNaN(neuerWert)) ereignis.neuerWert = neuerWert;
      ereignisse.push(ereignis)

    }

    return ereignisse;

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


  private extractAusruestung(xmlDoc: Document, kk: number, kampftalente: KampfTalent[], atBasis: number, paBasis: number, fkBasis: number,  sonderfertigkeiten: Sonderfertigkeiten, callback: (ausruestung: Ausruestung) => void ) {
    const nodes = xmlDoc.getElementsByTagName('heldenausruestung');
    const ausruestungen = [];
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    ausruestungen.push(new AusruestungsSet());
    const ret = new Ausruestung(ausruestungen);
    const hasRgw3 = this.hasSonderfertigkeit('Rüstungsgewöhnung III', sonderfertigkeiten.kampf);
    const hasRgw2 = this.hasSonderfertigkeit('Rüstungsgewöhnung II', sonderfertigkeiten.kampf);
    const ausruestungBatch = [];
    const skipIndex: { [key: number]: boolean; } = {};
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
        skipIndex[i] = true;
      } else {
        skipIndex[i] = true;
      }
    }
    if (ausruestungBatch.length === 0) {
      this.calculateRuestungRSBE(ausruestungen, hasRgw3, hasRgw2)
      callback(ret);
      return;
    }
    this.ausruetungsService.getEquipmentByNameAndType(ausruestungBatch).subscribe(
      (data: any[]) => {
        let index = 0;
        for (let i = 0; i < nodes.length; i++) {
          if (skipIndex[i]) {
            continue;
          }
          const node = nodes[i];
          const set = parseInt(node.getAttribute('set'), 10);

          if (data[index] === null) {
            console.log(index + ' ' + i)
            index++;
            continue;
          }
          if (ausruestungBatch[index].type === 0 ) {
            ausruestungen[set].waffen.push(this.extractWaffe(node, data[index], atBasis, paBasis, kk, kampftalente));
          } else if (ausruestungBatch[index].type === 1) {
            ausruestungen[set].fernkampfWafffen.push(this.extractFkWaffe(node, data[index], fkBasis, kampftalente));
          }else if (ausruestungBatch[index].type === 2) {
            ausruestungen[set].schilde.push(this.extractSchild(node, data[index], paBasis, sonderfertigkeiten.kampf))
          }else {
            ausruestungen[set].ruestungen.push(this.extractRuestung(data[index], hasRgw2, sonderfertigkeiten.andereSpezialisierungen))
          }
          index++;
        }
        this.calculateRuestungRSBE(ausruestungen, hasRgw3, hasRgw2)

        callback(ret)
      }
    )

  }

  private calculateRuestungRSBE(ausruestungen: AusruestungsSet[], hasRgw3: boolean, hasRgw2: boolean) {
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
      } as RuestungStats;

    }
  }

  private extractWaffe(node: Element, data: any, atBasis: number, paBasis: number, kk: number, kampftalente: KampfTalent[]): Waffe {
    const talentName = node.getAttribute('talent');
    const waffe = data as Waffe;

    if (node.getAttribute('hand') === 'links') {
      waffe.hand = Hand.links;
    } else {
      waffe.hand = Hand.rechts
    }
    const kampfTalent = this.kampftalentService.extractKampftalent(talentName, kampftalente);

    if (kampfTalent === null) {
      console.log('unlearned talent: ' + talentName)
      waffe.at = atBasis + waffe.wm.at;
      waffe.pa = paBasis + waffe.wm.pa;
    } else {
      waffe.at = kampfTalent.at + waffe.wm.at;
      waffe.pa = kampfTalent.pa + waffe.wm.pa;
      waffe.be = parseInt(kampfTalent.be.substr(2, kampfTalent.be.length));
     if(this.talentService.hasSpezialisierungFor(waffe.name, kampfTalent)) {
       waffe.at ++;
       waffe.pa ++;
     }
    }

    if (waffe.tpKK.minKK > kk - waffe.tpKK.mod) {
      const mod = Math.floor((waffe.tpKK.minKK - kk) / waffe.tpKK.mod);
      waffe.at -= mod;
      waffe.pa -= mod;
      waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix -= mod} as Schaden;

    } else {
      const additionalDamage = Math.floor((kk - waffe.tpKK.minKK) / waffe.tpKK.mod);
      waffe.totalSchaden = {w6: waffe.schaden.w6, fix: waffe.schaden.fix + additionalDamage} as Schaden;

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
        } else if (representation === spezialisierungen[i].representation) {
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
        // Talent / Zauberspezialisierung
        const type = node.childNodes[0].nodeName;
        if (type === 'zauber') {
          const zauberName = name.substring(22, name.indexOf('[')- 1);
          const representation = name.substring(name.indexOf('[') + 1, name.indexOf(']'));
          const spezialisierung = name.substring(name.indexOf('(') + 1, name.indexOf(')'));

          const zs = new Spezialisierung(zauberName, spezialisierung, representation);

          zauberSpezialisierungen.push(zs)
          const zauber = this.talentService.findTalentByName(zs.talent, talente.zauber);
          this.talentService.attachSpezialisierung(zs, zauber);
        } else if (type === 'talent') {
          const talentName = name.substring(22, name.indexOf('(') - 1);
          const spezialisierung = name.substring(name.indexOf('(') + 1, name.indexOf(')'));
          const ts = new Spezialisierung(talentName, spezialisierung);
          talentSpezialisierungen.push(ts);

          let talent = this.talentService.findTalentByName(talentName, talente.talente);
          if(talent === null) {
            talent = this.talentService.findTalentByName(talentName, talente.kampftalente);
          }
          if(talent === null) {

            window.alert('Talent konnte nicht gefunden werden: ' + talentName)
          }
          this.talentService.attachSpezialisierung(ts, talent)

        } else {
          if(node.parentElement.parentElement.tagName == 'Wesen') {
            this.messageService.infoOnce('Tier-Sonderfertigkeiten werden nicht unterstützt')
          } else {
            this.messageService.error('Paddi hat einen Fall vergessen! Fallname: ' + name);
          }
        }
      } else if (node.childNodes.length === 1) {
        // Rüstungsgewöhnung oder Kulturkunde
        const spezialisierung = node.firstChild.attributes.getNamedItem('name').value;
        andereSpezialisierungen.push(new Spezialisierung(name, spezialisierung));

      } else {
        if(node.parentElement.parentElement.tagName === 'Wesen') {
          this.messageService.infoOnce('Tier-Sonderfertigkeiten werden nicht unterstützt');
        } else {
          requestData.push(name);
        }



      }


    }
    this.sonderfertigkeitenService.getSfsByName(requestData).subscribe(
      (sfs: Sonderfertigkeit[]) => {

        for ( let i = 0; i < sfs.length; i++) {
          const data = sfs[i];
          if (data === null) {

            this.messageService.info('Sonderfertigkeit nicht in der Datenbank vorhanden: ' + requestData[i]);
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

    const talente = [];
    const schriftTalente: SprachTalent[] = [];
    const sprachtalente: SprachTalent[] = [];
    const kampftalente: KampfTalent[] = [];
    const observableBatch: Observable<TalentData>[] = [];
    const kampfMeta = this.buildKampfTalente(xmlDoc);
    const zauber = this.extractZauber(xmlDoc);
    const talentData: Talente = new Talente(sprachtalente, schriftTalente, talente, kampftalente, zauber)
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
              talent = kampfTalentFactory(name, value, lernmethode, data.be, data.komplexitaet, fkBasis)

            } else {
              talent = kampfTalentFactory(name, value, lernmethode, data.be, data.komplexitaet, atpa.at, atpa.pa)
            }

            kampftalente.push(talent);
          } else if (data.kategorie === 'Sprachen') {
            const talent: SprachTalent =  data as any as SprachTalent;
            talent.value = value;
            sprachtalente.push(talent);

          } else if (data.kategorie === 'Schrift') {
            const talent: SprachTalent =  data as any as SprachTalent;
            talent.value = value;
            schriftTalente.push(talent);
          } else {

            const talent = talentFactory(name, value, lernmethode, data.be, data.komplexitaet, data.kategorie, probe)
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


  private readonly testHeld = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="helden.xsl"?><helden Version="5.5.3"><held key="1462825909677" name="Torimalvo Novritalkos - Meister des Feuers, Erlöser der Perlentaucher, Vollstrecker der Druiden" stand="1494072211511"><mods/><basis><geschlecht name="männlich"/><settings name="DSA4.1"/><rasse name="helden.model.rasse.Halbelf" string="Halbelf: Halbelf, in menschlicher Kultur aufgewachsen"><groesse gewicht="68" value="188"/><aussehen alter="19" augenfarbe="dunkelbraun" aussehentext0="" aussehentext1="" aussehentext2="" aussehentext3="" familietext0="" familietext1="" familietext2="" familietext3="" familietext4="" familietext5="" gbjahr="1003" gbmonat="4" gbtag="3" gprest="0" gpstart="110" haarfarbe="hellblond" kalender="Bosparans Fall" stand="" titel=""/><variante name="Halbelf"/><variante name="in menschlicher Kultur aufgewachsen"/></rasse><kultur name="helden.model.kultur.Garetien" string="Mittelländische Städte/Hafenstädte und Städte an großen Flüssen"><variante name="Hafenstädte und Städte an großen Flüssen"/></kultur><ausbildungen><ausbildung art="Hauptprofession" name="helden.model.profession.Magier" string="Akademie Schwert und Stab zu Gareth " tarnidentitaet=""><variante name="Akademie Schwert und Stab zu Gareth "/></ausbildung></ausbildungen><verify value="17"/><notiz notiz0="Notizen" notiz1="" notiz10="" notiz11="" notiz2="" notiz3="" notiz4="" notiz5="" notiz6="" notiz7="" notiz8="" notiz9=""/><portraet value=""/><abenteuerpunkte value="3520"/><freieabenteuerpunkte value="149"/><gilde name="weiß"/></basis><eigenschaften><eigenschaft mod="0" name="Mut" startwert="12" value="12"/><eigenschaft mod="0" name="Klugheit" startwert="14" value="14"/><eigenschaft mod="0" name="Intuition" startwert="14" value="14"/><eigenschaft mod="0" name="Charisma" startwert="12" value="13"/><eigenschaft mod="0" name="Fingerfertigkeit" startwert="11" value="11"/><eigenschaft mod="1" name="Gewandtheit" startwert="11" value="11"/><eigenschaft mod="0" name="Konstitution" startwert="14" value="15"/><eigenschaft mod="-1" name="Körperkraft" startwert="12" value="12"/><eigenschaft mod="0" name="Sozialstatus" startwert="8" value="8"/><eigenschaft mod="8" name="Lebensenergie" value="1"/><eigenschaft mod="10" name="Ausdauer" value="0"/><eigenschaft grossemeditation="0" mod="25" mrmod="-2" name="Astralenergie" value="3"/><eigenschaft karmalqueste="0" mod="0" name="Karmaenergie" value="0"/><eigenschaft mod="-2" name="Magieresistenz" value="0"/><eigenschaft mod="0" name="ini" value="10"/><eigenschaft mod="0" name="at" value="7"/><eigenschaft mod="0" name="pa" value="7"/><eigenschaft mod="0" name="fk" value="7"/></eigenschaften><vt><vorteil name="Akademische Ausbildung (Magier)"/><vorteil name="Astrale Regeneration" value="2"/><vorteil name="Gutaussehend"/><vorteil name="Vollzauberer"/><vorteil name="Zauberhaar"/><vorteil name="Arroganz" value="9"/><vorteil name="Autoritätsgläubig" value="8"/><vorteil name="Eitelkeit" value="10"/><vorteil name="Goldgier" value="7"/><vorteil name="Neugier" value="7"/><vorteil name="Prinzipientreue" value="12"/><vorteil name="Schulden" value="1900"/><vorteil name="Speisegebote"/><vorteil name="Verpflichtungen"/><vorteil name="Verwöhnt" value="5"/></vt><sf><sonderfertigkeit name="Apport"/><sonderfertigkeit name="Astrale Meditation"/><sonderfertigkeit name="Große Meditation"/><sonderfertigkeit name="Kulturkunde"><kultur name="Mittelreich"/></sonderfertigkeit><sonderfertigkeit name="Merkmalskenntnis: Eigenschaften"/><sonderfertigkeit name="Merkmalskenntnis: Schaden"/><sonderfertigkeit name="Ortskenntnis"><auswahl name="Stadtteil/Kleinstadt"/></sonderfertigkeit><sonderfertigkeit name="Regeneration I"/><sonderfertigkeit name="Repräsentation: Magier"/><sonderfertigkeit name="Ritualkenntnis: Gildenmagie"/><sonderfertigkeit name="Rüstungsgewöhnung I"><gegenstand name="Gambeson"/></sonderfertigkeit><sonderfertigkeit name="Stabzauber: Bindung"/><sonderfertigkeit name="Stabzauber: Fackel"/><sonderfertigkeit name="Stabzauber: Hammer des Magus"/><sonderfertigkeit name="Stabzauber: Kraftfokus"/><sonderfertigkeit name="Stabzauber: Zauberspeicher"/><sonderfertigkeit name="Zauberkontrolle"/><sonderfertigkeit name="Zauberroutine"/><sonderfertigkeit name="Zauberspezialisierung Ignisphaero Feuerball [Magier] (Zauberdauer)"><zauber name="Ignisphaero Feuerball" repraesentation="Magier" variante=""/><spezialisierung name="Zauberdauer"/></sonderfertigkeit><verbilligtesonderfertigkeit name="Meisterparade"/></sf><ereignisse><ereignis obj="max GP für Helden: 110" text="EINSTELLUNG" time="1462825912749" version="HS 5.5.1"/><ereignis obj="max Eigenschafts-GP für Helden: 100" text="EINSTELLUNG" time="1462825912749" version="HS 5.5.1"/><ereignis obj="max Eigenschafts-Wert für Helden: 14" text="EINSTELLUNG" time="1462825912749" version="HS 5.5.1"/><ereignis obj="Bei dieser Profession kann es sein, dass der Vorteil Viertelzauberer des Halbelfen nicht mehr genutzt werden darf! (siehe WDH 258)" text="Meistergenehmigung notwendig" time="1462825912750" version="HS 5.5.1"/><ereignis obj="Wegen doppelter, ersetzter Vor-/Nachteile oder anderen Sonderregeln wurden -2 GP frei. Bitte WDH S.12 bzw. die Anmerkungen bei den jeweiligen RKP beachten." text="Meistergenehmigung notwendig" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="3 GP" obj="Rasse: Halbelf: Halbelf, in menschlicher Kultur aufgewachsen" text="RKP" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="3 GP" obj="Kultur: Mittelländische Städte/Hafenstädte und Städte an großen Flüssen" text="RKP" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="29 GP" obj="Profession: Akademie Schwert und Stab zu Gareth " text="RKP" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="12" kommentar="12 GP" obj="Mut: 12" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Klugheit: 14" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Intuition: 14" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="12" kommentar="12 GP" obj="Charisma: 12" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Fingerfertigkeit: 11" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="12" kommentar="11 GP" obj="Gewandtheit: 12" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Konstitution: 14" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="11" kommentar="12 GP" obj="Körperkraft: 11" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="8" kommentar="0 GP" obj="Sozialstatus: 8" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="6" kommentar="27 AP" obj="Stäbe: 6" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="7" kommentar="33 AP" obj="Stäbe: 7" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="8" kommentar="39 AP" obj="Stäbe: 8" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="4" kommentar="21 AP" obj="Ritualkenntnis: Gildenmagie: 4" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="5" kommentar="28 AP" obj="Ritualkenntnis: Gildenmagie: 5" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="6" kommentar="34 AP" obj="Ritualkenntnis: Gildenmagie: 6" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="7" kommentar="41 AP" obj="Ritualkenntnis: Gildenmagie: 7" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="5" kommentar="17 AP" obj="Balsam Salabunde [Magier]: 5" text="ZAUBER" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="150 AP" obj="Apport" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="1 GP" obj="Regeneration I" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="56 AP" obj="Stabzauber: Fackel" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="113 AP" obj="Stabzauber: Hammer des Magus" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-2 GP" obj="Doppelter oder ersetzter Vor-/Nachteil: Viertelzauberer" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Akademische Ausbildung (Magier)" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-4 GP" obj="Arroganz: 9" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="8 GP" obj="Astrale Regeneration: 2" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-4 GP" obj="Autoritätsgläubig: 8" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-10 GP" obj="Eitelkeit: 10" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-7 GP" obj="Goldgier: 7" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Gutaussehend" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Neugier: 7" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-2 GP" obj="Prinzipientreue: 12" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Schulden: 2000" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Speisegebote" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Verpflichtungen" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Verwöhnt: 5" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Vollzauberer" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="10 GP" obj="Zauberhaar" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis obj="Auswahl" text="Meisterparade" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="1" obj="Auswahl" text="Armbrust" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="3" obj="Auswahl" text="Sprachen kennen Thorwalsch" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="1" obj="Auswahl" text="Hauswirtschaft" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="2" obj="Auswahl" text="Custodosigil Diebesbann [Magier] [Magier]" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="3" obj="Auswahl" text="Eisenrost und Patina [Magier] [Magier]" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="D: 0 S: 0 H: 0 K: 0" Info="Geldbörse" Neu="D: 6 S: 4 H: 0 K: 0" obj="Mittelreich" text="Geld" time="1462826549451" version="HS 5.5.1"/><ereignis Abenteuerpunkte="250" kommentar="Vronfelden Gesamt AP: 250 Verfügbare AP: 250" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1466364600382" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4;0;4" Info="SE, Gegenseitiges Lehren" Neu="5;0;4" obj="Schwerter" text="Nahkampftalent steigern" time="1466364604119" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="7" Info="SE, Gegenseitiges Lehren" Neu="8" obj="Blitz dich find [Magier] [Magier]" text="Zauber steigern" time="1466364624976" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="SE, Gegenseitiges Lehren" Neu="4" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364655259" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-34" Alt="5;0;4" Info="Gegenseitiges Lehren" Neu="6;0;4" obj="Schwerter" text="Nahkampftalent steigern" time="1466364669221" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-41" Alt="6;0;4" Info="Gegenseitiges Lehren" Neu="7;0;4" obj="Schwerter" text="Nahkampftalent steigern" time="1466364669424" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364694602" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-27" Alt="5" Info="Selbststudium" Neu="6" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364697097" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-33" Alt="6" Info="Selbststudium" Neu="7" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364698111" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-39" Alt="7" Info="Selbststudium" Neu="8" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364698729" version="HS 5.5.1"/><ereignis Abenteuerpunkte="275" kommentar="Der Fall Nostrias Gesamt AP: 275 Verfügbare AP: 275" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1467406672462" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-39" Alt="7" Info="Lehrmeister" Neu="8" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1467407055373" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-45" Alt="8" Info="Lehrmeister" Neu="9" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1467407059806" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-50" Alt="9" Info="Lehrmeister" Neu="10" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1467407061884" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="SE, Gegenseitiges Lehren" Neu="6" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407110679" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407111808" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-29" Alt="7" Info="Gegenseitiges Lehren" Neu="8" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407113059" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="0" Neu="1" obj="Astralenergie" text="Eigenschaft steigern" time="1467407127288" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-18" Alt="1" Neu="2" obj="Astralenergie" text="Eigenschaft steigern" time="1467407129675" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-30" Alt="2" Neu="3" obj="Astralenergie" text="Eigenschaft steigern" time="1467407133025" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-34" Alt="8" Info="Gegenseitiges Lehren" Neu="9" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407143700" version="HS 5.5.1"/><ereignis Abenteuerpunkte="470" kommentar="Und so werden die Toten die Toten zu Grabe tragen Gesamt AP: 470 Verfügbare AP: 470" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1469458849163" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-55" Alt="10" Info="Lehrmeister" Neu="11" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1469458853717" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-65" Alt="11" Info="Lehrmeister" Neu="12" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1469458854885" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-57" obj="Stabzauber: Kraftfokus" text="Sonderfertigkeit hinzugefügt" time="1469458876889" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-150" obj="Stabzauber: Zauberspeicher" text="Sonderfertigkeit hinzugefügt" time="1469458886047" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Selbststudium" Neu="4" obj="Eisenrost und Patina [Magier] [Magier]" text="Zauber steigern" time="1469458963181" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Eisenrost und Patina [Magier] [Magier]" text="Zauber steigern" time="1469458964222" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Selbststudium" Neu="4" obj="Paralysis starr wie Stein [Magier] [Magier]" text="Zauber steigern" time="1469459100748" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Paralysis starr wie Stein [Magier] [Magier]" text="Zauber steigern" time="1469459101717" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="Selbststudium" Neu="8" obj="Armatrutz [Magier] [Magier]" text="Zauber steigern" time="1469459315680" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="8" Info="Selbststudium" Neu="9" obj="Armatrutz [Magier] [Magier]" text="Zauber steigern" time="1469459316832" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="Selbststudium" Neu="8" obj="Ignifaxius Flammenstrahl [Magier] [Magier]" text="Zauber steigern" time="1469459347817" version="HS 5.5.1"/><ereignis Abenteuerpunkte="1" Alt="1555" Neu="1556" text="Abenteuerpunkte" time="1473433974409" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-1" Alt="1556" Neu="1555" text="Abenteuerpunkte" time="1473433976674" version="HS 5.5.1"/><ereignis Abenteuerpunkte="300" kommentar="Mit krassem Zwerg Hexen getötet Gesamt AP: 300 Verfügbare AP: 300" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1473460310109" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-10" Neu="0" obj="Unitatio Geistesbund [Magier] [Magier]" text="Zauber aktivieren" time="1473460369721" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-15" Neu="0" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber aktivieren" time="1473460383237" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-1" Alt="0" Info="Lehrmeister" Neu="1" obj="Unitatio Geistesbund [Magier] [Magier]" text="Zauber steigern" time="1473460426942" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-2" Alt="1" Info="Lehrmeister" Neu="2" obj="Unitatio Geistesbund [Magier] [Magier]" text="Zauber steigern" time="1473460429817" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Lehrmeister" Neu="1" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460435661" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-4" Alt="1" Info="Lehrmeister" Neu="2" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460436473" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-30" obj="Zauberspezialisierung Ignisphaero Feuerball [Magier] [Magier] (Zauberdauer)" text="Sonderfertigkeit hinzugefügt" time="1473460480994" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-4" Alt="3" Info="SE, Gegenseitiges Lehren" Neu="4" obj="Lehren" text="Talent steigern" time="1473460548107" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-33" Alt="6" Info="SE, Selbststudium" Neu="7" obj="Sinnenschärfe" text="Talent steigern" time="1473460564686" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-3" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Orientierung" text="Talent steigern" time="1473460580359" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-13" Alt="3" Info="Selbststudium" Neu="4" obj="Orientierung" text="Talent steigern" time="1473460589016" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Orientierung" text="Talent steigern" time="1473460589813" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Lehren" text="Talent steigern" time="1473460606267" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-21" Alt="5" Info="Selbststudium" Neu="6" obj="Lehren" text="Talent steigern" time="1473460607127" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-16" Alt="0" Neu="1" obj="Lebensenergie" text="Eigenschaft steigern" time="1473460613893" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-25" Alt="9" Info="Selbststudium" Neu="10" obj="Armatrutz [Magier] [Magier]" text="Zauber steigern" time="1473460629784" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="Selbststudium" Neu="7" obj="Menschenkenntnis" text="Talent steigern" time="1473460655458" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Selbststudium" Neu="3" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460701335" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Selbststudium" Neu="4" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460702241" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460703585" version="HS 5.5.1"/><ereignis Abenteuerpunkte="550" kommentar="Sturmgeboren Akt I und II Gesamt AP: 550 Verfügbare AP: 550" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1483695565685" version="HS 5.5.1"/><ereignis Abenteuerpunkte="10" kommentar="Erlösung des Perlentauchers Gesamt AP: 10 Verfügbare AP: 10" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1483695612243" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-350" Alt="12" Neu="13" obj="Charisma" text="Eigenschaft steigern" time="1483695619578" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Lehren" text="Talent steigern" time="1483695649743" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Respondami [Magier] [Magier]" text="Zauber steigern" time="1483695657593" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Respondami [Magier] [Magier]" text="Zauber steigern" time="1483695658113" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Respondami [Magier] [Magier]" text="Zauber steigern" time="1483695659537" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Überreden" text="Talent steigern" time="1483695675684" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Überreden" text="Talent steigern" time="1483695676546" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-4" Alt="1" Info="Gegenseitiges Lehren" Neu="2" obj="Überzeugen" text="Talent steigern" time="1483695690214" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-6" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Überzeugen" text="Talent steigern" time="1483695690994" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Überzeugen" text="Talent steigern" time="1483695691628" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Überzeugen" text="Talent steigern" time="1483695692238" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-6" Alt="1" Info="SE, Gegenseitiges Lehren" Neu="2" obj="Singen" text="Talent steigern" time="1483695708343" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Singen" text="Talent steigern" time="1483695713043" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Singen" text="Talent steigern" time="1483695722047" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-7" Alt="1" Info="Gegenseitiges Lehren" Neu="2" obj="Tanzen" text="Talent steigern" time="1483695726455" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Tanzen" text="Talent steigern" time="1483695727342" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Etikette" text="Talent steigern" time="1486142589805" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Etikette" text="Talent steigern" time="1486142590965" version="HS 5.5.1"/><ereignis Abenteuerpunkte="200" kommentar="Der Fall des falschen Praios-Priesters Gesamt AP: 200 Verfügbare AP: 200" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1489196585494" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="SE, Selbststudium" Neu="8" obj="Götter und Kulte" text="Talent steigern" time="1489196604037" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="SE, Gegenseitiges Lehren" Neu="7" obj="Körperbeherrschung" text="Talent steigern" time="1489196617211" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-6" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Adamantium Erzstruktur [Magier]" text="Zauber steigern" time="1489196626210" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-7" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Lesen/Schreiben Kusliker Zeichen" text="Talent steigern" time="1490307605902" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-8" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Lesen/Schreiben Kusliker Zeichen" text="Talent steigern" time="1490307606196" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-10" Neu="0" obj="Sprachen kennen Isdira" text="Talent aktivieren" time="1490307620975" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Gegenseitiges Lehren" Neu="1" obj="Sprachen kennen Isdira" text="Talent steigern" time="1490307627949" version="HS 5.5.2"/><ereignis Abenteuerpunkte="150" kommentar="Und die Moral von der Geschicht: Vor einem gehörnten Dämon LÄUFT MAN Gesamt AP: 150 Verfügbare AP: 150" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1493034960630" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-7" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Attributo [Magier]" text="Zauber steigern" time="1493035016100" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-8" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Attributo [Magier]" text="Zauber steigern" time="1493035016333" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-3" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Unitatio Geistesbund [Magier]" text="Zauber steigern" time="1493035641016" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-9" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Klettern" text="Talent steigern" time="1493035682967" version="HS 5.5.2"/><ereignis Abenteuerpunkte="80" kommentar=" Gesamt AP: 80 Verfügbare AP: 80" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1494071082139" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-75" obj="Merkmalskenntnis: Eigenschaften" text="Sonderfertigkeit hinzugefügt" time="1494071244809" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-15" Neu="0" obj="Desintegratus Pulverstaub [Magier]" text="Zauber aktivieren" time="1494071310399" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-10" Alt="7" Info="Selbststudium" Neu="8" obj="Attributo [Magier]" text="Zauber steigern" time="1494071431600" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-11" Alt="8" Info="Selbststudium" Neu="9" obj="Attributo [Magier]" text="Zauber steigern" time="1494071432344" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-13" Alt="9" Info="Selbststudium" Neu="10" obj="Attributo [Magier]" text="Zauber steigern" time="1494071432874" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-28" Alt="10" Info="Selbststudium" Neu="11" obj="Attributo [Magier]" text="Zauber steigern" time="1494071433377" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-32" Alt="11" Info="Selbststudium" Neu="12" obj="Attributo [Magier]" text="Zauber steigern" time="1494071433754" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-35" Alt="12" Info="Selbststudium" Neu="13" obj="Attributo [Magier]" text="Zauber steigern" time="1494071434165" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-38" Alt="13" Info="Selbststudium" Neu="14" obj="Attributo [Magier]" text="Zauber steigern" time="1494071434767" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Magiekunde" text="Talent steigern" time="1494071569887" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Magiekunde" text="Talent steigern" time="1494071570147" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-17" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Magiekunde" text="Talent steigern" time="1494071570428" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Überreden" text="Talent steigern" time="1494071680878" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-17" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Überreden" text="Talent steigern" time="1494071681234" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-7" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Corpofrigo Kälteschock [Magier]" text="Zauber steigern" time="1494071713220" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-8" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Corpofrigo Kälteschock [Magier]" text="Zauber steigern" time="1494071713548" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Gegenseitiges Lehren" Neu="1" obj="Desintegratus Pulverstaub [Magier]" text="Zauber steigern" time="1494071865632" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-6" Alt="1" Info="Gegenseitiges Lehren" Neu="2" obj="Desintegratus Pulverstaub [Magier]" text="Zauber steigern" time="1494071865953" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-9" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Desintegratus Pulverstaub [Magier]" text="Zauber steigern" time="1494071866290" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-13" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Desintegratus Pulverstaub [Magier]" text="Zauber steigern" time="1494071867788" version="HS 5.5.2"/><ereignis Alt="2000" Neu="1999" kommentar="1 Dukaten zurückgezahlt" obj="Schulden" text="Nachteile senken" time="1494072111204" version="HS 5.5.2"/><ereignis Alt="D: 6 S: 4 H: 0 K: 0" Info="Gelbörse für Schulden" Neu="D: 5 S: 4 H: 0 K: 0" obj="Mittelreich" text="Geld" time="1494072111204" version="HS 5.5.2"/><ereignis Alt="1999" Neu="1998" kommentar="1 Dukaten zurückgezahlt" obj="Schulden" text="Nachteile senken" time="1494072119491" version="HS 5.5.2"/><ereignis Alt="D: 5 S: 4 H: 0 K: 0" Info="Gelbörse für Schulden" Neu="D: 4 S: 4 H: 0 K: 0" obj="Mittelreich" text="Geld" time="1494072119491" version="HS 5.5.2"/><ereignis kommentar="Editor" obj="Schulden: 1998" text="Vor-/Nachteil entfernt" time="1494072211470" version="HS 5.5.2"/><ereignis kommentar="Editor" obj="Schulden: 1900" text="Vor-/Nachteil hinzugefügt" time="1494072211470" version="HS 5.5.2"/><ereignis Abenteuerpunkte="200" kommentar="Die Namenlosen Tage auf der Ebene Gesamt AP: 200 Verfügbare AP: 200" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1500491362654" version="HS 5.5.2"/><ereignis Abenteuerpunkte="75" kommentar="Uhdenberg Gesamt AP: 75 Verfügbare AP: 75" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1500491375360" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-75" obj="Zauberkontrolle" text="Sonderfertigkeit hinzugefügt" time="1500491397065" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-75" obj="Zauberroutine" text="Sonderfertigkeit hinzugefügt" time="1500491398713" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-9" Alt="8" Info="Lehrmeister" Neu="9" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491484830" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-11" Alt="9" Info="Lehrmeister" Neu="10" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491484985" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-12" Alt="10" Info="Lehrmeister" Neu="11" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491485133" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-14" Alt="11" Info="Lehrmeister" Neu="12" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491485265" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-15" Alt="12" Info="Lehrmeister" Neu="13" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491485414" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-17" Alt="13" Info="Lehrmeister" Neu="14" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491485548" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-19" Alt="14" Info="Lehrmeister" Neu="15" obj="Blitz dich find [Magier]" text="Zauber steigern" time="1500491485684" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-15" Neu="0" obj="Ängste lindern [Magier]" text="Zauber aktivieren" time="1500491550631" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-8" Alt="6" Info="Lehrmeister" Neu="7" obj="Etikette" text="Talent steigern" time="1500491689074" version="HS 5.5.2"/><ereignis Abenteuerpunkte="400" kommentar="Die Bergung des Drachenhorns Gesamt AP: 400 Verfügbare AP: 400" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1504914984065" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-3" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Staatskunst" text="Talent steigern" time="1504914998615" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-7" Alt="5" Info="SE, Gegenseitiges Lehren" Neu="6" obj="Orientierung" text="Talent steigern" time="1504915027266" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-210" Alt="14" Info="SE" Neu="15" obj="Konstitution" text="Eigenschaft steigern" time="1504915073905" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-6" Alt="4" Info="SE, Gegenseitiges Lehren" Neu="5" obj="Geschichtswissen" text="Talent steigern" time="1504915239555" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Gegenseitiges Lehren" Neu="1" obj="Ängste lindern [Magier]" text="Zauber steigern" time="1504915313099" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-6" Alt="1" Info="Gegenseitiges Lehren" Neu="2" obj="Ängste lindern [Magier]" text="Zauber steigern" time="1504915313230" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-9" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Ängste lindern [Magier]" text="Zauber steigern" time="1504915313850" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-13" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Ängste lindern [Magier]" text="Zauber steigern" time="1504915317054" version="HS 5.5.2"/></ereignisse><talentliste><talent lernmethode="Gegenseitiges Lehren" name="Armbrust" probe=" (GE/FF/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Dolche" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Hiebwaffen" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Infanteriewaffen" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Raufen" probe=" (GE/GE/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Ringen" probe=" (GE/GE/KK)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Säbel" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Selbststudium" name="Schwerter" probe=" (GE/GE/KK)" value="7"/><talent lernmethode="Selbststudium" name="Stäbe" probe=" (GE/GE/KK)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfmesser" probe=" (GE/FF/KK)" value="0"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Athletik" probe=" (GE/KO/KK)" value="3"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Klettern" probe=" (MU/GE/KK)" value="3"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Körperbeherrschung" probe=" (MU/IN/GE)" value="7"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Reiten" probe=" (CH/GE/KK)" value="2"/><talent be="BE" lernmethode="Gegenseitiges Lehren" name="Schleichen" probe=" (MU/IN/GE)" value="1"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Schwimmen" probe=" (GE/KO/KK)" value="1"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Selbstbeherrschung" probe=" (MU/KO/KK)" value="4"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Sich verstecken" probe=" (MU/IN/GE)" value="0"/><talent be="BE-3" lernmethode="Gegenseitiges Lehren" name="Singen" probe=" (IN/CH/CH)" value="4"/><talent be="0-&gt;BE" lernmethode="Selbststudium" name="Sinnenschärfe" probe=" (KL/IN/IN)" value="7"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Tanzen" probe=" (CH/GE/GE)" value="3"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Zechen" probe=" (IN/KO/KK)" value="0"/><talent lernmethode="Lehrmeister" name="Etikette" probe=" (KL/IN/CH)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Gassenwissen" probe=" (KL/IN/CH)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Lehren" probe=" (KL/IN/CH)" value="7"/><talent lernmethode="Selbststudium" name="Menschenkenntnis" probe=" (KL/IN/CH)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Überreden" probe=" (MU/IN/CH)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Überzeugen" probe=" (KL/IN/CH)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Fährtensuchen" probe=" (KL/IN/KO)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Fesseln/Entfesseln" probe=" (FF/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Fischen/Angeln" probe=" (IN/FF/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Orientierung" probe=" (KL/IN/IN)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Wildnisleben" probe=" (IN/GE/KO)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Geografie" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Geschichtswissen" probe=" (KL/KL/IN)" value="5"/><talent lernmethode="Selbststudium" name="Götter und Kulte" probe=" (KL/KL/IN)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Heraldik" probe=" (KL/KL/FF)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Kriegskunst" probe=" (MU/KL/CH)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Magiekunde" probe=" (KL/KL/IN)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Mechanik" probe=" (KL/KL/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Pflanzenkunde" probe=" (KL/IN/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Rechnen" probe=" (KL/KL/IN)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Rechtskunde" probe=" (KL/KL/IN)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Sagen und Legenden" probe=" (KL/IN/CH)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Staatskunst" probe=" (KL/IN/CH)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Sternkunde" probe=" (KL/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Tierkunde" probe=" (MU/KL/IN)" value="1"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Bosparano" probe=" (KL/IN/CH)" value="10"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Garethi" probe=" (KL/IN/CH)" value="12"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Isdira" probe=" (KL/IN/CH)" value="1"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Thorwalsch" probe=" (KL/IN/CH)" value="3"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Tulamidya" probe=" (KL/IN/CH)" value="6"/><talent k="10" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Kusliker Zeichen" probe=" (KL/KL/FF)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Alchimie" probe=" (MU/KL/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Boote fahren" probe=" (GE/KO/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Hauswirtschaft" probe=" (IN/CH/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Gift" probe=" (MU/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Wunden" probe=" (KL/CH/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Holzbearbeitung" probe=" (KL/FF/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Kochen" probe=" (KL/IN/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Lederarbeiten" probe=" (KL/FF/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Malen/Zeichnen" probe=" (KL/IN/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Schneidern" probe=" (KL/FF/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Seefahrt" probe=" (FF/GE/KK)" value="1"/><talent lernmethode="Lehrmeister" name="Ritualkenntnis: Gildenmagie" probe=" (--/--/--)" value="12"/></talentliste><zauberliste><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Adamantium Erzstruktur" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Selbststudium" name="Adlerauge Luchsenohr" probe=" (KL/IN/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Ängste lindern" probe=" (MU/IN/CH)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Selbststudium" name="Armatrutz" probe=" (IN/GE/KO)" reichweite="" repraesentation="Magier" value="10" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Selbststudium" name="Attributo" probe=" (KL/CH/**)" reichweite="" repraesentation="Magier" value="14" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Balsam Salabunde" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="9" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Lehrmeister" name="Blitz dich find" probe=" (KL/IN/GE)" reichweite="" repraesentation="Magier" value="15" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Corpofrigo Kälteschock" probe=" (CH/GE/KO)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Custodosigil Diebesbann" probe=" (KL/FF/FF)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Gegenseitiges Lehren" name="Desintegratus Pulverstaub" probe=" (KL/KO/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Eisenrost und Patina" probe=" (KL/CH/GE)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Selbststudium" name="Flim Flam Funkel" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Fortifex arkane Wand" probe=" (IN/KO/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Selbststudium" name="Fulminictus Donnerkeil" probe=" (IN/GE/KO)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Gardianum Zauberschild" probe=" (KL/IN/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Selbststudium" name="Ignifaxius Flammenstrahl" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="8" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Ignisphaero Feuerball" probe=" (MU/IN/KO)" reichweite="" repraesentation="Magier" value="8" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="F" kosten="" lernmethode="Selbststudium" name="Invercano Spiegeltrick" probe=" (MU/IN/FF)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Selbststudium" name="Odem Arcanum" probe=" (KL/IN/IN)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Paralysis starr wie Stein" probe=" (IN/CH/KK)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Selbststudium" name="Plumbumbarum schwerer Arm" probe=" (CH/GE/KK)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Psychostabilis" probe=" (MU/KL/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Respondami" probe=" (MU/IN/CH)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Sapefacta Zauberschwamm" probe=" (KL/CH/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Unitatio Geistesbund" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/></zauberliste><kampf><kampfwerte name="Dolche"><attacke value="7"/><parade value="8"/></kampfwerte><kampfwerte name="Hiebwaffen"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Infanteriewaffen"><attacke value="7"/><parade value="8"/></kampfwerte><kampfwerte name="Raufen"><attacke value="7"/><parade value="10"/></kampfwerte><kampfwerte name="Ringen"><attacke value="7"/><parade value="9"/></kampfwerte><kampfwerte name="Säbel"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Schwerter"><attacke value="10"/><parade value="11"/></kampfwerte><kampfwerte name="Stäbe"><attacke value="12"/><parade value="10"/></kampfwerte></kampf><gegenstände><gegenstand anzahl="1" name="(Lang-)Schwert" slot="0"/><gegenstand anzahl="1" name="Gambeson" slot="0"/><gegenstand anzahl="1" name="Magierstab als Stab" slot="0"/></gegenstände><BoniWaffenlos/><kommentare><sfInfos dauer="" kosten="" probe="" sf="" sfname="Apport" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Bindung" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Fackel" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Hammer des Magus" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Kraftfokus" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Zauberspeicher" wirkung=""/></kommentare><ausrüstungen><heldenausruestung bezeichner="" bfakt="1" bfmin="1" hand="rechts" name="nkwaffe1" schild="0" set="0" slot="0" talent="Schwerter" waffenname="(Lang-)Schwert"/><heldenausruestung bezeichner="" bfakt="-9" bfmin="-9" hand="rechts" name="nkwaffe2" schild="0" set="0" slot="0" talent="Stäbe" waffenname="Magierstab als Stab"/><heldenausruestung name="ruestung1" ruestungsname="Gambeson" set="0" slot="0"/><heldenausruestung name="jagtwaffe" nummer="0" set="0"/></ausrüstungen><verbindungen/><extention/><geldboerse><muenze anzahl="4" name="Dukat" waehrung="Mittelreich"/><muenze anzahl="4" name="Silbertaler" waehrung="Mittelreich"/></geldboerse><plugindata/></held><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>JlSi5EDW8rCWBisAvBbH7GOymDY=</DigestValue></Reference></SignedInfo><SignatureValue>IwZ50s2dulVnQEM5ugEo1pXbmO8Cbdm+i8gLae75JyF3KR1QuG/1rw==</SignatureValue><KeyInfo><KeyValue><DSAKeyValue><P>/KaCzo4Syrom78z3EQ5SbbB4sF7ey80etKII864WF64B81uRpH5t9jQTxeEu0ImbzRMqzVDZkVG9
xD7nN1kuFw==</P><Q>li7dzDacuo67Jg7mtqEm2TRuOMU=</Q><G>Z4Rxsnqc9E7pGknFFH2xqaryRPBaQ01khpMdLRQnG541Awtx/XPaF5Bpsy4pNWMOHCBiNU0Nogps
QW5QvnlMpA==</G><Y>uVrvWkzIbUdL7E80AiD0PJDX3Ck0beY5StXp1wDAA1/ePpemd6rTBNd8YoCzOovNrX016YMcTSiO
iExM4RWtJA==</Y></DSAKeyValue></KeyValue></KeyInfo></Signature></helden>
`



}
