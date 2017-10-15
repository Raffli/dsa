import {Component, Input, OnInit} from '@angular/core';
import {Held} from '../../data/held';
import {Zauber} from '../../data/Zauber';
import {TalentBase} from '../../data/TalentBase';

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

  getSpezialisierungen(zauber: TalentBase): string {
    if (zauber.spezialisierungen.length === 0) {
      return ''
    }
    let ret = '(';
    for (let i = 0; i < zauber.spezialisierungen.length; i++) {
      ret += zauber.spezialisierungen[i].name
      if (i !== zauber.spezialisierungen.length - 1) {
        ret += ' |'
      }
    }
    ret += ')';
    return ret;
  }

}
