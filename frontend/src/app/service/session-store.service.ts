import { Injectable } from '@angular/core';
import {HeldenService} from "./helden.service";
import {Heldendata} from "../data/heldendata";
import {Router} from "@angular/router";

@Injectable()
export class SessionStoreService {

  private _autoLoadHeld = false;

  private AUTO_LOAD_HELD_KEY = 'autoloadheld';
  private HELD_NAME_KEY = 'heldenname'

  get autoLoadHeld(): boolean {
    return this._autoLoadHeld;
  }

  set autoLoadHeld(value: boolean) {
    this._autoLoadHeld = value;
    if(value) {
      sessionStorage.setItem(this.AUTO_LOAD_HELD_KEY, value.toString())
    } else {
      sessionStorage.removeItem(this.AUTO_LOAD_HELD_KEY);
    }


  }

  public setAutoloadHeld(name: string) {
    sessionStorage.setItem(this.HELD_NAME_KEY, name)
  }

  constructor(private heldenService: HeldenService, private router: Router) {
    const loadHeld = sessionStorage.getItem(this.AUTO_LOAD_HELD_KEY)
    if(loadHeld !== null) {
      this._autoLoadHeld = true;
      const name = sessionStorage.getItem(this.HELD_NAME_KEY);
      if(name !== null) {
        console.log(name)
        this.heldenService.getHeldByName(name).subscribe(
          (data: Heldendata) => {
            if(data.xml !== undefined) {
              this.heldenService.loadHeldByXML(data.xml);
            }
          }
        )

      }
    }


  }



}
