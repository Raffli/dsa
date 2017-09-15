import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable()
export class LoggingService {

  constructor() { }

  public error(message: string,methodname: string) {

    if (environment.production) {
      window.alert(message);
    } else {
      console.error(methodname + ':' + message);
    }
  }
}
