import { Injectable } from '@angular/core';
import {RestService} from "./rest.service";
import {Observable} from "rxjs";
import {Response} from "@angular/http";

@Injectable()
export class HeldenUpdaterService {

  constructor(private restService: RestService) { }


  public updateKey(key: string): Observable<Response> {
    return this.restService.post('held/access-key', key);
  }
}
