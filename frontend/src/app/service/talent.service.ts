import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Talent} from "../data/talent";
import {TalentData} from "../data/talentdata";
import {Http, RequestOptionsArgs, Response, URLSearchParams} from "@angular/http"
import {RestService} from "./rest.service";
import {Spezialisierung} from '../data/Spezialisierung';
import {Zauber} from '../data/Zauber';
import {Talente} from '../data/talente';
import {TalentBase} from '../data/TalentBase';
import {KampfTalent} from '../data/kampftalent';

@Injectable()
export class TalentService {

  constructor(private rest: RestService) { }

  public getTalentByName(name: string): Observable<TalentData> {
    return this.rest.get('talente/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getTalenteByName(names: string[]): Observable<TalentData[]> {
    const params = new URLSearchParams(JSON.stringify(names));
    const options: RequestOptionsArgs = {
      params: {
        names: names
      }
    }
    return this.rest.getWithOptions('talente/bynames', options).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }


  public findTalentByName(name: string, talente: TalentBase[]) {
    for (let i = 0; i < talente.length; i++) {
      if (talente[i].name === name) {
        return talente[i];
      }
    }
  }

  /*
  public hasSpezialisierungFor(name: string, talente: Talente): boolean {
    const zauber = this.findZauberByName(name, talente);
    for (let i = 0; i < zauber.spezialisierungen.length; i++) {
      if (zauber.spezialisierungen[i].name === name) {
        return true;
      }
    }
  }
  */

  public hasSpezialisierungFor(name: string, talent: TalentBase): boolean {
    for( let i = 0; i<talent.spezialisierungen.length; i++) {
      if(talent.spezialisierungen[i].name === name) {
        return true;
      }
    }
    return false;
  }

  public calculateEtaw(eBe: number, talent: TalentBase) {
    if (talent.be === null || talent.be === '') {
      talent.eTaw = talent.value;
    } else if (talent.be === 'BE') {
      talent.eTaw = talent.value - eBe;
    } else {
      const beS = talent.be.substr(2, talent.be.length);
      const val = parseInt(beS.substr(1, beS.length), 10) // beS.length should alway be 2
      if (beS.startsWith('-')) {
        talent.eTaw = talent.value - Math.max(0, eBe - val)
      } else {
        talent.eTaw = talent.value - eBe * val;
      }
    }
  }

  public calculateEtawWithATPA(eBe: number, talent: KampfTalent) {
    this.calculateEtaw(eBe, talent);
    if (talent.eTaw < talent.value) {
      const diff = talent.value - talent.eTaw;
      talent.at -= Math.ceil(diff / 2);
      talent.pa -= Math.floor(diff / 2);
    }
  }

  public hasTalentSpezialisierungFor(name: string, talent: TalentBase): boolean {
    for (let i = 0; i < talent.spezialisierungen.length; i++) {
      if (talent.spezialisierungen[i].name === name) {
        return true;
      }
    }
  }

  public attachSpezialisierung(sf: Spezialisierung, talent: TalentBase) {
    talent.spezialisierungen.push(sf);
  }

}
