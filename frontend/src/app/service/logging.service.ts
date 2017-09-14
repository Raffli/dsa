import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable()
export class LoggingService {

  constructor() { }

  public info(message: string) {
    console.log(message);
  }

  public error(message: string) {
    if (environment.production) {
      window.alert(message);
    } else {
      console.error(message);
    }
  }
}
