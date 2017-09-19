import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';

@Component({
  selector: 'app-create-kampf-member',
  templateUrl: './create-kampf-member.component.html',
  styleUrls: ['./create-kampf-member.component.css']
})
export class CreateKampfMemberComponent implements OnInit {

  @Output()
  public memberCreated = new EventEmitter<Kampfteilnehmer>();

  constructor() { }

  ngOnInit() {
  }

}
