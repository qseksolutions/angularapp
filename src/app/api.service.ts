import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }

  getcurrencylist(): Observable<any>{
    // const endpoint = ;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'header': 'a2309455-13c0-4b5a-b9c1-5e9e65dc0704'
      })
    };

    // return this.http.get('https://qseksolutions.com/api/example/users').map((res: any) => res.json());
    return this.http.get('https://qseksolutions.com/api/example/users', httpOptions).pipe(
      map((res: any) => res));
  }

  insertdata(data): Observable<any> {
    const endpoint = 'https://qseksolutions.com/api/example/insert';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'header': 'a2309455-13c0-4b5a-b9c1-5e9e65dc0704'
      })
    };

    var idata = { 'product': data};

    return this.http.post(endpoint, idata, httpOptions).pipe(
      map((res: any) => res));
  }
}
