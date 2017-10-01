import {Command} from './Command';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
import {Kampfdata} from "../../../../data/kampf/Kampfdata";

export class CommandAddWound extends Command {

  public getName(): string {
    return 'addwound';
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

      const amount = parseInt(params[2], 10);
      if (Number.isNaN(amount)) {
        return false;
      }
      this.kampfService.addWounds(amount, teilnehmer)
    }
  }

  public getDescription(): string {
    return 'addwound <teilnehmername> <amount>';
  }
}
