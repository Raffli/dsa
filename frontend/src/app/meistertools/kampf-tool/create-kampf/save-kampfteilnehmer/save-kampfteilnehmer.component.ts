import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
import {KampfService} from '../../../../service/kampf.service';

@Component({
  selector: 'app-save-kampfteilnehmer',
  templateUrl: './save-kampfteilnehmer.component.html',
  styleUrls: ['./save-kampfteilnehmer.component.css']
})
export class SaveKampfteilnehmerComponent implements OnInit {


  constructor(private kampfService: KampfService) {

  }

  @Input()
  public savingTeilnehmer: Kampfteilnehmer;

  @Input()
  public conflictingTeilnehmer: Kampfteilnehmer;

  @Output()
  public conflictResolved = new EventEmitter<void>();

  saveNew() {
    this.kampfService.saveTeilnehmnerToDatabase(this.savingTeilnehmer).subscribe(
      () => {
        this.conflictResolved.emit();
      }
    )

  }

  keepOld() {
    this.conflictResolved.emit();
  }


  ngOnInit() {
  }

}
