import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Held} from "../data/held";
import {HeldenService} from "../service/helden.service";
import {Attribut} from "../data/attribut";

@Component({
  selector: 'held-detail',
  templateUrl: './held-detail.component.html',
  styleUrls: ['./held-detail.component.css']
})
export class HeldDetailComponent implements OnInit {

  constructor(private heldenService: HeldenService) { }

  public data = [{title: 'asdasd'}];

  @Input()
  held: Held;

  @Output()
  heldChanged = new EventEmitter<Held>();

  ngOnInit() {
  }

  fileUploaded(event: any) {

    var files = event.srcElement.files;


    var reader = new FileReader();
    reader.onload = file => {
      var contents: any = file.target;
      let text = contents.result;
      this.heldenService.loadHeld(text, (held:Held) => {
        if(held != null) {
          this.heldChanged.emit(held);
        }
      });
      }


    reader.readAsText(files[0]);
  }



}
