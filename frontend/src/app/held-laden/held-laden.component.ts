import { Component, OnInit } from '@angular/core';
import {HeldenService} from "../service/helden.service";
import {Heldendata} from "../data/heldendata";
import {isUndefined} from "util";
import {Held} from "../data/held";
import {Router} from "@angular/router";
import {SessionStoreService} from "../service/session-store.service";
import {NameGroupPair} from '../data/NameGroupPair';

@Component({
  selector: 'app-held-laden',
  templateUrl: './held-laden.component.html',
  styleUrls: ['./held-laden.component.css']
})
export class HeldLadenComponent implements OnInit {


  public heldenName = null;
  public helden: string[][] = [];
  public gruppenNamen: string[] = [];


  constructor(private heldenService: HeldenService, private router: Router, private sessionStore: SessionStoreService) { }

  ngOnInit() {

    this.heldenService.heldLoaded.subscribe((data: Held) => {
      this.router.navigateByUrl('/heldenbogen')
    })
    this.heldenService.getHelden().subscribe(
      (data: NameGroupPair[]) => {
        const transformedData = {};
        data.forEach(value => {
          if (!transformedData[value.group]) {
            transformedData[value.group] = [];
          }
          transformedData[value.group].push(value.name);
        })
        this.gruppenNamen = Object.keys(transformedData);
        this.gruppenNamen.forEach(key => {
          this.helden.push(transformedData[key])
        })

      })

  }

  loadHeld(name: string) {
    this.heldenService.getHeldByName(name).subscribe(
      (data: Heldendata) => {
        if (data.xml !== undefined) {
          this.heldLoaded(data);
        }
      }, (error: any) => {
        console.log(error)
        if (error.status === 403) {
          this.heldenName = name;
        }
      }
    )
  }

  heldLoaded(data: Heldendata) {
    this.heldenName = null;
    if (data !== null) {
      this.sessionStore.heldname = data.name;
      this.heldenService.loadHeldByXML(data.xml);

    }
  }

  fileUploaded(event: any) {
    const files = event.srcElement.files;
    const reader = new FileReader();
    reader.onload = file => {
      const contents: any = file.target;
      const text = contents.result;
      this.heldenService.loadHeldByXML(text);
    }
    reader.readAsText(files[0]);
  }

}
