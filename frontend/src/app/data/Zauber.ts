import {Spezialisierung} from './Spezialisierung';
import {TalentBase} from './TalentBase';
/**
 * Created by pahil on 08.10.2017.
 */
export interface Zauber extends TalentBase{
  hauszauber: boolean;
  representation: string;
}
