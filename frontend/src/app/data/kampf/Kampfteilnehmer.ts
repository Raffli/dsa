import {Attacke} from './Attacke';
import {RuestungStats} from '../ausruestung/RuestungStats';
export class Kampfteilnehmer {


  public currentLep: number;
  public ini: number;

  constructor(public attacken: Attacke[], pa: number, ausweichen: number, public ruestung: RuestungStats,
              public usesTrefferzonen: boolean, public maxLep: number, public iniBase: number) {
    this.currentLep = maxLep;
  }
}
