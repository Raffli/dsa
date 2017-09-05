import { Injectable } from '@angular/core';
import {KampfTalent} from '../data/kampftalent';

@Injectable()
export class KampfTalentService {

  private mapping: {[key: string]: string} = {};

  constructor() {
    this.mapping['Hi'] = 'Hiebwaffen'
  }

  public extractKampftalentByShort(short: string, kampftalente: KampfTalent[]) : KampfTalent {
    const name = this.mapping[short];
    if (name === undefined) {
      console.error('Unmapped short: ' + short);
      return null;
    }
    for (let i = 0; i < kampftalente.length; i++) {
      if (kampftalente[i].name === name) {
        return kampftalente[i];
      }
    }
    return null;
  }

}
