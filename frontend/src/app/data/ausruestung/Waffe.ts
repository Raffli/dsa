import {Hand} from "./Hand";
import {Schaden} from "./schaden";
import {TpKK} from "./tpkk";
import {WM} from "./WM";
/**
 * Created by pahil on 03.09.2017.
 */
export class Waffe {
  public name: string;
  public hand: Hand;
  public schaden: Schaden;
  public totalSchaden: Schaden;
  public tpKK: TpKK
  public wm: WM;
  public ini: number;
  public bf: number;
}
