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
  statisticsapi: any = myGlobals.StatisticsAPI;

  // userid: any = localStorage.getItem('id');
  // useremail: any = localStorage.getItem('email');

  constructor(private http: HttpClient) { }

  /* EXCEL SHEET UPLOAD AND SAVE DATA */
  insertdata(data): Observable<any> {
    var body = new FormData();
    body.append("header", this.header);
    body.append("product", data);

    return this.http.post(this.api_url + this.excelinsertapi, body).pipe(map((response: any) => response));
  }

  /* STATISTICS FOR DASHBOARD */
  statistics(fromdate, todate){
    var body = new FormData();
    body.append("header", this.header);
    body.append("fromdate", fromdate);
    body.append("todate", todate);

    return this.http.post(this.api_url + this.statisticsapi, body).pipe(map((response: any) => response));
  }

  /* CHARTDATA FOR DASHBOARD */
  chartdata(): Observable<any> {
    var body = new FormData();
    body.append("header", this.header);

    return this.http.post(this.api_url + this.chartapi, body).pipe(map((response: any) => response));
  }
}
