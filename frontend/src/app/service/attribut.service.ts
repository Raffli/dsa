import { Injectable } from '@angular/core';

@Injectable()
export class AttributService {


  mappings : { [key:string]:string;} = {};


  constructor() {
    this.mappings["Mut"] ="MU";
    this.mappings["Klugheit"] ="KL";
    this.mappings["Fingerfertigkeit"] ="FF";
    this.mappings["Intuition"] ="IN";
    this.mappings["Körperkraft"] ="KK";
    this.mappings["Gewandtheit"] ="GE";
    this.mappings["Sozialstatus"] ="SO";
    this.mappings["Charisma"] ="CH";
    this.mappings["Konstitution"] ="KO";
    this.mappings["Magieresistenz"] ="MR";
    this.mappings["at"] ="Attacke-Basiswert";
    this.mappings["pa"] ="Parade-Basiswert";
    this.mappings["ini"] ="Initiative-Basiswert";
    this.mappings["fk"] ="Fernkampf-Basiswert";



  }


  getAttributShortcut(name: string){

    return this.mappings[name];
  }
}
