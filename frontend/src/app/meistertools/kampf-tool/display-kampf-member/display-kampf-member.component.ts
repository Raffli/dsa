import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';

@Component({
  selector: 'app-display-kampf-member',
  templateUrl: './display-kampf-member.component.html',
  styleUrls: ['./display-kampf-member.component.css']
})
export class DisplayKampfMemberComponent implements OnInit {

  @Input()
  public active = false;

  @Input()
  public teilnehmer: Kampfteilnehmer;

  @Output()
  public onAttack = new EventEmitter<number>();

  @Output()
  public onParry = new EventEmitter<void>();


  constructor() { }

  ngOnInit() {
  }

  attack(index: number) {
    this.onAttack.emit(index);
  }

  parry() {
    this.onParry.emit();
  }



}
