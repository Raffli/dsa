import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-create-kampf',
  templateUrl: './create-kampf.component.html',
  styleUrls: ['./create-kampf.component.css']
})
export class CreateKampfComponent implements OnInit {

  @Input()
  public visible: boolean;

  constructor() { }

  ngOnInit() {
  }

}
