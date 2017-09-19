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

  public teilnehmer: Kampfteilnehmer[] = [];

  public form: FormGroup;

  constructor(private fb: FormBuilder, private kampfservice: KampfService) { }

  ngOnInit() {
    this.form = new FormGroup({
      teilnehmer: new FormArray([this.buildMember()])
    })

    console.log(this.form.get('teilnehmer'))

  }


  private buildMember() {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      ini: new FormControl('', Validators.required),
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

    return false;
  }

}
