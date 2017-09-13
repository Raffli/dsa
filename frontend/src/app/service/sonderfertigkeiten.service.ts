import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Rx'
import {URLSearchParams, RequestOptionsArgs} from '@angular/http'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Http, Response} from "@angular/http"
import {RestService} from "./rest.service";
import {Sonderfertigkeit} from "../data/sonderfertigkeit";
@Injectable()
export class SonderfertigkeitenService {

  constructor(private rest: RestService) { }

  public getSfByName(name: string): Observable<Sonderfertigkeit> {
    return this.rest.get('sonderfertigkeiten/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }

  public getSfsByName(names: string[]): Observable<Sonderfertigkeit[]> {

    const options: RequestOptionsArgs = {
      params: {
        names: names
      }
    }
    return this.rest.getWithOptions('sonderfertigkeiten/bynames', options).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }



}
