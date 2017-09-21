import {Command} from './Command';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
/**
 * Created by pahil on 21.09.2017.
 */
export class CommandIni extends Command {

  public getName(): string {
    return 'ini';
  }

  public autoComplete(string: string, params: string[], kampfteilnehmer: Kampfteilnehmer[]): string {
    if (params.length === 2) {
      return this.provideNameMatching(string, kampfteilnehmer);
    }
    return string;
  }

  public perform(params: string[] , kampfteilnehmer: Kampfteilnehmer[]) {
    if (params.length === 3) {
      const teilnehmer = this.findTeilnehmerByName(params[1], kampfteilnehmer);
      if (teilnehmer === null) {
        return;
      }

      const number = parseInt(params[2], 10);
      if (number.toString() === 'NaN') {
        return;
      }
      teilnehmer.ini -= number;
    }
  }
}
