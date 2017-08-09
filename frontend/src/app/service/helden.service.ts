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

@Injectable()
export class HeldenService {

  private _held:Held

  constructor(private attributService:AttributService, private talentService:TalentService) {
    this.loadHeld(this.testHeld, (held:Held) => {
      this._held =held;
    })
  }

  getHeld(): Held {
    return this._held;
  }


  setHeld(value: Held) {
    this._held = value;
  }

  loadHeld(xml : string, callback : (held:Held) => void):void {


    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, 'text/xml');

    let profession = this.extractProfession(xmlDoc);
    let rasse = this.extractRasse(xmlDoc);
    let geschlecht = this.extractGeschlecht(xmlDoc);
    let alter = this.extractAlter(xmlDoc);
    let apTotal = this.extractApTotal(xmlDoc);
    let apFree = this.extractApFree(xmlDoc);
    let name = this.extractName(xmlDoc);
    let attribute = this.extractAttribute(xmlDoc);
    let vorteile = this.extractVorteile(xmlDoc);
    let sonderfertigkeiten = this.extractSonderfertigkeiten(xmlDoc);
    let kultur = this.extractKultur(xmlDoc);
    let groesseGewicht = this.extractGewichtGroesse(xmlDoc);
    let aussehen = this.extractAussehen(xmlDoc);

    this.extractTalente(xmlDoc, (talente:Talent[]) => {
      let hero = new Held(rasse, geschlecht, profession, apTotal, apFree, name, attribute, vorteile, sonderfertigkeiten,
        talente, kultur, groesseGewicht.groesse, groesseGewicht.gewicht, aussehen);
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
      let attShort = this.attributService.getAttributShortcut(name);

      let attribut = new Attribut(name, value, startwert, mod, attShort);
      attribute.push(attribut);
    }
    return attribute;
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
    let nodes = xmlDoc.getElementsByTagName('sonderfertigkeit')
    let sonderfertigkeiten = [];
    for(let i=0; i<nodes.length;i++) {
      let node = nodes.item(i);
      let name = node.getAttribute('name');
      let info= null;
      if(node.childNodes.length!=0) {

        let child = node.childNodes[0];
        info = child.attributes.getNamedItem('name')
        //TODO: handle zauberspezialisierung
      }
      let sonderfertigkeit = new Sonderfertigkeit(name, info);
      sonderfertigkeiten.push(sonderfertigkeit);
    }
    return sonderfertigkeiten;
  }

  private extractTalente(xmlDoc: Document, callback: (data: Talent[]) => void) : Talent[] {
    let nodes = xmlDoc.getElementsByTagName('talent')
    let talente = [];

    let observableBatch : Observable<TalentData>[] = [];
    for(let i=0; i<nodes.length;i++) {
      let node = nodes[i];
      let lernmethode = node.getAttribute('lernmethode');
      let name = node.getAttribute('name');

      let probe = node.getAttribute('probe');
      let value = parseInt(node.getAttribute('value'));
      let be = node.getAttribute('be');
      let talent = new Talent(lernmethode, name, probe, value, be);
      let obs = this.talentService.getTalentByName(name);
      observableBatch.push(obs);
      obs.subscribe(
        (data: TalentData) => {
          talent.komplexitaet = data.komplexitaet;
          talent.kategorie = data.kategorie;
          if(i==nodes.length-1) {
            callback(talente);

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



      talente.push(talent);

    }

    return talente;
  }


  private readonly testHeld = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><?xml-stylesheet type="text/xsl" href="helden.xsl"?><helden Version="5.5.2"><held key="1462825909677" name="Torimalvo Novritalkos - Meister des Feuers, Erlöser der Perlentaucher, Vollstrecker der Druiden" stand="1493035682967"><mods/><basis><geschlecht name="männlich"/><settings name="DSA4.1"/><rasse name="helden.model.rasse.Halbelf" string="Halbelf: Halbelf, in menschlicher Kultur aufgewachsen"><groesse gewicht="68" value="188"/><aussehen alter="19" augenfarbe="dunkelbraun" aussehentext0="" aussehentext1="" aussehentext2="" aussehentext3="" familietext0="" familietext1="" familietext2="" familietext3="" familietext4="" familietext5="" gbjahr="1003" gbmonat="4" gbtag="3" gprest="0" gpstart="110" haarfarbe="hellblond" kalender="Bosparans Fall" stand="Rechte Hand des Tüngeda" titel="Herr des Feuer"/><variante name="Halbelf"/><variante name="in menschlicher Kultur aufgewachsen"/></rasse><kultur name="helden.model.kultur.Garetien" string="Mittelländische Städte/Hafenstädte und Städte an großen Flüssen"><variante name="Hafenstädte und Städte an großen Flüssen"/></kultur><ausbildungen><ausbildung art="Hauptprofession" name="helden.model.profession.Magier" string="Akademie Schwert und Stab zu Gareth " tarnidentitaet=""><variante name="Akademie Schwert und Stab zu Gareth "/></ausbildung></ausbildungen><verify value="1"/><notiz notiz0="Notizen" notiz1="" notiz10="" notiz11="" notiz2="" notiz3="" notiz4="" notiz5="" notiz6="" notiz7="" notiz8="" notiz9=""/><portraet value=""/><abenteuerpunkte value="2765"/><freieabenteuerpunkte value="295"/><gilde name="weiß"/></basis><eigenschaften><eigenschaft mod="0" name="Mut" startwert="12" value="12"/><eigenschaft mod="0" name="Klugheit" startwert="14" value="14"/><eigenschaft mod="0" name="Intuition" startwert="14" value="14"/><eigenschaft mod="0" name="Charisma" startwert="12" value="13"/><eigenschaft mod="0" name="Fingerfertigkeit" startwert="11" value="11"/><eigenschaft mod="1" name="Gewandtheit" startwert="11" value="11"/><eigenschaft mod="0" name="Konstitution" startwert="14" value="14"/><eigenschaft mod="-1" name="Körperkraft" startwert="12" value="12"/><eigenschaft mod="0" name="Sozialstatus" startwert="8" value="8"/><eigenschaft mod="8" name="Lebensenergie" value="1"/><eigenschaft mod="10" name="Ausdauer" value="0"/><eigenschaft grossemeditation="0" mod="25" mrmod="-2" name="Astralenergie" value="3"/><eigenschaft karmalqueste="0" mod="0" name="Karmaenergie" value="0"/><eigenschaft mod="-2" name="Magieresistenz" value="0"/><eigenschaft mod="0" name="ini" value="10"/><eigenschaft mod="0" name="at" value="7"/><eigenschaft mod="0" name="pa" value="7"/><eigenschaft mod="0" name="fk" value="7"/></eigenschaften><vt><vorteil name="Akademische Ausbildung (Magier)"/><vorteil name="Astrale Regeneration" value="2"/><vorteil name="Gutaussehend"/><vorteil name="Vollzauberer"/><vorteil name="Zauberhaar"/><vorteil name="Arroganz" value="9"/><vorteil name="Autoritätsgläubig" value="8"/><vorteil name="Eitelkeit" value="10"/><vorteil name="Goldgier" value="7"/><vorteil name="Neugier" value="7"/><vorteil name="Prinzipientreue" value="12"/><vorteil name="Schulden" value="2000"/><vorteil name="Speisegebote"/><vorteil name="Verpflichtungen"/><vorteil name="Verwöhnt" value="5"/></vt><sf><sonderfertigkeit name="Apport"/><sonderfertigkeit name="Astrale Meditation"/><sonderfertigkeit name="Große Meditation"/><sonderfertigkeit name="Kulturkunde"><kultur name="Mittelreich"/></sonderfertigkeit><sonderfertigkeit name="Merkmalskenntnis: Schaden"/><sonderfertigkeit name="Ortskenntnis"><auswahl name="Stadtteil/Kleinstadt"/></sonderfertigkeit><sonderfertigkeit name="Regeneration I"/><sonderfertigkeit name="Repräsentation: Magier"/><sonderfertigkeit name="Ritualkenntnis: Gildenmagie"/><sonderfertigkeit name="Rüstungsgewöhnung I"><gegenstand name="Gambeson"/></sonderfertigkeit><sonderfertigkeit name="Stabzauber: Bindung"/><sonderfertigkeit name="Stabzauber: Fackel"/><sonderfertigkeit name="Stabzauber: Hammer des Magus"/><sonderfertigkeit name="Stabzauber: Kraftfokus"/><sonderfertigkeit name="Stabzauber: Zauberspeicher"/><sonderfertigkeit name="Zauberspezialisierung Ignisphaero Feuerball [Magier] (Zauberdauer)"><zauber name="Ignisphaero Feuerball" repraesentation="Magier" variante=""/><spezialisierung name="Zauberdauer"/></sonderfertigkeit><verbilligtesonderfertigkeit name="Meisterparade"/></sf><ereignisse><ereignis obj="max GP für Helden: 110" text="EINSTELLUNG" time="1462825912749" version="HS 5.5.1"/><ereignis obj="max Eigenschafts-GP für Helden: 100" text="EINSTELLUNG" time="1462825912749" version="HS 5.5.1"/><ereignis obj="max Eigenschafts-Wert für Helden: 14" text="EINSTELLUNG" time="1462825912749" version="HS 5.5.1"/><ereignis obj="Bei dieser Profession kann es sein, dass der Vorteil Viertelzauberer des Halbelfen nicht mehr genutzt werden darf! (siehe WDH 258)" text="Meistergenehmigung notwendig" time="1462825912750" version="HS 5.5.1"/><ereignis obj="Wegen doppelter, ersetzter Vor-/Nachteile oder anderen Sonderregeln wurden -2 GP frei. Bitte WDH S.12 bzw. die Anmerkungen bei den jeweiligen RKP beachten." text="Meistergenehmigung notwendig" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="3 GP" obj="Rasse: Halbelf: Halbelf, in menschlicher Kultur aufgewachsen" text="RKP" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="3 GP" obj="Kultur: Mittelländische Städte/Hafenstädte und Städte an großen Flüssen" text="RKP" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="29 GP" obj="Profession: Akademie Schwert und Stab zu Gareth " text="RKP" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="12" kommentar="12 GP" obj="Mut: 12" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Klugheit: 14" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Intuition: 14" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="12" kommentar="12 GP" obj="Charisma: 12" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="11" kommentar="11 GP" obj="Fingerfertigkeit: 11" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="12" kommentar="11 GP" obj="Gewandtheit: 12" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="14" kommentar="14 GP" obj="Konstitution: 14" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="11" kommentar="12 GP" obj="Körperkraft: 11" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="8" kommentar="0 GP" obj="Sozialstatus: 8" text="EIGENSCHAFTEN" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="6" kommentar="27 AP" obj="Stäbe: 6" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="7" kommentar="33 AP" obj="Stäbe: 7" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="8" kommentar="39 AP" obj="Stäbe: 8" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="4" kommentar="21 AP" obj="Ritualkenntnis: Gildenmagie: 4" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="5" kommentar="28 AP" obj="Ritualkenntnis: Gildenmagie: 5" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="6" kommentar="34 AP" obj="Ritualkenntnis: Gildenmagie: 6" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="7" kommentar="41 AP" obj="Ritualkenntnis: Gildenmagie: 7" text="TALENT" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="5" kommentar="17 AP" obj="Balsam Salabunde [Magier]: 5" text="ZAUBER" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="150 AP" obj="Apport" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="1 GP" obj="Regeneration I" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="56 AP" obj="Stabzauber: Fackel" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="113 AP" obj="Stabzauber: Hammer des Magus" text="SF" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-2 GP" obj="Doppelter oder ersetzter Vor-/Nachteil: Viertelzauberer" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Akademische Ausbildung (Magier)" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-4 GP" obj="Arroganz: 9" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="8 GP" obj="Astrale Regeneration: 2" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-4 GP" obj="Autoritätsgläubig: 8" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-10 GP" obj="Eitelkeit: 10" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-7 GP" obj="Goldgier: 7" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Gutaussehend" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Neugier: 7" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-2 GP" obj="Prinzipientreue: 12" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Schulden: 2000" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Speisegebote" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Verpflichtungen" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="-5 GP" obj="Verwöhnt: 5" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="0 GP" obj="Vollzauberer" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="0" Neu="0" kommentar="10 GP" obj="Zauberhaar" text="VORTEILE" time="1462825912750" version="HS 5.5.1"/><ereignis obj="Auswahl" text="Meisterparade" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="1" obj="Auswahl" text="Armbrust" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="3" obj="Auswahl" text="Sprachen kennen Thorwalsch" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="1" obj="Auswahl" text="Hauswirtschaft" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="2" obj="Auswahl" text="Custodosigil Diebesbann [Magier] [Magier]" time="1462825912750" version="HS 5.5.1"/><ereignis Neu="3" obj="Auswahl" text="Eisenrost und Patina [Magier] [Magier]" time="1462825912750" version="HS 5.5.1"/><ereignis Alt="D: 0 S: 0 H: 0 K: 0" Info="Geldbörse" Neu="D: 6 S: 4 H: 0 K: 0" obj="Mittelreich" text="Geld" time="1462826549451" version="HS 5.5.1"/><ereignis Abenteuerpunkte="250" kommentar="Vronfelden Gesamt AP: 250 Verfügbare AP: 250" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1466364600382" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4;0;4" Info="SE, Gegenseitiges Lehren" Neu="5;0;4" obj="Schwerter" text="Nahkampftalent steigern" time="1466364604119" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="7" Info="SE, Gegenseitiges Lehren" Neu="8" obj="Blitz dich find [Magier] [Magier]" text="Zauber steigern" time="1466364624976" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="SE, Gegenseitiges Lehren" Neu="4" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364655259" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-34" Alt="5;0;4" Info="Gegenseitiges Lehren" Neu="6;0;4" obj="Schwerter" text="Nahkampftalent steigern" time="1466364669221" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-41" Alt="6;0;4" Info="Gegenseitiges Lehren" Neu="7;0;4" obj="Schwerter" text="Nahkampftalent steigern" time="1466364669424" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364694602" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-27" Alt="5" Info="Selbststudium" Neu="6" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364697097" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-33" Alt="6" Info="Selbststudium" Neu="7" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364698111" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-39" Alt="7" Info="Selbststudium" Neu="8" obj="Ignisphaero Feuerball [Magier] [Magier]" text="Zauber steigern" time="1466364698729" version="HS 5.5.1"/><ereignis Abenteuerpunkte="275" kommentar="Der Fall Nostrias Gesamt AP: 275 Verfügbare AP: 275" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1467406672462" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-39" Alt="7" Info="Lehrmeister" Neu="8" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1467407055373" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-45" Alt="8" Info="Lehrmeister" Neu="9" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1467407059806" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-50" Alt="9" Info="Lehrmeister" Neu="10" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1467407061884" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="SE, Gegenseitiges Lehren" Neu="6" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407110679" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407111808" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-29" Alt="7" Info="Gegenseitiges Lehren" Neu="8" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407113059" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="0" Neu="1" obj="Astralenergie" text="Eigenschaft steigern" time="1467407127288" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-18" Alt="1" Neu="2" obj="Astralenergie" text="Eigenschaft steigern" time="1467407129675" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-30" Alt="2" Neu="3" obj="Astralenergie" text="Eigenschaft steigern" time="1467407133025" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-34" Alt="8" Info="Gegenseitiges Lehren" Neu="9" obj="Balsam Salabunde [Magier] [Magier]" text="Zauber steigern" time="1467407143700" version="HS 5.5.1"/><ereignis Abenteuerpunkte="470" kommentar="Und so werden die Toten die Toten zu Grabe tragen Gesamt AP: 470 Verfügbare AP: 470" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1469458849163" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-55" Alt="10" Info="Lehrmeister" Neu="11" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1469458853717" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-65" Alt="11" Info="Lehrmeister" Neu="12" obj="Ritualkenntnis: Gildenmagie" text="Talent steigern" time="1469458854885" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-57" obj="Stabzauber: Kraftfokus" text="Sonderfertigkeit hinzugefügt" time="1469458876889" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-150" obj="Stabzauber: Zauberspeicher" text="Sonderfertigkeit hinzugefügt" time="1469458886047" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Selbststudium" Neu="4" obj="Eisenrost und Patina [Magier] [Magier]" text="Zauber steigern" time="1469458963181" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Eisenrost und Patina [Magier] [Magier]" text="Zauber steigern" time="1469458964222" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Selbststudium" Neu="4" obj="Paralysis starr wie Stein [Magier] [Magier]" text="Zauber steigern" time="1469459100748" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Paralysis starr wie Stein [Magier] [Magier]" text="Zauber steigern" time="1469459101717" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="Selbststudium" Neu="8" obj="Armatrutz [Magier] [Magier]" text="Zauber steigern" time="1469459315680" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="8" Info="Selbststudium" Neu="9" obj="Armatrutz [Magier] [Magier]" text="Zauber steigern" time="1469459316832" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="Selbststudium" Neu="8" obj="Ignifaxius Flammenstrahl [Magier] [Magier]" text="Zauber steigern" time="1469459347817" version="HS 5.5.1"/><ereignis Abenteuerpunkte="1" Alt="1555" Neu="1556" text="Abenteuerpunkte" time="1473433974409" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-1" Alt="1556" Neu="1555" text="Abenteuerpunkte" time="1473433976674" version="HS 5.5.1"/><ereignis Abenteuerpunkte="300" kommentar="Mit krassem Zwerg Hexen getötet Gesamt AP: 300 Verfügbare AP: 300" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1473460310109" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-10" Neu="0" obj="Unitatio Geistesbund [Magier] [Magier]" text="Zauber aktivieren" time="1473460369721" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-15" Neu="0" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber aktivieren" time="1473460383237" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-1" Alt="0" Info="Lehrmeister" Neu="1" obj="Unitatio Geistesbund [Magier] [Magier]" text="Zauber steigern" time="1473460426942" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-2" Alt="1" Info="Lehrmeister" Neu="2" obj="Unitatio Geistesbund [Magier] [Magier]" text="Zauber steigern" time="1473460429817" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Lehrmeister" Neu="1" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460435661" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-4" Alt="1" Info="Lehrmeister" Neu="2" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460436473" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-30" obj="Zauberspezialisierung Ignisphaero Feuerball [Magier] [Magier] (Zauberdauer)" text="Sonderfertigkeit hinzugefügt" time="1473460480994" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-4" Alt="3" Info="SE, Gegenseitiges Lehren" Neu="4" obj="Lehren" text="Talent steigern" time="1473460548107" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-33" Alt="6" Info="SE, Selbststudium" Neu="7" obj="Sinnenschärfe" text="Talent steigern" time="1473460564686" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-3" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Orientierung" text="Talent steigern" time="1473460580359" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-13" Alt="3" Info="Selbststudium" Neu="4" obj="Orientierung" text="Talent steigern" time="1473460589016" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Orientierung" text="Talent steigern" time="1473460589813" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="4" Info="Selbststudium" Neu="5" obj="Lehren" text="Talent steigern" time="1473460606267" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-21" Alt="5" Info="Selbststudium" Neu="6" obj="Lehren" text="Talent steigern" time="1473460607127" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-16" Alt="0" Neu="1" obj="Lebensenergie" text="Eigenschaft steigern" time="1473460613893" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-25" Alt="9" Info="Selbststudium" Neu="10" obj="Armatrutz [Magier] [Magier]" text="Zauber steigern" time="1473460629784" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="Selbststudium" Neu="7" obj="Menschenkenntnis" text="Talent steigern" time="1473460655458" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Selbststudium" Neu="3" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460701335" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Selbststudium" Neu="4" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460702241" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-22" Alt="4" Info="Selbststudium" Neu="5" obj="Sapefacta Zauberschwamm [Magier] [Magier]" text="Zauber steigern" time="1473460703585" version="HS 5.5.1"/><ereignis Abenteuerpunkte="550" kommentar="Sturmgeboren Akt I und II Gesamt AP: 550 Verfügbare AP: 550" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1483695565685" version="HS 5.5.1"/><ereignis Abenteuerpunkte="10" kommentar="Erlösung des Perlentauchers Gesamt AP: 10 Verfügbare AP: 10" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1483695612243" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-350" Alt="12" Neu="13" obj="Charisma" text="Eigenschaft steigern" time="1483695619578" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Lehren" text="Talent steigern" time="1483695649743" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Respondami [Magier] [Magier]" text="Zauber steigern" time="1483695657593" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Respondami [Magier] [Magier]" text="Zauber steigern" time="1483695658113" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Respondami [Magier] [Magier]" text="Zauber steigern" time="1483695659537" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Überreden" text="Talent steigern" time="1483695675684" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Überreden" text="Talent steigern" time="1483695676546" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-4" Alt="1" Info="Gegenseitiges Lehren" Neu="2" obj="Überzeugen" text="Talent steigern" time="1483695690214" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-6" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Überzeugen" text="Talent steigern" time="1483695690994" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-8" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Überzeugen" text="Talent steigern" time="1483695691628" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Überzeugen" text="Talent steigern" time="1483695692238" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-6" Alt="1" Info="SE, Gegenseitiges Lehren" Neu="2" obj="Singen" text="Talent steigern" time="1483695708343" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Singen" text="Talent steigern" time="1483695713043" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-17" Alt="3" Info="Gegenseitiges Lehren" Neu="4" obj="Singen" text="Talent steigern" time="1483695722047" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-7" Alt="1" Info="Gegenseitiges Lehren" Neu="2" obj="Tanzen" text="Talent steigern" time="1483695726455" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-12" Alt="2" Info="Gegenseitiges Lehren" Neu="3" obj="Tanzen" text="Talent steigern" time="1483695727342" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-11" Alt="4" Info="Gegenseitiges Lehren" Neu="5" obj="Etikette" text="Talent steigern" time="1486142589805" version="HS 5.5.1"/><ereignis Abenteuerpunkte="-14" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Etikette" text="Talent steigern" time="1486142590965" version="HS 5.5.1"/><ereignis Abenteuerpunkte="200" kommentar="Der Fall des falschen Praios-Priesters Gesamt AP: 200 Verfügbare AP: 200" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1489196585494" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-19" Alt="7" Info="SE, Selbststudium" Neu="8" obj="Götter und Kulte" text="Talent steigern" time="1489196604037" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-25" Alt="6" Info="SE, Gegenseitiges Lehren" Neu="7" obj="Körperbeherrschung" text="Talent steigern" time="1489196617211" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-6" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Adamantium Erzstruktur [Magier]" text="Zauber steigern" time="1489196626210" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-7" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Lesen/Schreiben Kusliker Zeichen" text="Talent steigern" time="1490307605902" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-8" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Lesen/Schreiben Kusliker Zeichen" text="Talent steigern" time="1490307606196" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-10" Neu="0" obj="Sprachen kennen Isdira" text="Talent aktivieren" time="1490307620975" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-2" Alt="0" Info="Gegenseitiges Lehren" Neu="1" obj="Sprachen kennen Isdira" text="Talent steigern" time="1490307627949" version="HS 5.5.2"/><ereignis Abenteuerpunkte="150" kommentar="Und die Moral von der Geschicht: Vor einem gehörnten Dämon LÄUFT MAN Gesamt AP: 150 Verfügbare AP: 150" obj="Abenteuerpunkte (Hinzugewinn)" text="Ereignis eingeben" time="1493034960630" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-7" Alt="5" Info="Gegenseitiges Lehren" Neu="6" obj="Attributo [Magier]" text="Zauber steigern" time="1493035016100" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-8" Alt="6" Info="Gegenseitiges Lehren" Neu="7" obj="Attributo [Magier]" text="Zauber steigern" time="1493035016333" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-3" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Unitatio Geistesbund [Magier]" text="Zauber steigern" time="1493035641016" version="HS 5.5.2"/><ereignis Abenteuerpunkte="-9" Alt="2" Info="SE, Gegenseitiges Lehren" Neu="3" obj="Klettern" text="Talent steigern" time="1493035682967" version="HS 5.5.2"/></ereignisse><talentliste><talent lernmethode="Gegenseitiges Lehren" name="Armbrust" probe=" (GE/FF/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Dolche" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Hiebwaffen" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Infanteriewaffen" probe=" (GE/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Raufen" probe=" (GE/GE/KK)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Ringen" probe=" (GE/GE/KK)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Säbel" probe=" (GE/GE/KK)" value="0"/><talent lernmethode="Selbststudium" name="Schwerter" probe=" (GE/GE/KK)" value="7"/><talent lernmethode="Selbststudium" name="Stäbe" probe=" (GE/GE/KK)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Wurfmesser" probe=" (GE/FF/KK)" value="0"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Athletik" probe=" (GE/KO/KK)" value="3"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Klettern" probe=" (MU/GE/KK)" value="3"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Körperbeherrschung" probe=" (MU/IN/GE)" value="7"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Reiten" probe=" (CH/GE/KK)" value="2"/><talent be="BE" lernmethode="Gegenseitiges Lehren" name="Schleichen" probe=" (MU/IN/GE)" value="1"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Schwimmen" probe=" (GE/KO/KK)" value="1"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Selbstbeherrschung" probe=" (MU/KO/KK)" value="4"/><talent be="BE-2" lernmethode="Gegenseitiges Lehren" name="Sich verstecken" probe=" (MU/IN/GE)" value="0"/><talent be="BE-3" lernmethode="Gegenseitiges Lehren" name="Singen" probe=" (IN/CH/CH)" value="4"/><talent be="0-&gt;BE" lernmethode="Selbststudium" name="Sinnenschärfe" probe=" (KL/IN/IN)" value="7"/><talent be="BEx2" lernmethode="Gegenseitiges Lehren" name="Tanzen" probe=" (CH/GE/GE)" value="3"/><talent be="" lernmethode="Gegenseitiges Lehren" name="Zechen" probe=" (IN/KO/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Etikette" probe=" (KL/IN/CH)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Gassenwissen" probe=" (KL/IN/CH)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Lehren" probe=" (KL/IN/CH)" value="7"/><talent lernmethode="Selbststudium" name="Menschenkenntnis" probe=" (KL/IN/CH)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Überreden" probe=" (MU/IN/CH)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Überzeugen" probe=" (KL/IN/CH)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Fährtensuchen" probe=" (KL/IN/KO)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Fesseln/Entfesseln" probe=" (FF/GE/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Fischen/Angeln" probe=" (IN/FF/KK)" value="1"/><talent lernmethode="Selbststudium" name="Orientierung" probe=" (KL/IN/IN)" value="5"/><talent lernmethode="Gegenseitiges Lehren" name="Wildnisleben" probe=" (IN/GE/KO)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Geografie" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Geschichtswissen" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Selbststudium" name="Götter und Kulte" probe=" (KL/KL/IN)" value="8"/><talent lernmethode="Gegenseitiges Lehren" name="Heraldik" probe=" (KL/KL/FF)" value="3"/><talent lernmethode="Gegenseitiges Lehren" name="Kriegskunst" probe=" (MU/KL/CH)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Magiekunde" probe=" (KL/KL/IN)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Mechanik" probe=" (KL/KL/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Pflanzenkunde" probe=" (KL/IN/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Rechnen" probe=" (KL/KL/IN)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Rechtskunde" probe=" (KL/KL/IN)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Sagen und Legenden" probe=" (KL/IN/CH)" value="6"/><talent lernmethode="Gegenseitiges Lehren" name="Staatskunst" probe=" (KL/IN/CH)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Sternkunde" probe=" (KL/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Tierkunde" probe=" (MU/KL/IN)" value="1"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Bosparano" probe=" (KL/IN/CH)" value="10"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Garethi" probe=" (KL/IN/CH)" value="12"/><talent k="21" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Isdira" probe=" (KL/IN/CH)" value="1"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Thorwalsch" probe=" (KL/IN/CH)" value="3"/><talent k="18" lernmethode="Gegenseitiges Lehren" name="Sprachen kennen Tulamidya" probe=" (KL/IN/CH)" value="6"/><talent k="10" lernmethode="Gegenseitiges Lehren" name="Lesen/Schreiben Kusliker Zeichen" probe=" (KL/KL/FF)" value="7"/><talent lernmethode="Gegenseitiges Lehren" name="Alchimie" probe=" (MU/KL/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Boote fahren" probe=" (GE/KO/KK)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Hauswirtschaft" probe=" (IN/CH/FF)" value="1"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Gift" probe=" (MU/KL/IN)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Heilkunde: Wunden" probe=" (KL/CH/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Holzbearbeitung" probe=" (KL/FF/KK)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Kochen" probe=" (KL/IN/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Lederarbeiten" probe=" (KL/FF/FF)" value="2"/><talent lernmethode="Gegenseitiges Lehren" name="Malen/Zeichnen" probe=" (KL/IN/FF)" value="4"/><talent lernmethode="Gegenseitiges Lehren" name="Schneidern" probe=" (KL/FF/FF)" value="0"/><talent lernmethode="Gegenseitiges Lehren" name="Seefahrt" probe=" (FF/GE/KK)" value="1"/><talent lernmethode="Lehrmeister" name="Ritualkenntnis: Gildenmagie" probe=" (--/--/--)" value="12"/></talentliste><zauberliste><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Adamantium Erzstruktur" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Selbststudium" name="Adlerauge Luchsenohr" probe=" (KL/IN/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Selbststudium" name="Armatrutz" probe=" (IN/GE/KO)" reichweite="" repraesentation="Magier" value="10" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Attributo" probe=" (KL/CH/**)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Balsam Salabunde" probe=" (KL/IN/CH)" reichweite="" repraesentation="Magier" value="9" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="B" kosten="" lernmethode="Selbststudium" name="Blitz dich find" probe=" (KL/IN/GE)" reichweite="" repraesentation="Magier" value="8" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Gegenseitiges Lehren" name="Corpofrigo Kälteschock" probe=" (CH/GE/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Custodosigil Diebesbann" probe=" (KL/FF/FF)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Eisenrost und Patina" probe=" (KL/CH/GE)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Selbststudium" name="Flim Flam Funkel" probe=" (KL/KL/FF)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Fortifex arkane Wand" probe=" (IN/KO/KK)" reichweite="" repraesentation="Magier" value="4" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Selbststudium" name="Fulminictus Donnerkeil" probe=" (IN/GE/KO)" reichweite="" repraesentation="Magier" value="7" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Gardianum Zauberschild" probe=" (KL/IN/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="true" k="C" kosten="" lernmethode="Selbststudium" name="Ignifaxius Flammenstrahl" probe=" (KL/FF/KO)" reichweite="" repraesentation="Magier" value="8" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="D" kosten="" lernmethode="Selbststudium" name="Ignisphaero Feuerball" probe=" (MU/IN/KO)" reichweite="" repraesentation="Magier" value="8" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="F" kosten="" lernmethode="Selbststudium" name="Invercano Spiegeltrick" probe=" (MU/IN/FF)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="A" kosten="" lernmethode="Selbststudium" name="Odem Arcanum" probe=" (KL/IN/IN)" reichweite="" repraesentation="Magier" value="2" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Paralysis starr wie Stein" probe=" (IN/CH/KK)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Selbststudium" name="Plumbumbarum schwerer Arm" probe=" (CH/GE/KK)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Psychostabilis" probe=" (MU/KL/KO)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Respondami" probe=" (MU/IN/CH)" reichweite="" repraesentation="Magier" value="6" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="C" kosten="" lernmethode="Selbststudium" name="Sapefacta Zauberschwamm" probe=" (KL/CH/FF)" reichweite="" repraesentation="Magier" value="5" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/><zauber anmerkungen="" hauszauber="false" k="B" kosten="" lernmethode="Gegenseitiges Lehren" name="Unitatio Geistesbund" probe=" (IN/CH/KO)" reichweite="" repraesentation="Magier" value="3" variante="" wirkungsdauer="" zauberdauer="" zauberkommentar=""/></zauberliste><kampf><kampfwerte name="Dolche"><attacke value="7"/><parade value="8"/></kampfwerte><kampfwerte name="Hiebwaffen"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Infanteriewaffen"><attacke value="7"/><parade value="8"/></kampfwerte><kampfwerte name="Raufen"><attacke value="7"/><parade value="10"/></kampfwerte><kampfwerte name="Ringen"><attacke value="7"/><parade value="9"/></kampfwerte><kampfwerte name="Säbel"><attacke value="7"/><parade value="7"/></kampfwerte><kampfwerte name="Schwerter"><attacke value="10"/><parade value="11"/></kampfwerte><kampfwerte name="Stäbe"><attacke value="12"/><parade value="10"/></kampfwerte></kampf><gegenstände><gegenstand anzahl="1" name="Dolch" slot="0"><Fernkampfwaffe><talente kampftalent="Wurfmesser"/></Fernkampfwaffe></gegenstand><gegenstand anzahl="1" name="Geldbeutel, Leder" slot="0"/><gegenstand anzahl="1" name="Hohe Stiefel" slot="0"/><gegenstand anzahl="5" name="Kohlestift" slot="0"/><gegenstand anzahl="1" name="Magierrobe, Taft" slot="0"/><gegenstand anzahl="1" name="Magierstab als Stab" slot="0"/><gegenstand anzahl="1" name="Ring" slot="0"/><gegenstand anzahl="1" name="Tagebuch, Papier" slot="0"/><gegenstand anzahl="1" name="Tinte" slot="0"/><gegenstand anzahl="1" name="Unterkleid, Leinen" slot="0"/><gegenstand anzahl="1" name="Wirselkraut (W)" slot="0"/></gegenstände><BoniWaffenlos/><kommentare><sfInfos dauer="" kosten="" probe="" sf="" sfname="Apport" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Bindung" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Fackel" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Hammer des Magus" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Kraftfokus" wirkung=""/><sfInfos dauer="" kosten="" probe="" sf="" sfname="Stabzauber: Zauberspeicher" wirkung=""/></kommentare><ausrüstungen><heldenausruestung name="jagtwaffe" nummer="0" set="0"/></ausrüstungen><verbindungen/><extention/><geldboerse><muenze anzahl="6" name="Dukat" waehrung="Mittelreich"/><muenze anzahl="4" name="Silbertaler" waehrung="Mittelreich"/></geldboerse><plugindata/></held><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#dsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>FWdnw1+owJ5tuYFh8SddVcygi4E=</DigestValue></Reference></SignedInfo><SignatureValue>SGGuUQr7R9oDReXVplQGKowZfDptZflTtrORwJhiX1Wsdv9ytbjOJA==</SignatureValue><KeyInfo><KeyValue><DSAKeyValue><P>/KaCzo4Syrom78z3EQ5SbbB4sF7ey80etKII864WF64B81uRpH5t9jQTxeEu0ImbzRMqzVDZkVG9
xD7nN1kuFw==</P><Q>li7dzDacuo67Jg7mtqEm2TRuOMU=</Q><G>Z4Rxsnqc9E7pGknFFH2xqaryRPBaQ01khpMdLRQnG541Awtx/XPaF5Bpsy4pNWMOHCBiNU0Nogps
QW5QvnlMpA==</G><Y>uVrvWkzIbUdL7E80AiD0PJDX3Ck0beY5StXp1wDAA1/ePpemd6rTBNd8YoCzOovNrX016YMcTSiO
iExM4RWtJA==</Y></DSAKeyValue></KeyValue></KeyInfo></Signature></helden>
`



}