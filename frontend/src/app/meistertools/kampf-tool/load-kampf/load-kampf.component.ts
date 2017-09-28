import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Kampf} from '../../../data/kampf/Kampf';
import {KampfService} from '../../../service/kampf.service';
import {Kampfteilnehmer} from '../../../data/kampf/Kampfteilnehmer';
import {environment} from "../../../../environments/environment";

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

    if (!environment.production) {
      this.kampfService.getKampfByName('Testkampf').subscribe(
        (data: Kampf) => {
          this.kampfLoaded.emit(data.json as any)
        }
      )
    }

  }

  onHide() {
    this.dialogClosed.emit();
  }

  loadKampf(name: string) {
    this.kampfService.getKampfByName(name).subscribe(
      (data: Kampf) => {
        this.kampfLoaded.emit(data.json as any)
      }
    )
  }

}
