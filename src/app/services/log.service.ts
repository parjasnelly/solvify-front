import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor() {}

  writeLog(logtext: string) {
    console.log(logtext);
  }
}
