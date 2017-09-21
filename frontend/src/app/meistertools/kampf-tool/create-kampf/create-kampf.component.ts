import { Component, OnInit, Input } from '@angular/core';
import {Kampfteilnehmer} from "../../../data/kampf/Kampfteilnehmer";
import {Attacke} from "../../../data/kampf/Attacke";
import {RuestungStats} from "../../../data/ausruestung/RuestungStats";
import {FormGroup, FormBuilder, FormControl, Validators, FormArray} from "@angular/forms";
import {KampfService} from "../../../service/kampf.service";

@Component({
  selector: 'app-create-kampf',
  templateUrl: './create-kampf.component.html',
  styleUrls: ['./create-kampf.component.css']
})
export class CreateKampfComponent implements OnInit {

  @Input()
  public visible: boolean;

  public form: FormGroup;

  public showSaveKampfDialog = false;
  public showSaveTeilnehmerDialog = false;
  constructor(private fb: FormBuilder, private kampfservice: KampfService) { }

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
      pa: new FormControl('', Validators.required),
      ausweichen: new FormControl('', Validators.required),
      ruestung: new FormControl('', Validators.required),
      attacken: this.buildAttacken()
    })
  }

  addTeilnehmer() {
    (this.form.get('teilnehmer') as FormArray).push(this.buildMember())
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

  onSubmit(value: any) {
    console.log(value.teilnehmer)
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
    data.currentLep = data.maxLep;
    this.showSaveTeilnehmerDialog = true;
    this.kampfservice.getKampfteilnehmerByName(data.name).subscribe(
      (teilnehmer: Kampfteilnehmer) => {
        // Show decision dialog here
        console.log('member already in db')
      }, (error: any) => {
        if (error.status === 404) {
          this.kampfservice.saveTeilnehmnerToDatabase(data);
        }
      }
    )
    return false;
  }

  saveKampf() {
    this.showSaveKampfDialog = true;
    return false;
  }

  get teilnehmer() {
    return this.form.value.teilnehmer;
  }

  saveKampfFinished() {
    this.showSaveKampfDialog = false;
  }

  finishCreation() {
    console.log('finished creation')
  }

}
