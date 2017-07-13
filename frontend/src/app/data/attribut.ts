/**
 * Created by Patrick on 12.07.2017.
 */
export class Attribut {
  name: string;
  value: number;
  startwert:number;
  mod:number;


  constructor(name: string, value: number, startwert: number, mod: number) {
    this.name = name;
    this.value = value;
    this.startwert = startwert;
    this.mod = mod;
  }
}
