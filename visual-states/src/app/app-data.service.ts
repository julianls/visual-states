import { HttpClient, HttpHeaders } from '@angular/common/http';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateModel } from './applogic/datamodel/state';
import { StateMachineModel } from './applogic/datamodel/state-machine';
import { TransitionModel } from './applogic/datamodel/transition';
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

  public getMachineModel(content: string): StateMachineModel {
    const model = JSON.parse(content);
    this.mapSerializedContent(model);
    const newModel = new StateMachineModel();
    Object.assign(newModel, model);
    return newModel;
  }

  private mapSerializedContent(state: StateModel): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < state.states.length; i++) {
      this.mapSerializedContent(state.states[i]);
      const newModel = new StateModel();
      Object.assign(newModel, state.states[i]);
      state.states[i] = newModel;
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < state.transitions.length; i++) {
      const newModel = new TransitionModel();
      Object.assign(newModel, state.transitions[i]);
      state.transitions[i] = newModel;
    }
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
