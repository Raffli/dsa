import { Component, OnInit } from '@angular/core';
import {HeldenService} from '../service/helden.service';
import {Heldendata} from '../data/heldendata';
import {Held} from '../data/held';

@Component({
  selector: 'app-held-speichern',
  templateUrl: './held-speichern.component.html',
  styleUrls: ['./held-speichern.component.css']
})
export class HeldSpeichernComponent implements OnInit {

  constructor(private heldenService: HeldenService) { }
  public gruppe: string;
  public callTried: boolean = false;

  ngOnInit() {
    if(this.held) {
      this.processHeld();

    }

    this.heldenService.heldLoaded.subscribe(
      (held: Held) => {
        this.processHeld();

      },
    )
  }

  get held() {
    return this.heldenService.getHeld();
  }

  processHeld() {
    this.heldenService.getHeldByName(this.held.name).subscribe(
      (data: Heldendata) => {
        this.callTried = true;
        this.gruppe = data.gruppe;
      }, (error: any) => {
        this.callTried = true;
        console.log(error)
      }
    )
  }

}
