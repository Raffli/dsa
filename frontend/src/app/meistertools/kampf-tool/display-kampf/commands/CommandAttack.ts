import {Command} from './Command';
import {Kampfdata} from '../../../../data/kampf/Kampfdata';
/**
 * Created by pahil on 05.10.2017.
 */
export class CommandAttack  extends Command {

  public getName(): string {
    return 'attack';
  }

  public autoComplete(string: string, params: string[], data: Kampfdata): string {
    if (params.length === 2) {
      return this.provideNameMatching(string, data.teilnehmer);
    }
    return string;
  }

  public perform(params: string[] , data: Kampfdata): boolean {

    if (params.length === 2 || params.length === 3 && params[2] === '') {
      const teilnehmer = this.findTeilnehmerByName(params[1], data.teilnehmer);
      if (teilnehmer === null) {
        return false;
      }
      const attacke = teilnehmer.attacken[0];
      if (attacke === undefined) {
        this.messageService.error('Teilnehmer hat keine Attacke')
        return false;
      }
      const roll = Math.floor(Math.random() * 20) + 1;
      if (roll <= attacke.at) {
        this.messageService.info('Treffer: ' + roll);
      } else {
        this.messageService.info('Daneben: ' + roll);

      }

    }
    return false;
  }

  public getDescription(): string {
    return 'attack <name> <?attackenindex>';
  }
}
