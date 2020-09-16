import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Form } from "@angular/forms";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Action } from "./actions.model";

@Injectable({
  providedIn: "root",
})
export class ActionsService {
  // URL
  public urlAction: string = environment.baseUrl + "v1/actions/";

  // Data
  public Action: Action;
  public Actions: Action[] = [];
  public ActionsFiltered: Action[] = [];

  constructor(private http: HttpClient) {}

  create(body: Form): Observable<Action> {
    console.log(this.urlAction);
    console.log(body);
    return this.http.post<any>(this.urlAction, body).pipe(
      tap((res) => {
        console.log("Actions: ", res);
      })
    );
  }

  getAll(): Observable<Action[]> {
    return this.http.get<Action[]>(this.urlAction).pipe(
      tap((res) => {
        console.log("Actions: ", res);
      })
    );
  }

  getOne(id: String): Observable<Action> {
    let urlActionOne = this.urlAction + id + "/";
    return this.http.get<Action>(urlActionOne).pipe(
      tap((res) => {
        console.log("Action: ", res);
      })
    );
  }

  update(id: String, body: Form): Observable<Action> {
    let urlActionOne = this.urlAction + id + "/";
    console.log(urlActionOne);
    console.log(body);
    return this.http.put<Action>(urlActionOne, body).pipe(
      tap((res) => {
        console.log("Action", res);
      })
    );
  }

  filter(field: String): Observable<Action[]> {
    let urlFilter = this.urlAction + "?" + field + "/";
    return this.http.get<Action[]>(urlFilter).pipe(
      tap((res) => {
        console.log("Actions", res);
      })
    );
  }
}
