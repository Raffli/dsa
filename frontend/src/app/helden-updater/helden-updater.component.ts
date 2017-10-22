import { Component, OnInit } from '@angular/core';
import {HeldenService} from "../service/helden.service";
import {UploadInfo} from "../data/UploadInfo";
import {Held} from "../data/held";
import {MessageService} from "../service/message.service";
import {HeldenUpdaterService} from "../service/helden-updater.service";

@Component({
  selector: 'app-helden-updater',
  templateUrl: './helden-updater.component.html',
  styleUrls: ['./helden-updater.component.css']
})
export class HeldenUpdaterComponent implements OnInit {


  public uploads: UploadInfo[];

  public held: Held;
  public key: string;

  constructor(private heldenService: HeldenService, private messageService: MessageService, private updaterService: HeldenUpdaterService) { }

  ngOnInit() {

    this.heldenService.getUploadInfos().subscribe(
      (data: UploadInfo[]) => {
        this.uploads = data;
      },
      (error: any) => {
        console.log(error)
        if(error.status === 511) {
          this.messageService.error(error._body)
        }
      }
    )
    this.held = this.heldenService.getHeld();

    this.heldenService.heldLoaded.subscribe(
      (data: Held) => {
        this.held = data;
      }
    )
  }

  onClick(uploadInfo: UploadInfo) {
    this.heldenService.updateHeld(this.held.name, uploadInfo.downloadLink).subscribe(
      () => {
        this.messageService.info('Held erfolgreich aktualisiert');
      },
      (error: any) => {
        console.log(error)
        if(error.status === 404) {
          this.messageService.error(error._body)
        }
      }
    )
  }

  updateKey() {
    this.updaterService.updateKey(this.key).subscribe(
      () => {
        console.log('donem')
      }
    )
  }

}
