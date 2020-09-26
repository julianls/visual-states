import { HttpClient, HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    // this.baseUrl = 'http://localhost:7071/';
  }

  private getUrl(path: string): string {
    return this.baseUrl + 'api/' + path;
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Access-Control-Allow-Origin', '*');
    // headers = headers.append('Content-Type', 'application/json');
    // let authToken = sessionStorage.getItem('auth_token');
    // headers = headers.append('Authorization', `Bearer ${authToken}`);
    return headers;
  }

  public getMachines(): Observable<any> {
    return this.http.get<object>(this.getUrl('GetMachines'), { headers: this.getHeaders() });
  }

}
