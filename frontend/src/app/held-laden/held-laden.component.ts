import { Component, OnInit } from '@angular/core';
import {HeldenService} from "../service/helden.service";
import {Heldendata} from "../data/heldendata";
import {isUndefined} from "util";
import {Held} from "../data/held";
import {Router} from "@angular/router";
import {SessionStoreService} from "../service/session-store.service";

@Component({
  selector: 'app-held-laden',
  templateUrl: './held-laden.component.html',
  styleUrls: ['./held-laden.component.css']
})
export class HeldLadenComponent implements OnInit {


  public heldenNamen: string[] = [];

  constructor(private heldenService: HeldenService, private router: Router, private sessionStore: SessionStoreService) { }

  ngOnInit() {

    this.heldenService.heldLoaded.subscribe((data: Held) => {
      this.router.navigateByUrl('/heldenbogen')
    })
    this.heldenService.getHeldenNamen().subscribe(
      (data: string[]) => {
        this.heldenNamen = data;
      })

  }

  loadHeld(name: string){
    this.heldenService.getHeldByName(name).subscribe(
      (data: Heldendata) => {
        if(data.xml !== undefined) {
          this.sessionStore.setAutoloadHeld(name);
          this.heldenService.loadHeldByXML(data.xml);
        }
      }
    )
  }

}
