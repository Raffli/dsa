import {Command} from './Command';
import {Kampfdata} from '../../../../data/kampf/Kampfdata';
import {Attacke} from '../../../../data/kampf/Attacke';
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
    } else if ( params.length === 3) {
      console.log('providing')
      const teilnehmer = this.findTeilnehmerByName(params[1], data.teilnehmer);
      return this.provideAttackeMatching(string, teilnehmer.attacken)
    }
    return string;
  }

  public perform(params: string[] , data: Kampfdata): boolean {

    if (params.length === 2 || params.length === 3 || params.length === 4 && params[3] === '') {
      const teilnehmer = this.findTeilnehmerByName(params[1], data.teilnehmer);
      if (teilnehmer === null) {
        return false;
      }
      let attacke;
      if (params.length === 2 || params.length === 3 && params[2] === '' ) {
        console.log('if')
        attacke = teilnehmer.attacken[0];
      } else {
        console.log('else')
        const attackenIndex = parseInt(params[2], 10);
        if (Number.isNaN(attackenIndex)) {
          attacke = this.findAttackeByName(params[3], teilnehmer.attacken);
        } else {
          attacke = teilnehmer.attacken[attackenIndex];
        }
      }
      console.log(attacke)
      if (attacke === undefined) {
        this.messageService.error('Teilnehmer Attacke nicht gefunden')
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

  protected provideAttackeMatching(command: string, attacken: Attacke[]): string {
    const index = command.lastIndexOf(' ');
    const sub = command.substr(index + 1, command.length);
    const shared = this.sharedStartAttacken(attacken, sub);
    if (shared.length === 0 ) {
      return command;
    } else {
      return command.substr(0, index) + ' ' + shared + ' ';
    }

  }

  private sharedStartAttacken(array: Attacke[], sub: string): string {

    const possibleMatches = [];
    array.forEach(member => {
      if (member.name.startsWith(sub)) {
        possibleMatches.push(member);
      }
    })
    if (possibleMatches.length === 0 ) {
      return '';
    }
    const A = possibleMatches.concat().sort(),
      a1 = A[0], a2 = A[A.length - 1], L =  a1.name.length;
    let i = 0;
    while (i < L && a1.name.charAt(i) === a2.name.charAt(i)) {
      i ++;
    }
    return a1.name.substring(0, i);
  }

  private findAttackeByName(name: string, attacken: Attacke[]): Attacke{
    for ( let i = 0; i < attacken.length; i++) {
      if (attacken[i].name === name) {
        return attacken[i];
      }
    }
  }
}
