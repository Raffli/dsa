import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Talent} from "../data/talent";
import {TalentData} from "../data/talentdata";
import {Http, Response} from "@angular/http"
import {RestService} from "./rest.service";

@Injectable()
export class TalentService {

  constructor(private rest: RestService) { }

   public getTalentByName(name: string): Observable<TalentData> {
    return this.rest.get('talente/byname?name=' + name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }
}
