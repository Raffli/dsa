import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';
import {KampfService} from '../../../service/kampf.service';

@Component({
  selector: 'app-load-kampf-member',
  templateUrl: './load-kampf-member.component.html',
  styleUrls: ['./load-kampf-member.component.css']
})
export class LoadKampfMemberComponent implements OnInit {

  public gegnerNames: string[] = [];

  @Input()
  public visible: boolean;

  @Output()
  public loadFinished = new EventEmitter<Kampfteilnehmer>();

  constructor(private kampfService: KampfService) { }

  ngOnInit() {
    this.kampfService.getGegnernamen().subscribe(
      (data: string[]) => {
        this.gegnerNames = data;
      }
    )
  }

  onHide() {
    this.loadFinished.emit(null);
  }

  loadGegner(gegner: string) {
    this.kampfService.getKampfteilnehmerByName(gegner).subscribe(
      (data: any) => {
        this.loadFinished.emit(data.json)
      }
    )
  }

}
