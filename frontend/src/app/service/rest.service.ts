import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {environment} from '../../environments/environment'

@Injectable()
export class RestService {

  constructor(private http: Http) { }


  public get(adress: string) {
    return this.http.get(environment.rest + adress)
  }

  public  post(adress: string, body: any) {
    return this.http.post(environment.rest+ adress, body);
  }
}
