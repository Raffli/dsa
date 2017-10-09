/**
 * Created by Patrick on 12.07.2017.
 */
export class Attribut {
  public static MUT = 0;
  public static Klugheit = 1;
  public static Intuition = 2;
  public static Charisma = 3;
  public static Fingerfertigkeit = 4;
  public static Gewandhteit = 5;
  public static Konstitution = 6;
  public static Körperkraft = 7;
  public static Sozialstatus = 8;
  public static Lebensenergie = 9;
  public static Ausdauer = 10;
  public static Astralenergie = 11;
  public static Karmaenenergie = 12;
  public static Magieresistenz = 13;
  public static ini = 14;
  public static at = 15;
  public static pa = 16;
  public static fk = 17;


  constructor(public name: string, public value: number, public startwert: number, public mod: number,
              public shortcut: string) {
  }

}
