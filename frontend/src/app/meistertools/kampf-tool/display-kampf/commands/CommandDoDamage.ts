import {Command} from './Command';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
import {Kampfdata} from "../../../../data/kampf/Kampfdata";
import {Attacke} from '../../../../data/kampf/Attacke';
/**
 * Created by pahil on 21.09.2017.
 */
export class CommandDoDamage extends Command {

  public getName(): string {
    return 'dodamage';
  }

  public autoComplete(string: string, params: string[], data: Kampfdata): string {
    if (params.length === 2) {
      return this.provideNameMatching(string, data.teilnehmer);
    } else if ( params.length === 3) {
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
        attacke = teilnehmer.attacken[0];
      } else {
        const attackenIndex = parseInt(params[2], 10);
        if (Number.isNaN(attackenIndex)) {
          attacke = this.findAttackeByName(params[3], teilnehmer.attacken);
        } else {
          attacke = teilnehmer.attacken[attackenIndex];
        }
      }
      if (attacke === undefined) {
        this.messageService.error('Teilnehmer Attacke nicht gefunden')
        return false;
      }
      let dmg = attacke.schaden.fix;
      for (let i = 0; i < attacke.schaden.w6; i++) {

      }



    }
    return false;
  }


  public getDescription(): string {
    return 'damage <teilnehmername> <amount>';
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
