import {Command} from "./Command";
import {Kampfteilnehmer} from "../../../../data/kampf/Kampfteilnehmer";
import {Kampfdata} from "../../../../data/kampf/Kampfdata";
export class CommandNext extends Command {

  public getName(): string {
    return 'next';
  }

  public autoComplete(string: string, params: string[], data: Kampfdata): string {
    return 'next'
  }

  public perform(params: string[] , data: Kampfdata): boolean {

    const newValue = (data.current+1) % data.teilnehmer.length;
    data.current = newValue;
    return newValue == 0;
  }

  public getDescription(): string {
    return 'next';
  }
}
