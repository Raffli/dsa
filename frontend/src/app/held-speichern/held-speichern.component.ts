import { Component, OnInit } from '@angular/core';
import {HeldenService} from '../service/helden.service';
import {Heldendata} from '../data/heldendata';
import {Held} from '../data/held';
import {SelectItem} from 'primeng/primeng';
import {MessageService} from '../service/message.service';

@Component({
  selector: 'app-held-speichern',
  templateUrl: './held-speichern.component.html',
  styleUrls: ['./held-speichern.component.css']
})
export class HeldSpeichernComponent implements OnInit {

  public gruppe: string;
  public password: string = null;

  public gruppen: SelectItem[] = [];


  constructor(private heldenService: HeldenService, private messageService: MessageService) { }

  ngOnInit() {
    this.heldenService.getGroups().subscribe(
      (data: string[]) => {
        this.gruppen = [];
        this.gruppen.push({label: '', value: undefined})
        data.forEach(grp => {
          this.gruppen.push({label: grp, value: grp});
        })
      }
    )
    if (this.held) {
      this.processHeld();

    }

    this.heldenService.heldLoaded.subscribe(
      (held: Held) => {
        this.processHeld();

      },
    )
  }

  public get held() {
    return this.heldenService.getHeld();
  }

  private processHeld() {
    this.heldenService.getHeldByName(this.held.name).subscribe(
      (data: Heldendata) => {
        this.gruppe = data.gruppe;
      }, (error: any) => {

      }
    )
  }

  public saveHeld() {
    if (this.gruppe == null) return;
    this.heldenService.saveHeld(this.held, this.gruppe, this.password).subscribe(
      () => {
        this.messageService.addMessage({severity: 'success', detail: 'Held wurde erfolgreich gespeichert'})
      },
      (error: any) => {
        console.log(error)
        this.messageService.addMessage({severity: 'error', detail: error._body})
      }
    );
  }

}
