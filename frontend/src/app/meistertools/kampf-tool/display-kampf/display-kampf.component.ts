import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';
import {Command} from './commands/Command';
import {CommandDamage} from './commands/CommandDamage';
import {CommandIni} from './commands/CommandIni';
import {KampfService} from '../../../service/kampf.service';
import {CommandNext} from "./commands/CommandNext";
import {Kampfdata} from "../../../data/kampf/Kampfdata";
import {CommandAddPlayer} from "./commands/CommandAddPlayer";
import {CommandIniAdd} from "./commands/CommandIniAdd";
import {CommandAddWound} from './commands/CommandAddWound';
import {MessageService} from '../../../service/message.service';
import {CommandParry} from './commands/CommandParry';
import {CommandAttack} from './commands/CommandAttack';

@Component({
  selector: 'app-display-kampf',
  templateUrl: './display-kampf.component.html',
  styleUrls: ['./display-kampf.component.css']
})
export class DisplayKampfComponent implements OnInit, OnChanges {

  private mapping: {[key: string]: Command} = {};
  private commands = [];

  public command: string = '';
  @Input()
  public teilnehmer: Kampfteilnehmer[];

  @Input()
  public readonly: boolean = false;

  public data: Kampfdata = {
    current: 0,
    teilnehmer: []
  }


  constructor(private kampfService: KampfService, private messageService: MessageService) { }

  ngOnInit() {
    this.addCommand(new CommandDamage(this.kampfService, this.messageService));
    this.addCommand(new CommandIni(this.kampfService, this.messageService));
    this.addCommand(new CommandIniAdd(this.kampfService, this.messageService));
    this.addCommand(new CommandAddWound(this.kampfService, this.messageService));
    this.addCommand(new CommandNext(this.kampfService, this.messageService));
    this.addCommand(new CommandAddPlayer(this.kampfService, this.messageService));
    this.addCommand(new CommandParry(this.kampfService, this.messageService));
    this.addCommand(new CommandAttack(this.kampfService, this.messageService));

  }

  ngOnChanges() {
    this.data = {
      current: this.data.current,
      teilnehmer: this.teilnehmer
    }

    this.sortTeilnehmer();
  }

  private addCommand(command: Command) {
    this.mapping[command.getName()] = command;
    this.commands.push(command);
  }

  public onCommandEnter() {
    this.executeCommand(this.command);
  }

  public executeCommand(cmd: string) {
    const splits = cmd.split(' ');
    const command = this.mapping[splits[0]];
    if (command !== undefined) {
      if (command.perform(splits, this.data)) {
        this.sortTeilnehmer();
      }
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
      } else if (possibleMatches.length > 1){
        this.command = this.sharedStart(possibleMatches)
      }
    } else {
      const cmd = this.mapping[splits[0]];
      if (cmd !== undefined) {
        this.command = cmd.autoComplete(this.command, splits, this.data)
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

  public getCommands(): Command[] {
    return this.commands;
  }

  private sortTeilnehmer() {
    this.data.teilnehmer = this.data.teilnehmer.sort(
      (a, b) => {
        if (a.ini === b.ini) {
          if (a.iniBase === b.iniBase) {

          } else {
            return b.iniBase - a.iniBase;
          }
        } else {
          return b.ini - a.ini;
        }
        return 0;
      })
  }

  onAttack(teilnehmer: Kampfteilnehmer, index: number) {
    this.executeCommand('attack ' + teilnehmer.name + ' ' + index)
  }

  onParry(teilnehmer: Kampfteilnehmer) {
    this.executeCommand('parry ' + teilnehmer.name)
  }



}
