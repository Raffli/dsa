import {Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {Kampfteilnehmer} from '../../../../data/kampf/Kampfteilnehmer';
import {KampfService} from '../../../../service/kampf.service';
import {Kampf} from "../../../../data/kampf/Kampf";

@Component({
  selector: 'app-save-kampf',
  templateUrl: './save-kampf.component.html',
  styleUrls: ['./save-kampf.component.css']
})
export class SaveKampfComponent implements OnInit {

  @Output()
  public saveFinished = new EventEmitter<void>();

  @Input()
  public visible = false;

  @Input()
  public kampfteilnehmer: Kampfteilnehmer[];

  public conflictingKampfteilnehmer: Kampfteilnehmer[];

  public kampfname = '';


  constructor(private kampfService: KampfService) { }

  saveKampf() {
    this.kampfteilnehmer.forEach(val => {
      val.currentLep = val.maxLep;
    })
    this.kampfService.getKampfByName(this.kampfname).subscribe(
      (data: Kampf) => {
        this.conflictingKampfteilnehmer = (data.json as any);
      }, (error: any) => {
        if (error.status === 404) {
          this.kampfService.saveKampfToDatabase(this.kampfteilnehmer, this.kampfname).subscribe(
            () => {
              console.log('saved')
            }
          )
        }
      }
    )
  }

  onDialogHide() {
    this.saveFinished.emit();
  }

  ngOnInit() {
  }


}
