import {Command} from './Command';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
import {Kampfdata} from "../../../../data/kampf/Kampfdata";
/**
 * Created by pahil on 21.09.2017.
 */
export class CommandIni extends Command {

  public getName(): string {
    return 'iniloose';
  }

  public autoComplete(string: string, params: string[], data: Kampfdata): string {
    if (params.length === 2) {
      return this.provideNameMatching(string, data.teilnehmer);
    }
    return string;
  }

  public perform(params: string[] , data: Kampfdata): boolean {
    if (params.length === 3) {
      const teilnehmer = this.findTeilnehmerByName(params[1], data.teilnehmer);
      if (teilnehmer === null) {
        return false;
      }

      const number = parseInt(params[2], 10);
      if (Number.isNaN(number)) {
        return false;
      }
      this.kampfService.reduceIni(number, teilnehmer)

    }
  }
}
