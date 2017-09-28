import { Component, OnInit } from '@angular/core';
import {Kampf} from '../../data/kampf/Kampf';
import {Kampfteilnehmer} from '../../data/kampf/Kampfteilnehmer';
import {KampfService} from '../../service/kampf.service';

@Component({
  selector: 'app-kampf-tool',
  templateUrl: './kampf-tool.component.html',
  styleUrls: ['./kampf-tool.component.css']
})
export class KampfToolComponent implements OnInit {

  public kampf: Kampfteilnehmer[];

  public displayLoad = false;
  public displayCreate = true;
  constructor(private kampfService: KampfService) { }

  ngOnInit() {
  }

  public neuerKampf() {
    this.displayCreate = true;
  }

  public kampfLaden() {
    this.displayLoad = true;
  }

  public loadKampfDialogClosed() {
    this.displayLoad = false;
  }

  public kampfLoaded(kampf: Kampfteilnehmer[]) {
    this.kampfService.prepareKampf(kampf)
    this.kampf = kampf;
    this.displayLoad = false;
    this.displayCreate = false;
  }

  public kampfBeenden() {
    this.kampf = null;
  }

}
