import { Component, OnInit, Input } from '@angular/core';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';

@Component({
  selector: 'app-display-kampf-member',
  templateUrl: './display-kampf-member.component.html',
  styleUrls: ['./display-kampf-member.component.css']
})
export class DisplayKampfMemberComponent implements OnInit {

  @Input()
  public teilnehmer: Kampfteilnehmer;

  constructor() { }

  ngOnInit() {
  }

}
