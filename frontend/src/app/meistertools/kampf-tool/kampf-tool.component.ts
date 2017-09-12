import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kampf-tool',
  templateUrl: './kampf-tool.component.html',
  styleUrls: ['./kampf-tool.component.css']
})
export class KampfToolComponent implements OnInit {

  public kampfKonfiguriert = false;
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

}
