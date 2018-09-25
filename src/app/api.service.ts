import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import * as myGlobals from './global';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  header: any = myGlobals.header;
  api_url: any = myGlobals.api_url;

  excelinsertapi: any = myGlobals.ExcelinsertAPI;
  chartapi: any = myGlobals.ChartAPI;

  // userid: any = localStorage.getItem('id');
  // useremail: any = localStorage.getItem('email');

  constructor(private http: HttpClient) { }

  /* EXCEL SHEET UPLOAD AND SAVE DATA */
  insertdata(data): Observable<any> {
    const endpoint = this.api_url + this.excelinsertapi;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'header': this.header
      })
    };
    var idata = { 'product': data};

    return this.http.post(endpoint, idata, httpOptions).pipe(
      map((res: any) => res));
  }

  chartdata(): Observable<any> {
    const endpoint = this.api_url + this.chartapi;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'header': this.header
      })
    };

    var idata = { 'product': '' };

    return this.http.post(endpoint, idata, httpOptions).pipe(
      map((res: any) => res));
  }
}
