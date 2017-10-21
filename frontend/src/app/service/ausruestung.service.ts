import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import {RequestOptionsArgs, Response} from "@angular/http"
import {RestService} from "./rest.service";
import {Waffe} from "../data/ausruestung/Waffe";
import {FernkampfWaffe} from "../data/ausruestung/FernkampfWaffe";
import {Schild} from "../data/ausruestung/Schild";
import {Ruestung} from "../data/ausruestung/Ruestung";

@Injectable()
export class AusruestungService {

  constructor(private rest: RestService) { }

  public getWaffeByName(name: string): Observable<Waffe> {
    return this.rest.get('ausruestung/waffe/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error: any) => Observable.throw(error))
  }

  public getFkWaffeByName(name: string): Observable<FernkampfWaffe> {
    return this.rest.get('ausruestung/fkwaffe/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getSchildByName(name: string): Observable<Schild> {
    return this.rest.get('ausruestung/schild/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getRuestungByName(name: string): Observable<Ruestung> {
    return this.rest.get('ausruestung/ruestung/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getEquipmentByNameAndType(data: any[]): Observable<any[]> {
    return this.rest.post('ausruestung/bynames', data).map((res:Response) => res.json())
  }

}
