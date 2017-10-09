import {Command} from './Command';
import {Kampfdata} from '../../../../data/kampf/Kampfdata';
/**
 * Created by pahil on 05.10.2017.
 */
export class CommandParry  extends Command {

  public getName(): string {
    return 'parry';
  }

  public autoComplete(string: string, params: string[], data: Kampfdata): string {
    if (params.length === 2) {
      return this.provideNameMatching(string, data.teilnehmer);
    }
    return string;
  }

  public perform(params: string[] , data: Kampfdata): boolean {
    if (params.length >= 2) {
      const teilnehmer = this.findTeilnehmerByName(params[1], data.teilnehmer);
      if (teilnehmer === null) {
        return false;
      }
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= teilnehmer.ausweichen) {
        this.messageService.info('Ausgewichen : ' + roll);
      } else {
        this.messageService.info('Treffer: ' + roll);

      }

    }
    return false;
  }

  public getDescription(): string {
    return 'parry <name>';
  }
}
