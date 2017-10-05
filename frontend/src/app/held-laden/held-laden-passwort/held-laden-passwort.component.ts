import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Heldendata} from '../../data/heldendata';
import {HeldenService} from '../../service/helden.service';
import {MessageService} from '../../service/message.service';
import {SessionStoreService} from '../../service/session-store.service';

@Component({
  selector: 'app-held-laden-passwort',
  templateUrl: './held-laden-passwort.component.html',
  styleUrls: ['./held-laden-passwort.component.css']
})
export class HeldLadenPasswortComponent implements OnInit {

  @Input()
  public name: string;

  public password: string;

  @Output()
  public heldLoaded = new EventEmitter<Heldendata>();

  constructor(private heldenService: HeldenService, private messageService: MessageService, private sessionStoreService: SessionStoreService) { }

  ngOnInit() {
  }

  loadHeld() {
    this.heldenService.getHeldByName(this.name, this.password).subscribe(
      (data: Heldendata) => {
        this.heldLoaded.emit(data)
        this.sessionStoreService.heldpasswort = this.password;
      }, (error: any) => {
        this.messageService.addMessage({
          severity: 'error',
          detail: error._body
        })
      }
    )
  }

  onDialogHide() {
    this.heldLoaded.emit(null);
  }

}
