import { Injectable } from '@angular/core';
import {KampfTalent} from '../data/kampftalent';

@Injectable()
export class KampfTalentService {

  private mapping: {[key: string]: string} = {};

  constructor() {
    this.mapping['Hi'] = 'Hiebwaffen';
    this.mapping['Wb'] = 'Wurfbeile';
  }

  public extractKampftalent(name: string, kampftalente: KampfTalent[]) : KampfTalent {


    for (let i = 0; i < kampftalente.length; i++) {
      if (kampftalente[i].name === name) {
        return kampftalente[i];
      }
    }
    return null;
  }

}
