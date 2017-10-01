import {Command} from "./Command";
import {Kampfdata} from "../../../../data/kampf/Kampfdata";
export class CommandIniAdd extends Command {

  public getName(): string {
    return 'iniadd';
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
      this.kampfService.addIni(number, teilnehmer)

    }
  }
}
