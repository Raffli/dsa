import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Kampf} from '../../../data/kampf/Kampf';
import {KampfService} from '../../../service/kampf.service';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';

@Component({
  selector: 'app-load-kampf',
  templateUrl: './load-kampf.component.html',
  styleUrls: ['./load-kampf.component.css']
})
export class LoadKampfComponent implements OnInit {

  @Output()
  public dialogClosed = new EventEmitter<void>()

  @Output()
  public kampfLoaded = new EventEmitter<Kampfteilnehmer[]>()

  @Input()
  public visible: boolean;

  public kampfNamen: string[] = [];

  constructor(private kampfService: KampfService) { }

  ngOnInit() {
    this.kampfService.getKampfnamen().subscribe(
      (data: string[]) => {
        this.kampfNamen = data;
      }, (error:any) => {

      }
    )
  }

  onHide() {
    this.dialogClosed.emit();
  }

  loadKampf(name: string) {
    console.log(name);
    this.kampfService.getKampfByName(name).subscribe(
      (data: Kampf) => {
        this.kampfLoaded.emit(data.json as any)
      }
    )
  }

}
