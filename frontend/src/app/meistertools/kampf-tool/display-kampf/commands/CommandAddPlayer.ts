import {Command} from "./Command";
import {Kampfdata} from "../../../../data/kampf/Kampfdata";
import {Kampfteilnehmer} from "../../../../data/kampf/Kampfteilnehmer";
export class CommandAddPlayer extends Command {

  public getName(): string {
    return 'addplayer';
  }

  public autoComplete(string: string, params: string[], data: Kampfdata): string {
    return string;
  }

  public perform(params: string[] , data: Kampfdata): boolean {
    console.log(params.length)
    if (params.length === 4) {
      //1 = name
      //2 = inibase
      //3 = ini
      const teilnehmer: Kampfteilnehmer = {
        name: params[1],
        iniBase: parseInt(params[2], 10),
        ini: parseInt(params[3], 10)
      } as Kampfteilnehmer

      data.teilnehmer.push(teilnehmer)
      return true;
    }

    return false;
  }

  public getDescription(): string {
    return 'addplayer <name> <inibase> <ini>';
  }

}
