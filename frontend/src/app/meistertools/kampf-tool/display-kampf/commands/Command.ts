import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
import {Kampf} from '../../../../data/kampf/Kampf';
import {KampfService} from '../../../../service/kampf.service';
import {Kampfdata} from "../../../../data/kampf/Kampfdata";
import {MessageService} from '../../../../service/message.service';
/**
 * Created by pahil on 21.09.2017.
 */
export abstract class Command {
  public abstract getName(): string;
  public abstract perform(params: string[], data: Kampfdata): boolean;
  public abstract autoComplete(string: string, params: string[], data: Kampfdata): string;
  public abstract getDescription(): string;

  constructor(protected kampfService: KampfService, protected messageService: MessageService) {

  }



  protected findTeilnehmerByName(name: string, teilnehmer: Kampfteilnehmer[]): Kampfteilnehmer{
    for ( let i = 0; i < teilnehmer.length; i++) {
      if (teilnehmer[i].name === name) {
        return teilnehmer[i];
      }
    }
  }

  protected provideNameMatching(command: string, kampfteilnehmer: Kampfteilnehmer[]): string {
    const index = command.lastIndexOf(' ');
    const sub = command.substr(index + 1, command.length);
    const shared = this.sharedStart(kampfteilnehmer, sub);
    if (shared.length === 0 ) {
      return command;
    } else {
      return command.substr(0, index) + ' ' + shared + ' ';
    }

  }

  private sharedStart(array: Kampfteilnehmer[], sub: string): string {

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
}
