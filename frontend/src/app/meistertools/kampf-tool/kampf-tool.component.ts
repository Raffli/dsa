import { Component, OnInit } from '@angular/core';
import {Kampf} from '../../data/kampf/Kampf';
import {Kampfteilnehmer} from '../../data/kampf/Kampfteilnehmer';

@Component({
  selector: 'app-kampf-tool',
  templateUrl: './kampf-tool.component.html',
  styleUrls: ['./kampf-tool.component.css']
})
export class KampfToolComponent implements OnInit {

  public kampf: Kampfteilnehmer[];

  public displayLoad = false;
  public displayCreate = true;
  constructor() { }

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
    this.kampf = kampf;
    this.displayLoad = false;
    this.displayCreate = false;
  }

}
