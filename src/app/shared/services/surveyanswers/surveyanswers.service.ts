import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Form } from "@angular/forms";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Surveyanswer } from "./surveyanswers.model";

@Injectable({
  providedIn: "root",
})
export class SurveyanswersService {
  // URL
  public urlSurveyanswer: string = environment.baseUrl + "v1/survey-answers/";

  // Data
  public Surveyanswer: Surveyanswer;
  public Surveyanswers: Surveyanswer[] = [];
  public SurveyanswersFiltered: Surveyanswer[] = [];

  constructor(private http: HttpClient) {}

  create(body: Form): Observable<Surveyanswer> {
    console.log(this.urlSurveyanswer);
    console.log(body);
    return this.http.post<any>(this.urlSurveyanswer, body).pipe(
      tap((res) => {
        console.log("Surveyanswers: ", res);
      })
    );
  }

  getAll(): Observable<Surveyanswer[]> {
    return this.http.get<Surveyanswer[]>(this.urlSurveyanswer).pipe(
      tap((res) => {
        console.log("Surveyanswers: ", res);
      })
    );
  }

  getOne(id: String): Observable<Surveyanswer> {
    let urlSurveyanswerOne = this.urlSurveyanswer + id + "/";
    return this.http.get<Surveyanswer>(urlSurveyanswerOne).pipe(
      tap((res) => {
        console.log("Surveyanswer: ", res);
      })
    );
  }

  update(id: String, body: Form): Observable<Surveyanswer> {
    let urlSurveyanswerOne = this.urlSurveyanswer + id + "/";
    console.log(urlSurveyanswerOne);
    console.log(body);
    return this.http.put<Surveyanswer>(urlSurveyanswerOne, body).pipe(
      tap((res) => {
        console.log("Surveyanswer", res);
      })
    );
  }

  filter(field: String): Observable<Surveyanswer[]> {
    let urlFilter = this.urlSurveyanswer + "?" + field + "/";
    return this.http.get<Surveyanswer[]>(urlFilter).pipe(
      tap((res) => {
        console.log("Surveyanswers", res);
      })
    );
  }
}
