import { HttpClient, HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Machine } from './core';

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

  public getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.getUrl('GetMachines'), { headers: this.getHeaders() });
  }

  public getMachine(id: string): Observable<Machine> {
    return this.http.get<Machine>(this.getUrl('GetMachine?id=' + id), { headers: this.getHeaders() });
  }

  public createMachine(machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(this.getUrl('CreateMachine'), machine, { headers: this.getHeaders() });
  }

  public updateMachine(machine: Machine): Observable<Machine> {
    return this.http.post<Machine>(this.getUrl('UpdateMachine'), machine, { headers: this.getHeaders() });
  }

  public deleteMachine(id: string): Observable<Machine> {
    return this.http.get<Machine>(this.getUrl('DeleteMachine?id=' + id), { headers: this.getHeaders() });
  }
}
