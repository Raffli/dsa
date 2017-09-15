/**
 * Created by Patrick on 12.07.2017.
 */
export class Attribut {
  name: string;
  value: number;
  startwert:number;
  mod:number;
  shortcut: string;


  constructor(name: string, value: number, startwert: number, mod: number, shortcut:string) {
    this.name = name;
    this.value = value;
    this.startwert = startwert;
    this.mod = mod;
    this.shortcut = shortcut;
  }

  public static MUT: number  = 0;
  public static Klugheit: number  = 1;
  public static Intuition: number  = 2;
  public static Charisma: number  = 3;
  public static Fingerfertigkeit: number  = 4;
  public static Gewandhteit: number  = 5;
  public static Konstitution: number  = 6;
  public static Körperkraft: number  = 7;
  public static Sozialstatus: number  = 8;
  public static Lebensenergie: number  = 9;
  public static Ausdauer: number  = 10;
  public static Astralenergie: number  = 11;
  public static Karmaenenergie: number  = 12;
  public static Magieresistenz: number  = 13;
  public static ini: number  = 14;
  public static at: number  = 15;
  public static pa: number  = 16;
  public static fk: number  = 17;




}
