import { Injectable } from '@angular/core';
import {HeldenService} from "./helden.service";
import {Heldendata} from "../data/heldendata";
import {Router} from "@angular/router";

@Injectable()
export class SessionStoreService {

  private AUTO_LOAD_HELD_KEY = 'autoloadheld';
  private HELD_NAME_KEY = 'heldenname'
  private HELD_PASSWORT_KEY= 'heldpasswort'

  get autoLoadHeld(): boolean {
    return sessionStorage.getItem(this.AUTO_LOAD_HELD_KEY) !== null;
  }

  set autoLoadHeld(value: boolean) {
    if (value) {
      sessionStorage.setItem(this.AUTO_LOAD_HELD_KEY, '')
    } else {
      sessionStorage.removeItem(this.AUTO_LOAD_HELD_KEY);
    }


  }

  set heldname(value: string) {
    sessionStorage.setItem(this.HELD_NAME_KEY, value)
  }

  get heldname() {
    return sessionStorage.getItem(this.HELD_NAME_KEY);
  }

  set heldpasswort(value: string) {
    sessionStorage.setItem(this.HELD_PASSWORT_KEY, value)
  }

  get heldpasswort() {
    return sessionStorage.getItem(this.HELD_PASSWORT_KEY);
  }

  constructor(private heldenService: HeldenService, private router: Router) {
    if (this.autoLoadHeld) {
      const name =  this.heldname;
      if (name !== null) {
        this.heldenService.getHeldByName(name, this.heldpasswort).subscribe(
          (data: Heldendata) => {
            if (data.xml !== undefined) {
              this.heldenService.loadHeldByXML(data.xml);
            }
          }
        )

      }
    }
  }



}
