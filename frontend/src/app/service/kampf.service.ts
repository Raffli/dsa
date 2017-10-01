import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import {RequestOptionsArgs, Response} from "@angular/http"
import {Kampf} from "../data/kampf/Kampf";
import {Kampfteilnehmer} from "../data/kampf/Kampfteilnehmer";
@Injectable()
export class KampfService {

  constructor(private rest: RestService) { }

  public saveKampfToDatabase(teilnehmer: Kampfteilnehmer[], name: string): Observable<void> {
    const kampf = {
      name: name,
      json: JSON.stringify(teilnehmer)
    }
    return this.rest.post('kampf/kampf', kampf)
      .catch((error: any) => Observable.throw(error))
  }

  public getKampfByName(name: string): Observable<Kampf> {
    return this.rest.get('kampf/kampf/byname?name=' + name).map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error))
  }

  public saveTeilnehmnerToDatabase(teilnehmer: Kampfteilnehmer): Observable<void> {
    console.log('saving: ' + teilnehmer.name)
    const kampfteilnehmer = {
      name: teilnehmer.name,
      json: JSON.stringify(teilnehmer)
    }
    return this.rest.post('kampf/gegner', kampfteilnehmer)
      .catch((error: any) => Observable.throw(error))
  }

  public getKampfteilnehmerByName(name: string): Observable<Kampfteilnehmer> {
    console.log('getting teilnehmer: ' + name)
    return this.rest.get('kampf/gegner/byname?name=' + name).map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error))
  }

  public getKampfnamen(): Observable<string[]> {
    return this.rest.get('kampf/kampf').map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error))
  }

  public getGegnernamen(): Observable<string[]> {
    return this.rest.get('kampf/gegner').map((response: Response) => response.json())
      .catch((error: any) => Observable.throw(error))
  }

  public prepareKampf(teilnehmer: Kampfteilnehmer[]) {
    teilnehmer.forEach(member => {
      member.currentLep = member.maxLep;
      member.ini = member.iniBase + Math.floor(6 * Math.random())
    })
  }

  public sortByIni(teilnehmer: Kampfteilnehmer[]): Kampfteilnehmer[] {
    return teilnehmer;
  }

  public reduceHealth(amount: number, teilnehmer: Kampfteilnehmer) {

    teilnehmer.currentLep -= (amount - teilnehmer.ruestung);
  }

  public reduceIni(amount: number, teilnehmer: Kampfteilnehmer) {
    teilnehmer.ini -= amount;
  }

  public addIni(amount: number, teilnehmer: Kampfteilnehmer) {
    teilnehmer.ini += amount;
  }






}
