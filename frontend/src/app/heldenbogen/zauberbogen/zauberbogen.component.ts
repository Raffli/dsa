import {Component, Input, OnInit} from '@angular/core';
import {Held} from '../../data/held';

@Component({
  selector: 'app-zauberbogen',
  templateUrl: './zauberbogen.component.html',
  styleUrls: ['./zauberbogen.component.css']
})
export class ZauberbogenComponent implements OnInit {

  @Input()
  public held: Held


  constructor() { }

  ngOnInit() {
  }

}
