import {Attacke} from './Attacke';
import {RuestungStats} from '../ausruestung/RuestungStats';
export class Kampfteilnehmer {


  public currentLep: number;
  public ini: number;

  constructor(public name: string, public attacken: Attacke[], pa: number, public ausweichen: number, public ruestung: number,
              public usesTrefferzonen: boolean, public maxLep: number, public iniBase: number, public ws: number) {
    this.currentLep = maxLep;
  }
}
