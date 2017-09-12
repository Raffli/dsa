import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-load-kampf',
  templateUrl: './load-kampf.component.html',
  styleUrls: ['./load-kampf.component.css']
})
export class LoadKampfComponent implements OnInit {

  @Input()
  public visible: boolean;

  constructor() { }

  ngOnInit() {
  }

}
