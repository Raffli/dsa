import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Kampfteilnehmer} from "../../../data/kampf/Kampfteilnehmer";
import {Attacke} from "../../../data/kampf/Attacke";
import {RuestungStats} from "../../../data/ausruestung/RuestungStats";
import {FormGroup, FormBuilder, FormControl, Validators, FormArray} from "@angular/forms";
import {KampfService} from "../../../service/kampf.service";
import {Message} from 'primeng/primeng';
import {MessageService} from '../../../service/message.service';

@Component({
  selector: 'app-create-kampf',
  templateUrl: './create-kampf.component.html',
  styleUrls: ['./create-kampf.component.css']
})
export class CreateKampfComponent implements OnInit {

  @Input()
  public visible: boolean;

  @Output()
  public kampfLoaded = new EventEmitter<Kampfteilnehmer[]>()

  public form: FormGroup;

  public showLoadKampfMember = false;
  public showSaveKampfDialog = false;
  public savingTeilnehmer: Kampfteilnehmer;
  public conflictingTeilnehmer: Kampfteilnehmer;

  constructor(private fb: FormBuilder, private kampfservice: KampfService, private messageService: MessageService) { }

  ngOnInit() {
    this.form = new FormGroup({
      teilnehmer: new FormArray([this.buildMember()])
    })
  }


  private buildMember() {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      iniBase: new FormControl('', Validators.required),
      maxLep: new FormControl('', Validators.required),
      ws: new FormControl('', Validators.required),
      pa: new FormControl('', Validators.required),
      ausweichen: new FormControl('', Validators.required),
      ruestung: new FormControl('', Validators.required),
      attacken: this.buildAttacken()
    })
  }

  addTeilnehmer(member ?: FormGroup) {
    if ( member === undefined) {
      member = this.buildMember();
    }
    (this.form.get('teilnehmer') as FormArray).push(member)
    return false;
  }

  buildAttacken() {
    return new FormArray([this.buildAttacke()
    ])
  }

  buildAttacke() {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      at: new FormControl('', Validators.required),
      schaden: new FormGroup({
        fix: new FormControl('', Validators.required),
        w6: new FormControl('', Validators.required)
      })
    })
  }

  addAttacke(index: number) {

    ((((this.form.get('teilnehmer') as FormArray).at(index)as any).controls.attacken) as FormArray).push(this.buildAttacke())
    return false;
  }

  getName(index) {
    return this.form.value.teilnehmer[index].name;
  }

  removeTeilnehmer(i: number) {
    (this.form.get('teilnehmer') as FormArray).removeAt(i);
    return false;
  }

  removeAttacke(i: number, j: number) {
    ((((this.form.get('teilnehmer') as FormArray).at(i)as any).controls.attacken) as FormArray).removeAt(j);
    return false;
  }

  saveToDatabase(i: number) {
    const data: Kampfteilnehmer = this.teilnehmer[i];
    this.kampfservice.getKampfteilnehmerByName(data.name).subscribe(
      (teilnehmer: Kampfteilnehmer) => {
        // Show decision dialog here
        this.savingTeilnehmer = data;
        this.conflictingTeilnehmer = teilnehmer;
        console.log('member already in db')
      }, (error: any) => {
        if (error.status === 404) {
          this.kampfservice.saveTeilnehmnerToDatabase(data).subscribe(
            () => {
              console.log('saved')
            }
          );
        }
      }
    )
    return false;
  }

  private performNameValidation(): boolean {
    const teilnehmer = this.form.value.teilnehmer;
    const names = {};
    for (let i = 0; i < teilnehmer.length; i++) {
      if (names[teilnehmer[i].name]) {

        this.messageService.addMessage({severity: 'error', summary: 'Doppelt vergebener Name'})
        return false;
      }
      names[teilnehmer[i].name] = true;
    }
    return true;
  }

  saveKampf() {
    if (!this.performNameValidation()) {
      return false;
    }
    this.showSaveKampfDialog = true;
    return false;
  }

  onSubmit(value: any) {
    if (!this.performNameValidation()) {
      return;
    }

    this.kampfLoaded.emit(value.teilnehmer);
  }

  get teilnehmer() {
    return this.form.value.teilnehmer;
  }

  saveKampfFinished() {
    this.showSaveKampfDialog = false;
  }

  loadTeilnehmer() {
    this.showLoadKampfMember = true;
    return false;
  }

  loadKampfmemberFinished(kampfteilnehmer: Kampfteilnehmer) {
    if(kampfteilnehmer !== null) {

      const member = this.buildMember();
      member.patchValue(kampfteilnehmer);
      this.addTeilnehmer(member);

    } else {
      this.showLoadKampfMember = false;
    }

  }


}
