import { Component, OnInit, Input } from '@angular/core';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';
import {Command} from './commands/Command';
import {CommandDamage} from './commands/CommandDamage';
import {CommandIni} from './commands/CommandIni';
import {KampfService} from '../../../service/kampf.service';

@Component({
  selector: 'app-display-kampf',
  templateUrl: './display-kampf.component.html',
  styleUrls: ['./display-kampf.component.css']
})
export class DisplayKampfComponent implements OnInit {

  private mapping: {[key: string]: Command} = {};
  private commands = [];

  public command: string;
  @Input()
  public teilnehmer: Kampfteilnehmer[];

  constructor(private kampfService: KampfService) { }

  ngOnInit() {
    this.addCommand(new CommandDamage(this.kampfService));
    this.addCommand(new CommandIni(this.kampfService));
  }

  private addCommand(command: Command) {
    this.mapping[command.getName()] = command;
    this.commands.push(command);
  }

  public onCommandEnter() {

    const splits = this.command.split(' ');
    const command = this.mapping[splits[0]];
    if (command !== null) {
      command.perform(splits, this.teilnehmer);
    }
  }

  public onCommandTab() {
    const possibleMatches = [];
    const splits = this.command.split(' ');
    if (splits.length === 1) {
      for (let i = 0; i < this.commands.length; i++) {
        if (this.commands[i].getName().startsWith(splits[0])) {
          possibleMatches.push(this.commands[i]);
        }
      }
      if (possibleMatches.length === 1) {
        const cmd = possibleMatches[0];
        this.command = cmd.getName() + ' ';
      } else {
        this.command = this.sharedStart(possibleMatches)
      }
    } else {
      const cmd = this.mapping[splits[0]];
      if (cmd !== undefined) {
        this.command = cmd.autoComplete(this.command, splits, this.teilnehmer)
      }
    }
    return false;
  }

  sharedStart(array: Command[]): string {

    const A = array.concat().sort(),
      a1 = A[0], a2 = A[A.length - 1], L =  a1.getName().length;
    let i = 0;
    while (i < L && a1.getName().charAt(i) === a2.getName().charAt(i)) {
      i ++;
    }
    return a1.getName().substring(0, i);
  }

}
