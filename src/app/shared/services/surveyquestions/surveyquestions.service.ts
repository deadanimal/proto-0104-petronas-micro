import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Form } from "@angular/forms";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Surveyquestion } from "./surveyquestions.model";

@Injectable({
  providedIn: "root",
})
export class SurveyquestionsService {
  // URL
  public urlSurveyquestion: string =
    environment.baseUrl + "v1/survey-questions/";

  // Data
  public Surveyquestion: Surveyquestion;
  public Surveyquestions: Surveyquestion[] = [];
  public SurveyquestionsFiltered: Surveyquestion[] = [];

  constructor(private http: HttpClient) {}

  create(body: Form): Observable<Surveyquestion> {
    console.log(this.urlSurveyquestion);
    console.log(body);
    return this.http.post<any>(this.urlSurveyquestion, body).pipe(
      tap((res) => {
        console.log("Surveyquestions: ", res);
      })
    );
  }

  getAll(): Observable<Surveyquestion[]> {
    return this.http.get<Surveyquestion[]>(this.urlSurveyquestion).pipe(
      tap((res) => {
        console.log("Surveyquestions: ", res);
      })
    );
  }

  getOne(id: String): Observable<Surveyquestion> {
    let urlSurveyquestionOne = this.urlSurveyquestion + id + "/";
    return this.http.get<Surveyquestion>(urlSurveyquestionOne).pipe(
      tap((res) => {
        console.log("Surveyquestion: ", res);
      })
    );
  }

  update(id: String, body: Form): Observable<Surveyquestion> {
    let urlSurveyquestionOne = this.urlSurveyquestion + id + "/";
    console.log(urlSurveyquestionOne);
    console.log(body);
    return this.http.put<Surveyquestion>(urlSurveyquestionOne, body).pipe(
      tap((res) => {
        console.log("Surveyquestion", res);
      })
    );
  }

  filter(field: String): Observable<Surveyquestion[]> {
    let urlFilter = this.urlSurveyquestion + "?" + field + "/";
    return this.http.get<Surveyquestion[]>(urlFilter).pipe(
      tap((res) => {
        console.log("Surveyquestions", res);
      })
    );
  }
}
