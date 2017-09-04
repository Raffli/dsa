import {Waffe} from "./Waffe";
import {FernkampfWaffe} from "./FernkampfWaffe";
import {Schild} from "./Schild";
import {Ruestung} from "./Ruestung";

export class AusruestungsSet {
  public waffen: Waffe[];
  public fernkampfWafffen: FernkampfWaffe[];
  public schilde: Schild[];
  public ruestungen: Ruestung[];

  constructor() {
    this.waffen = [];
    this.fernkampfWafffen = [];
    this.schilde = [];
    this.ruestungen = [];

  }
}
