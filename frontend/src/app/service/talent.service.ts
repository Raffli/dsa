import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Rx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import {Talent} from "../data/talent";
import {TalentData} from "../data/talentdata";

@Injectable()
export class TalentService {

  constructor(private http:HttpClient) { }

   public getTalentByName(name: string) : Observable<TalentData> {
    return this.http.get('/api/talente/byname?name='+name).map((res:Response) =>res.json())
      .catch((error:any) => Observable.throw(error))
  }
}
