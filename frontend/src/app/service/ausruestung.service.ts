import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

import {Http, Response} from "@angular/http"
import {RestService} from "./rest.service";
import {Waffe} from "../data/ausruestung/Waffe";
import {FernkampfWaffe} from "../data/ausruestung/FernkampfWaffe";

@Injectable()
export class AusruestungService {

  constructor(private rest: RestService) { }

  public getWaffeByName(name: string): Observable<Waffe> {
    return this.rest.get('/api/ausruestung/waffe/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getFkWaffeByName(name: string): Observable<FernkampfWaffe> {
    return this.rest.get('/api/ausruestung/fkwaffe/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

}
